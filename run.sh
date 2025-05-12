#!/bin/bash

# ======================================
# Run script for the Node.js TypeScript server
# 1. Compiles TypeScript files
# 2. Runs the compiled output
# ======================================

# Define paths
ENTRY="main.ts"
BUILD_DIR="dist"
OUT_FILE="$BUILD_DIR/main.js"

# Compile TypeScript
echo "🔧 Compiling TypeScript..."
npx tsc

# Check if compilation succeeded
if [ $? -ne 0 ]; then
  echo "❌ Compilation failed. Exiting."
  exit 1
fi

# Run the compiled file
echo "🚀 Starting server..."
node "$OUT_FILE"
