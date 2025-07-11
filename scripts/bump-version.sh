#!/bin/bash

# Version Bumper Script
#
# This script bumps the version number in package.json and app.json,
# updates build numbers, and creates a git commit and tag.
#
# Usage:
#   ./bump-version.sh           # Bump patch version (default)
#   ./bump-version.sh --minor   # Bump minor version
#   ./bump-version.sh -m        # Bump minor version (short flag)
#   ./bump-version.sh --major   # Bump major version
#   ./bump-version.sh -M        # Bump major version (short flag)

set -e  # Exit on error

# Color and formatting
BOLD="\033[1m"
RESET="\033[0m"
BLUE="\033[34m"
GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"

# Log functions
log_info() {
  echo -e "${BLUE}ℹ️ ${BOLD}INFO:${RESET}${BLUE} $1${RESET}"
}

log_success() {
  echo -e "${GREEN}✅ ${BOLD}SUCCESS:${RESET}${GREEN} $1${RESET}"
}

log_warning() {
  echo -e "${YELLOW}⚠️ ${BOLD}WARNING:${RESET}${YELLOW} $1${RESET}"
}

log_error() {
  echo -e "${RED}❌ ${BOLD}ERROR:${RESET}${RED} $1${RESET}"
}

# Header
echo -e "\n${BOLD}${BLUE}📦 VERSION BUMPER SCRIPT ${RESET}\n"

# Parse arguments
BUMP_TYPE="patch"
for arg in "$@"; do
  case $arg in
    --minor|-m)
      BUMP_TYPE="minor"
      ;;
    --major|-M)
      BUMP_TYPE="major"
      ;;
  esac
done

# Get current version from package.json
CURRENT_VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
log_info "Current version: ${BOLD}$CURRENT_VERSION${RESET}"

# Parse version components
MAJOR=$(echo $CURRENT_VERSION | cut -d. -f1)
MINOR=$(echo $CURRENT_VERSION | cut -d. -f2)
PATCH=$(echo $CURRENT_VERSION | cut -d. -f3)

# Calculate new version based on bump type
if [ "$BUMP_TYPE" = "major" ]; then
  MAJOR=$((MAJOR + 1))
  MINOR=0
  PATCH=0
  log_info "🔼 Bumping ${BOLD}major${RESET} version..."
elif [ "$BUMP_TYPE" = "minor" ]; then
  MINOR=$((MINOR + 1))
  PATCH=0
  log_info "🔼 Bumping ${BOLD}minor${RESET} version..."
else
  PATCH=$((PATCH + 1))
  log_info "🔼 Bumping ${BOLD}patch${RESET} version..."
fi

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
log_success "New version: ${BOLD}$NEW_VERSION${RESET} 🎉"

# Calculate build numbers (MAJOR*1000000 + MINOR*1000 + PATCH)
BUILD_NUMBER=$((MAJOR * 1000000 + MINOR * 1000 + PATCH))
log_info "🏗️ New build number: ${BOLD}$BUILD_NUMBER${RESET}"

# Update package.json version
if sed -i.bak "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json; then
  rm package.json.bak
  log_success "📄 Updated ${BOLD}package.json${RESET}"
else
  log_error "Failed to update package.json"
  exit 1
fi

# Update app.json version and build numbers
# Version
if sed -i.bak "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" app.json; then
  rm app.json.bak
  log_success "📱 Updated version in ${BOLD}app.json${RESET}"
else
  log_error "Failed to update version in app.json"
  exit 1
fi

# iOS build number
if sed -i.bak "s/\"buildNumber\": \"[0-9]*\"/\"buildNumber\": \"$BUILD_NUMBER\"/" app.json; then
  rm app.json.bak
  log_success "🍎 Updated iOS build number in ${BOLD}app.json${RESET}"
else
  log_error "Failed to update iOS build number"
  exit 1
fi

# Android version code
if sed -i.bak "s/\"versionCode\": [0-9]*/\"versionCode\": $BUILD_NUMBER/" app.json; then
  rm app.json.bak
  log_success "🤖 Updated Android version code in ${BOLD}app.json${RESET}"
else
  log_error "Failed to update Android version code"
  exit 1
fi

# Git commit and tag
echo -e "\n${BOLD}${BLUE}🔄 PERFORMING GIT OPERATIONS ${RESET}\n"

log_info "📝 Adding files to git..."
if git add package.json app.json; then
  log_success "Files added to git staging"
else
  log_error "Failed to add files to git"
  exit 1
fi

log_info "💾 Creating commit..."
if git commit -m "v$NEW_VERSION"; then
  log_success "Commit created: ${BOLD}v$NEW_VERSION${RESET}"
else
  log_error "Failed to create git commit"
  exit 1
fi

log_info "🏷️ Creating tag..."
if git tag "v$NEW_VERSION"; then
  log_success "Git tag created: ${BOLD}v$NEW_VERSION${RESET}"
else
  log_error "Failed to create git tag"
  exit 1
fi

log_info "🚛 Pushing tag..."
if git push origin --tags; then
  log_success "Git tag pushed: ${BOLD}v$NEW_VERSION${RESET}"
else
  log_error "Failed to push git tag"
  exit 1
fi

echo -e "\n${GREEN}${BOLD}🚀 VERSION BUMP COMPLETE! ${RESET}\n"
echo -e "${BOLD}Summary:${RESET}"
echo -e "  📦 Version: ${BOLD}$CURRENT_VERSION${RESET} → ${BOLD}$NEW_VERSION${RESET}"
echo -e "  🏗️ Build Number: ${BOLD}$BUILD_NUMBER${RESET}"
echo -e "  💾 Git Tag: ${BOLD}v$NEW_VERSION${RESET}"
echo -e "\n${BLUE}${BOLD}Have a great day! 😊${RESET}\n"