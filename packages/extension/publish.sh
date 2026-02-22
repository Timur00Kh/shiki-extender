#!/usr/bin/env bash
set -e

ARG="${1:?Usage: ./publish.sh <version|patch|minor> (e.g. ./publish.sh 2026.0.1 or ./publish.sh patch)}"

EXT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$EXT_DIR"

case "$ARG" in
  patch|minor)
    VERSION=$(npm version "$ARG" --no-git-tag-version | sed 's/^v//')
    ;;
  *)
    VERSION="$ARG"
    npm version "$VERSION" --no-git-tag-version
    ;;
esac

REPO_ROOT="$(cd "$EXT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

git add packages/extension/package.json packages/extension/package-lock.json
git commit -m "chore: bump version to $VERSION"
git tag "v$VERSION"
git push && git push origin "v$VERSION"
