#!/bin/sh
set -e

echo "🏗️ Building Node project..."

GITHUB_TOKEN=$(sed -n 's:.*<password>\(.*\)</password>.*:\1:p' /run/secrets/github_token | head -n1)
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN is empty! Check your secret mount or file."
  exit 1
fi

echo "✅ Token loaded, length: ${#GITHUB_TOKEN}"

export GITHUB_TOKEN
envsubst < "/root/.npmrc.template" > "/root/.npmrc"
unset GITHUB_TOKEN

echo "📝 Generated /root/.npmrc"
cd src/main/frontend
echo "🛠️ Installing node dependencies"
npm i --userconfig /root/.npmrc
echo "🏗️ Building Angular"
ng b --configuration production


echo "✅ Build finished successfully."
