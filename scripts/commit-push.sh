#!/usr/bin/env bash
# 整合脚本：提交和推送本地改动到 GitHub
# 支持 git add / git commit / git push + git lfs 配置
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# 选项
DO_PUSH=0
COMMIT_MSG=""
AUTO_LFS=0
LFS_THRESHOLD_BYTES=$((500 * 1024 * 1024))

usage() {
  cat <<'EOF'
用法: commit-push.sh [选项]

选项:
  --push              执行 git commit 后推送到 origin main
  -m "msg"            自定义提交信息（默认: site: update <timestamp>）
  --lfs               自动检测大文件并启用 git lfs
  --no-lfs            显式关闭 git lfs（默认）
  -h, --help          显示帮助

示例:
  ./commit-push.sh --push                  # 提交并推送
  ./commit-push.sh -m "fix: update docs" --push  # 自定义信息后推送
  ./commit-push.sh --push --lfs            # 提交推送并启用 git lfs
EOF
}

parse_args() {
  local prev_arg=""
  for arg in "$@"; do
    case "${arg}" in
      --push)
        DO_PUSH=1
        ;;
      --lfs)
        AUTO_LFS=1
        ;;
      --no-lfs)
        AUTO_LFS=0
        ;;
      -m)
        # 下一个参数是提交信息
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        # 如果上一个参数是 -m，则当前参数是提交信息
        if [[ "${prev_arg}" == "-m" ]]; then
          COMMIT_MSG="${arg}"
        else
          echo "错误: 未知参数 '${arg}'"
          usage
          exit 1
        fi
        ;;
    esac
    prev_arg="${arg}"
  done
}

git_add_changes() {
  echo "==> 暂存变更"
  cd "${SITE_DIR}"
  git add -A
}

check_git_changes() {
  cd "${SITE_DIR}"
  if git diff --cached --quiet; then
    echo "  没有待提交的变更"
    return 1
  fi
  return 0
}

setup_git_lfs() {
  if [[ "${AUTO_LFS}" != "1" ]]; then
    return 0
  fi

  if ! command -v git >/dev/null 2>&1; then
    echo "  git 未安装，跳过 lfs 配置"
    return 0
  fi

  if ! git lfs --version >/dev/null 2>&1; then
    echo "  git lfs 未安装，跳过自动配置"
    return 0
  fi

  cd "${SITE_DIR}"

  # 检测是否有大文件需要跟踪
  local dmg_files exe_files
  dmg_files=$(find . -name "*.dmg" -type f 2>/dev/null | head -5)
  exe_files=$(find . -name "*.exe" -type f 2>/dev/null | head -5)

  local need_lfs=0
  if [[ -n "${dmg_files}" ]]; then
    while IFS= read -r file; do
      local size
      if stat -f%z "${file}" >/dev/null 2>&1; then
        size=$(stat -f%z "${file}")
      else
        size=$(stat -c%s "${file}")
      fi
      if [[ ${size} -ge ${LFS_THRESHOLD_BYTES} ]]; then
        need_lfs=1
        break
      fi
    done <<< "${dmg_files}"
  fi

  if [[ ${need_lfs} -eq 0 && -n "${exe_files}" ]]; then
    while IFS= read -r file; do
      local size
      if stat -f%z "${file}" >/dev/null 2>&1; then
        size=$(stat -f%z "${file}")
      else
        size=$(stat -c%s "${file}")
      fi
      if [[ ${size} -ge ${LFS_THRESHOLD_BYTES} ]]; then
        need_lfs=1
        break
      fi
    done <<< "${exe_files}"
  fi

  if [[ ${need_lfs} -eq 1 ]]; then
    echo "==> 检测到大文件，配置 git lfs"
    git lfs install

    if [[ -n "${dmg_files}" ]]; then
      if ! grep -E '^\*.dmg[[:space:]].*filter=lfs' "${SITE_DIR}/.gitattributes" >/dev/null 2>&1; then
        git lfs track "*.dmg"
        echo "  已跟踪 *.dmg"
      fi
    fi

    if [[ -n "${exe_files}" ]]; then
      if ! grep -E '^\*.exe[[:space:]].*filter=lfs' "${SITE_DIR}/.gitattributes" >/dev/null 2>&1; then
        git lfs track "*.exe"
        echo "  已跟踪 *.exe"
      fi
    fi

    # 添加 .gitattributes
    if [[ -f "${SITE_DIR}/.gitattributes" ]]; then
      git add "${SITE_DIR}/.gitattributes"
    fi
  fi
}

git_commit() {
  if [[ -z "${COMMIT_MSG}" ]]; then
    COMMIT_MSG="site: update $(date +"%Y-%m-%d %H:%M:%S %z")"
  fi

  echo "==> 提交变更"
  cd "${SITE_DIR}"
  git commit -m "${COMMIT_MSG}"
  git log -1 --stat
}

git_push() {
  if [[ "${DO_PUSH}" != "1" ]]; then
    return 0
  fi

  if ! command -v git >/dev/null 2>&1; then
    echo "错误: git 未安装或不在 PATH 中"
    exit 1
  fi

  echo "==> 推送到 origin main"
  cd "${SITE_DIR}"

  GIT_SSH_COMMAND="ssh -i ~/.ssh/id_devops -o IdentitiesOnly=yes" \
    git push origin main

  echo "==> 推送完成"
  echo "    https://pinable.cc"
}

# 主流程
main() {
  parse_args "$@"

  if ! command -v git >/dev/null 2>&1; then
    echo "错误: git 未安装或不在 PATH 中"
    exit 1
  fi

  git_add_changes

  if ! check_git_changes; then
    if [[ "${DO_PUSH}" == "1" ]]; then
      echo "==> 无需提交，直接推送"
      git_push
    fi
    exit 0
  fi

  setup_git_lfs
  git_commit
  git_push
}

main "$@"
