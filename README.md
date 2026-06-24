# pinable.cc

## Maintenance

To rewrite the repository into a single anonymous commit and clear GitHub-side history artifacts, run:

```bash
CONFIRM=YES ./scripts/wipe-github-history.sh
```

Optional environment variables:

```bash
REMOTE=origin
BRANCH=main
AUTHOR_NAME=Anonymous
AUTHOR_EMAIL=anonymous@invalid
COMMIT_MESSAGE="Initial commit"
```
