#!/bin/bash
# Foreman convenience wrapper

SPEC="${1:-demo_todo}"
BUDGET="${2:-10.00}"
ATTEMPTS="${3:-3}"
COVERAGE="${4:-80}"

echo "🏗️  Running Foreman Agent"
echo "   Spec: $SPEC"
echo "   Budget: \$$BUDGET"
echo "   Max Attempts: $ATTEMPTS"
echo "   Coverage: $COVERAGE%"
echo ""

node dist/cli.js build "$SPEC" --budget "$BUDGET" --attempts "$ATTEMPTS" --coverage "$COVERAGE"
