#!/bin/sh

checkForChangeAnd() {
    local changedFiles="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"
    echo "$changedFiles" | grep --quiet "$1" && eval "$2" || true
}

onPackageJsonHasChanged() {
    echo "Changes to package.json detected, installing updates"
    yarn install
}

checkForChangeAnd package.json onPackageJsonHasChanged
