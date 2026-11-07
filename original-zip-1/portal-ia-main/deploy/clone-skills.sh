#!/bin/sh
# Clones the skills repository into SKILLS_DIR for one job of the pipeline. Every job clones the channel again, and the channel
# can move between the first job and the last, so the image would carry content that the tests never saw. The first job (verify)
# passes the file to write: it records the commit it got in SKILLS_SHA, which GitLab hands to the next jobs as a variable. A job
# that finds SKILLS_SHA set puts the clone on that commit, and fails when it cannot. The channel is still what gets cloned.
set -eu

refuse() {
  echo "clone-skills: $1" >&2
  exit 1
}

dir=${SKILLS_DIR:?SKILLS_DIR is not set}
pin=${SKILLS_SHA:-}

# Only the branch of the channel: the validator of the skills compares the version of each plugin with the main when the clone has
# it, and between the merge of a skills MR and its release the main is ahead of the stable, so the release would read as a downgrade.
git clone --quiet --single-branch --branch "$SKILLS_REF" "${CI_SERVER_PROTOCOL}://gitlab-ci-token:${CI_JOB_TOKEN}@${CI_SERVER_FQDN}/${SKILLS_PROJECT_PATH}.git" "$dir"

if [ -n "$pin" ]; then
  printf '%s\n' "$pin" | grep -Eq '^[0-9a-f]{40}$' || refuse "SKILLS_SHA must be the full 40-character commit, not '$pin'."
  # -B points the local branch at the commit too, so the build still finds the ref at HEAD.
  git -C "$dir" checkout --quiet -B "$SKILLS_REF" "$pin" || refuse "the commit $pin of the first job is not in the clone of $SKILLS_REF."
  [ "$(git -C "$dir" rev-parse HEAD)" = "$pin" ] || refuse "the clone is not at $pin."
fi

# The clone keeps the URL it was made with in .git/config, token included, and .skills goes up to Cloud Build with its .git.
git -C "$dir" remote set-url origin "$SKILLS_REPO_URL"

sha=$(git -C "$dir" rev-parse HEAD)
echo "clone-skills: $SKILLS_REF at $sha"
if [ -n "${1:-}" ]; then printf 'SKILLS_SHA=%s\n' "$sha" > "$1"; fi
