#!/usr/bin/env bash
# PinableAgents 官网部署脚本
# 验证站点文件 → git commit → git push → GitHub Pages 自动发布
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# ---------- 选项 ----------
DO_PUSH=0
COMMIT_MSG=""

usage() {
  cat <<'EOF'
用法: deploy.sh [--push] [-m "提交信息"]

选项:
  --push        提交后推送到 origin main
  -m "msg"      自定义提交信息（默认: site: update <timestamp>）
  -h, --help    显示帮助
EOF
}

for arg in "$@"; do
  case "${arg}" in
    --push)   DO_PUSH=1 ;;
    -m)       shift; COMMIT_MSG="${1:-}" ;;
    -h|--help) usage; exit 0 ;;
    *)
      if [[ -z "${COMMIT_MSG}" && "${prev_arg:-}" == "-m" ]]; then
        COMMIT_MSG="${arg}"
      else
        echo "未知参数: ${arg}"; usage; exit 1
      fi
      ;;
  esac
  prev_arg="${arg}"
done

# ---------- 站点检查 ----------
echo "==> 检查站点文件"

REQUIRED_FILES=(
  "index.html"
  "about.html"
  "contact.html"
  "privacy.html"
  "wiki.html"
  "CNAME"
  "robots.txt"
  "sitemap.xml"
  "assets/css/reset.css"
  "assets/css/site.css"
)

MISSING=0
for f in "${REQUIRED_FILES[@]}"; do
  if [[ ! -f "${SITE_DIR}/${f}" ]]; then
    echo "  缺失: ${f}"
    MISSING=1
  fi
done

if [[ "${MISSING}" == "1" ]]; then
  echo "站点文件不完整，请补齐后重试。"
  exit 1
fi

echo "  所有必需文件就绪"

# 检查 CNAME 内容
CNAME_CONTENT="$(cat "${SITE_DIR}/CNAME" | tr -d '[:space:]')"
if [[ "${CNAME_CONTENT}" != "pinable.cc" ]]; then
  echo "  警告: CNAME 内容为 '${CNAME_CONTENT}'，预期 'pinable.cc'"
fi

# 检查 wiki 目录
WIKI_COUNT="$(find "${SITE_DIR}/wiki" -name '*.html' -type f 2>/dev/null | wc -l | tr -d ' ')"
echo "  Wiki 文档: ${WIKI_COUNT} 个"

# ---------- 提交 ----------
echo "==> 检查变更"
cd "${SITE_DIR}"

if git diff --quiet && git diff --cached --quiet && [[ -z "$(git ls-files --others --exclude-standard)" ]]; then
  echo "  没有需要提交的变更。"
  if [[ "${DO_PUSH}" == "1" ]]; then
    echo "==> 推送到 origin main"
    GIT_SSH_COMMAND="ssh -i ~/.ssh/id_devops -o IdentitiesOnly=yes" \
      git push origin main
  fi
  exit 0
fi

if [[ -z "${COMMIT_MSG}" ]]; then
  COMMIT_MSG="site: update $(date +"%Y-%m-%d %H:%M:%S %z")"
fi

git add -A
git commit -m "${COMMIT_MSG}"
git log -1 --stat
echo "==> 提交完成"

# ---------- 推送 ----------
if [[ "${DO_PUSH}" == "1" ]]; then
  echo "==> 推送到 origin main"
  GIT_SSH_COMMAND="ssh -i ~/.ssh/id_devops -o IdentitiesOnly=yes" \
    git push origin main
  echo "==> 推送完成，等待 GitHub Pages 发布"
  echo "    https://pinable.cc"
fi
