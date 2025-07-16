#!/bin/bash

set -e

VERSION="$1"
DATE="${2:-$(date +%Y.%m.%d)}"
CHANGELOG_FILE="CHANGELOG.md"

if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version> [date]"
  exit 1
fi

# Get latest tag (before this one)
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

if [ -n "$LAST_TAG" ]; then
  GIT_RANGE="$LAST_TAG..HEAD"
else
  GIT_RANGE="HEAD"
fi

COMMITS=$(git log "$GIT_RANGE" --pretty=format:"%s")

if [ -z "$COMMITS" ]; then
  echo "No new commits since last tag ($LAST_TAG)"
  exit 0
fi

# Initialize section strings
ADD=""
FIX=""
CHORE=""
REMOVE=""
REFACTOR=""
LIB=""

# Collect commits into sections
while IFS= read -r COMMIT; do
  TYPE=$(echo "$COMMIT" | sed -n 's/^\[\([A-Z]\+\)\].*/\1/p')
  MESSAGE=$(echo "$COMMIT" | sed -E 's/^\[[A-Z]+\] ?//')

  case "$TYPE" in
    ADD) ADD+="- $MESSAGE"$'\n' ;;
    FIX) FIX+="- $MESSAGE"$'\n' ;;
    CHORE) CHORE+="- $MESSAGE"$'\n' ;;
    REMOVE) REMOVE+="- $MESSAGE"$'\n' ;;
    REFACTOR) REFACTOR+="- $MESSAGE"$'\n' ;;
    LIB) LIB+="- $MESSAGE"$'\n' ;;
    *) ;; # ignore unknown types
  esac
done <<< "$COMMITS"

# Generate new changelog block
BLOCK="## v$VERSION - $DATE"$'\n'

if [ -n "$ADD" ]; then
  BLOCK+=$'\n'"### ADD"$'\n'"$ADD"
fi
if [ -n "$FIX" ]; then
  BLOCK+=$'\n'"### FIX"$'\n'"$FIX"
fi
if [ -n "$CHORE" ]; then
  BLOCK+=$'\n'"### CHORE"$'\n'"$CHORE"
fi
if [ -n "$REMOVE" ]; then
  BLOCK+=$'\n'"### REMOVE"$'\n'"$REMOVE"
fi
if [ -n "$REFACTOR" ]; then
  BLOCK+=$'\n'"### REFACTOR"$'\n'"$REFACTOR"
fi
if [ -n "$LIB" ]; then
  BLOCK+=$'\n'"### LIB"$'\n'"$LIB"
fi

# Prepend to changelog (or create new)
if [ -f "$CHANGELOG_FILE" ]; then
  TMP_FILE=$(mktemp)
  {
    echo "# Changelog"
    echo ""
    echo "$BLOCK"
    tail -n +2 "$CHANGELOG_FILE" | grep -v '^# Changelog' || true
  } > "$TMP_FILE"
  mv "$TMP_FILE" "$CHANGELOG_FILE"
else
  echo "# Changelog"$'\n' > "$CHANGELOG_FILE"
  echo "$BLOCK" >> "$CHANGELOG_FILE"
fi

echo "CHANGELOG.md updated for version $VERSION"
