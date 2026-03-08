@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

:: Redirect to root and run npm if in the scripts dir
if exist "..\bundles\overlay\src" (
  cd /d "%~dp0.."
  if not exist "node_modules" goto :repo_setup
  if not exist "bundles\overlay\node_modules" goto :repo_setup
  goto :repo_start
  :repo_setup
  echo Running first-time setup...
  call npm run setup
  if %ERRORLEVEL% NEQ 0 ( pause & exit /b %ERRORLEVEL% )
  :repo_start
  npm start
  exit /b %ERRORLEVEL%
)

:: Check if node is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Node.js is not installed.
  echo Please install Node.js 24 or later from https://nodejs.org/
  pause
  exit /b 1
)

:: Check if node version is >=24
for /f "tokens=1 delims=." %%v in ('node --version') do set "NODE_MAJOR=%%v"
set "NODE_MAJOR=%NODE_MAJOR:~1%"
if %NODE_MAJOR% LSS 24 (
  echo Your Node.js version %NODE_MAJOR% is too old and may not work correctly. Node.js 24 or later is required for this overlay.
  echo Please install Node.js 24 or later from https://nodejs.org/ or use nvm.
  pause
  exit /b 1
)

:: Install or update deps if package-lock.json is newer than last install
set "NEEDS_INSTALL=1"
if exist "node_modules\.package-lock.json" (
  for /f %%i in ('powershell -NoProfile -Command "if ((Get-Item 'package-lock.json').LastWriteTime -gt (Get-Item 'node_modules\.package-lock.json').LastWriteTime) { 'true' } else { 'false' }"') do set "NEWER=%%i"
  if "!NEWER!"=="false" set "NEEDS_INSTALL=0"
)
if "!NEEDS_INSTALL!"=="1" (
  echo Installing dependencies...
  call npm ci --omit=dev
  if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies.
    pause
    exit /b %ERRORLEVEL%
  )
)

echo Starting up...

node node_modules\nodecg\index.js

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo NodeCG exited with error code %ERRORLEVEL%.
  pause
)