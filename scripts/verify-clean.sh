#!/bin/bash

# Script to verify that the clean process worked correctly

echo "Verifying clean process..."

# Check for node_modules directories
NODE_MODULES_COUNT=$(find . -name "node_modules" -type d | wc -l)
if [ $NODE_MODULES_COUNT -eq 0 ]; then
  echo "✅ No node_modules directories found"
else
  echo "❌ Found $NODE_MODULES_COUNT node_modules directories"
fi

# Check for .next directories
NEXT_COUNT=$(find . -name ".next" -type d | wc -l)
if [ $NEXT_COUNT -eq 0 ]; then
  echo "✅ No .next directories found"
else
  echo "❌ Found $NEXT_COUNT .next directories"
fi

# Check for .turbo directories
TURBO_COUNT=$(find . -name ".turbo" -type d | wc -l)
if [ $TURBO_COUNT -eq 0 ]; then
  echo "✅ No .turbo directories found"
else
  echo "❌ Found $TURBO_COUNT .turbo directories"
fi

echo "Verification complete!" 