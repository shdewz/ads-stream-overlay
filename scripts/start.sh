#!/bin/bash
cd "$(dirname "$0")"

# Redirect to root and run npm if in the scripts dir
if [ -d "../bundles/overlay/src" ]; then
  cd ..
  if [ ! -d "node_modules" ] || [ ! -d "bundles/overlay/node_modules" ]; then
    echo "Running first-time setup..."
    npm run setup
  fi
  exec npm start
fi

# Check if node exists and its version
if ! command -v node &>/dev/null; then
  echo "Node.js is not installed. Please install Node.js 24 or later."
  exit 1
fi

NODE_MAJOR=$(node --version | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 24 ]; then
  echo "Node.js version $NODE_MAJOR is too old. Node.js 24 or later is required."
  exit 1
fi

if [ ! -f "node_modules/.package-lock.json" ] || [ "package-lock.json" -nt "node_modules/.package-lock.json" ]; then
  echo "Installing dependencies..."
  npm ci --omit=dev
fi

node node_modules/nodecg/index.js
