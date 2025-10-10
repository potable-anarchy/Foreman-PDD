#!/usr/bin/env bash
# Convenience wrapper for running Foreman CLI

set -e

# Ensure PDD_PATH is set
export PDD_PATH="${PDD_PATH:-$PWD}"

# Default spec if none provided
SPEC="${1:-foreman_agent}"
shift || true

# Check if foreman CLI is built
if [ ! -f "packages/foreman/dist/cli.js" ]; then
  echo "⚠️  Foreman CLI not built. Building now..."
  cd packages/foreman
  pnpm build
  cd ../..
fi

# Run the foreman CLI
echo "🏗️  Running Foreman for spec: $SPEC"
node packages/foreman/dist/cli.js build "$SPEC" --budget 10 --attempts 3 --coverage 80 "$@"
