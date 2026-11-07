#!/bin/sh
# Writes the .build-env that the Dockerfile reads, from SKILLS_REPO_URL, SKILLS_CHANNEL and SHAREPOINT_ORIGIN, after checking them. Cloud Build cannot
# pass build arguments with --tag, so the values travel in a file of the context, and a line break or a stray character in one of them
# would add a variable the Dockerfile exports. Nothing is written when a value is refused.
set -eu

refuse() {
  echo "write-build-env: $1" >&2
  exit 1
}

url=${SKILLS_REPO_URL:-}
channel=${SKILLS_CHANNEL:-}
sharepoint=${SHAREPOINT_ORIGIN:-}
break_lf='
'
break_cr=$(printf '\r')

for value in "$url" "$channel" "$sharepoint"; do
  case "$value" in
    *"$break_lf"* | *"$break_cr"*) refuse "a value has a line break" ;;
  esac
done

printf '%s\n' "$url" | grep -Eq '^https://[A-Za-z0-9.-]+(:[0-9]+)?/[A-Za-z0-9._~/-]+\.git$' ||
  refuse "SKILLS_REPO_URL must be an https clone URL ending in .git, with no credential, query or space."
[ -z "$channel" ] || printf '%s\n' "$channel" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9._/-]{0,99}$' ||
  refuse "SKILLS_CHANNEL must be the name of a branch, like stable."
[ -z "$sharepoint" ] || printf '%s\n' "$sharepoint" | grep -Eq '^https://[a-z0-9-]+\.sharepoint\.com$' ||
  refuse "SHAREPOINT_ORIGIN must be an https origin under sharepoint.com, like https://empresa.sharepoint.com."

printf 'SKILLS_REPO_URL=%s\nSKILLS_CHANNEL=%s\nSHAREPOINT_ORIGIN=%s\n' "$url" "$channel" "$sharepoint" > "${1:-.build-env}"
