#!/bin/bash
set -e

echo "🏗️  Building Maven project..."

mkdir -p "$MAVEN_CONFIG"

GITHUB_TOKEN=$(grep -oPm1 "(?<=<password>)[^<]+" /run/secrets/github_token 2>/dev/null || cat /run/secrets/github_token 2>/dev/null || true)
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN is empty! Check your secret mount or file."
  exit 1
fi

echo "✅ Token loaded, length: ${#GITHUB_TOKEN}"

export GITHUB_TOKEN
envsubst < "$MAVEN_CONFIG/settings.xml.template" > "$MAVEN_CONFIG/settings.xml"
unset GITHUB_TOKEN

echo "📝 Generated $MAVEN_CONFIG/settings.xml"
mvn clean install -Dmaven.test.skip=true -P production


echo "✅ Build finished successfully."
