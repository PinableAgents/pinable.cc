#!/usr/bin/env bash

set -euo pipefail

REMOTE="${REMOTE:-origin}"
BRANCH="${BRANCH:-main}"
AUTHOR_NAME="${AUTHOR_NAME:-Anonymous}"
AUTHOR_EMAIL="${AUTHOR_EMAIL:-anonymous@invalid}"
COMMIT_MESSAGE="${COMMIT_MESSAGE:-Initial commit}"
CONFIRM="${CONFIRM:-YES}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

say() {
  printf '[wipe] %s\n' "$*"
}

repo_root() {
  git rev-parse --show-toplevel
}

current_branch() {
  git symbolic-ref --quiet --short HEAD
}

delete_local_tags() {
  local tags
  tags="$(git tag)"
  if [[ -z "$tags" ]]; then
    say "No local tags to delete"
    return
  fi

  while IFS= read -r tag; do
    [[ -z "$tag" ]] && continue
    git tag -d "$tag" >/dev/null
    say "Deleted local tag: $tag"
  done <<<"$tags"
}

delete_remote_tags() {
  local tags
  tags="$(git ls-remote --tags --refs "$REMOTE" | awk '{print $2}' | sed 's#refs/tags/##')"
  if [[ -z "$tags" ]]; then
    say "No remote tags to delete"
    return
  fi

  while IFS= read -r tag; do
    [[ -z "$tag" ]] && continue
    git push "$REMOTE" ":refs/tags/$tag" >/dev/null
    say "Deleted remote tag: $tag"
  done <<<"$tags"
}

delete_actions_runs() {
  local runs id
  runs="$(gh api "repos/$OWNER/$REPO/actions/runs" --paginate --jq '.workflow_runs[].id' 2>/dev/null || true)"
  if [[ -z "$runs" ]]; then
    say "No GitHub Actions runs to delete"
    return
  fi

  while IFS= read -r id; do
    [[ -z "$id" ]] && continue
    if gh api -X DELETE "repos/$OWNER/$REPO/actions/runs/$id" >/dev/null 2>&1; then
      say "Deleted Actions run: $id"
    else
      say "Skipped Actions run (already gone?): $id"
    fi
  done <<<"$runs"
}

delete_deployments() {
  local ids id
  ids="$(gh api "repos/$OWNER/$REPO/deployments" --paginate --jq '.[].id' 2>/dev/null || true)"
  if [[ -z "$ids" ]]; then
    say "No deployments to delete"
    return
  fi

  while IFS= read -r id; do
    [[ -z "$id" ]] && continue
    gh api --method POST "repos/$OWNER/$REPO/deployments/$id/statuses" \
      -f state=inactive \
      -f description='cleanup deployment history' >/dev/null 2>&1 || true

    if gh api --method DELETE "repos/$OWNER/$REPO/deployments/$id" >/dev/null 2>&1; then
      say "Deleted deployment: $id"
    else
      say "Skipped deployment (already gone?): $id"
    fi
  done <<<"$ids"
}
delete_releases() {
  local releases id
  releases="$(gh api "repos/$OWNER/$REPO/releases" --paginate --jq '[.[].id] | .[1:] | .[]' 2>/dev/null || true)"
  if [[ -z "$releases" ]]; then
    say "No releases to delete"
    return
  fi

  while IFS= read -r id; do
    [[ -z "$id" ]] && continue
    if gh api -X DELETE "repos/$OWNER/$REPO/releases/$id" >/dev/null 2>&1; then
      say "Deleted release: $id"
    else
      say "Skipped release (already gone?): $id"
    fi
  done <<<"$releases"
}


delete_environments() {
  local envs env
  envs="$(gh api "repos/$OWNER/$REPO/environments" --jq '.environments[].name' 2>/dev/null || true)"
  if [[ -z "$envs" ]]; then
    say "No environments to delete"
    return
  fi

  while IFS= read -r env; do
    [[ -z "$env" ]] && continue
    if gh api --method DELETE "repos/$OWNER/$REPO/environments/$env" >/dev/null 2>&1; then
      say "Deleted environment: $env"
    else
      say "Skipped environment: $env"
    fi
  done <<<"$envs"
}

rewrite_history() {
  local tree commit
  git add -A
  tree="$(git write-tree)"
  commit="$(
    GIT_AUTHOR_NAME="$AUTHOR_NAME" \
    GIT_AUTHOR_EMAIL="$AUTHOR_EMAIL" \
    GIT_COMMITTER_NAME="$AUTHOR_NAME" \
    GIT_COMMITTER_EMAIL="$AUTHOR_EMAIL" \
    git commit-tree "$tree" -m "$COMMIT_MESSAGE"
  )"
  git reset --hard "$commit" >/dev/null
  say "Rewrote history to a single root commit: $commit"
}

verify_clean_target_branch() {
  local branch
  branch="$(current_branch)"
  if [[ "$branch" != "$BRANCH" ]]; then
    echo "Current branch is '$branch', expected '$BRANCH'" >&2
    echo "Switch branches first or override BRANCH=..." >&2
    exit 1
  fi
}

confirm_or_exit() {
  cat <<EOF
This will destructively rewrite the repository and remote:
  - rewrite '$BRANCH' to one anonymous root commit
  - delete all local and remote tags
  - delete GitHub Actions runs
  - delete GitHub deployments
  - delete releases (keeps latest)
  - delete GitHub environments
  - force-push '$REMOTE/$BRANCH'

Repository: $OWNER/$REPO
Remote:     $REMOTE
Branch:     $BRANCH
EOF

  if [[ "$CONFIRM" == "YES" ]]; then
    return
  fi

  printf "Type YES to continue: "
  read -r answer
  if [[ "$answer" != "YES" ]]; then
    echo "Aborted"
    exit 1
  fi
}

require_cmd git
require_cmd gh
require_cmd awk
require_cmd sed

cd "$(repo_root)"
verify_clean_target_branch

OWNER_REPO="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
OWNER="${OWNER_REPO%%/*}"
REPO="${OWNER_REPO##*/}"

confirm_or_exit

rewrite_history
delete_local_tags
delete_remote_tags
git push --force "$REMOTE" "$BRANCH"
say "Force-pushed $REMOTE/$BRANCH"
delete_actions_runs
delete_deployments
delete_environments
delete_releases

say "Done"
