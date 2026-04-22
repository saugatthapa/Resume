#!/bin/sh
set -eu

pnpm install --no-frozen-lockfile
pnpm --filter @workspace/resume-tools build

if [ -d artifacts/resume-tools/dist/public ]; then
  SRC="artifacts/resume-tools/dist/public"
elif [ -d dist/public ]; then
  SRC="dist/public"
else
  echo "Could not find built frontend output directory." >&2
  exit 1
fi

rm -rf public
mkdir -p public
cp -R "$SRC"/. public/
