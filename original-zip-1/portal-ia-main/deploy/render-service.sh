#!/bin/sh
# Prints deploy/service.yaml with the values of the environment, for the deploy job and for scripts/service-yaml.test.ts.
# The required variables fail loudly when empty, and the optional ones fall back to the defaults of the README.
set -eu

here=$(dirname "$0")

for name in CLOUD_RUN_SERVICE GCP_RUNTIME_SERVICE_ACCOUNT IMAGE PORTAL_URL MICROSOFT_TENANT_ID MICROSOFT_CLIENT_ID \
  MICROSOFT_CLIENT_SECRET_NAME MICROSOFT_CLIENT_SECRET_VERSION SESSION_SECRET_NAME SESSION_SECRET_VERSION; do
  eval "value=\${$name:-}"
  [ -n "$value" ] || { echo "render-service: $name is empty or not set" >&2; exit 1; }
done

CLOUD_RUN_MIN_INSTANCES=${CLOUD_RUN_MIN_INSTANCES:-0}
CLOUD_RUN_MAX_INSTANCES=${CLOUD_RUN_MAX_INSTANCES:-3}
CLOUD_RUN_INGRESS=${CLOUD_RUN_INGRESS:-internal-and-cloud-load-balancing}
SESSION_DURATION_HOURS=${SESSION_DURATION_HOURS:-}
SHAREPOINT_ORIGIN=${SHAREPOINT_ORIGIN:-}
PUBLISHER_EMAILS=${PUBLISHER_EMAILS:-}
PUBLISH_BUCKET=${PUBLISH_BUCKET:-}
export CLOUD_RUN_MIN_INSTANCES CLOUD_RUN_MAX_INSTANCES CLOUD_RUN_INGRESS SESSION_DURATION_HOURS SHAREPOINT_ORIGIN PUBLISHER_EMAILS PUBLISH_BUCKET

# Only the names listed here are replaced, so a stray $ in the file stays as it is and the test catches it.
envsubst '${CLOUD_RUN_SERVICE} ${CLOUD_RUN_INGRESS} ${CLOUD_RUN_MIN_INSTANCES} ${CLOUD_RUN_MAX_INSTANCES}
${GCP_RUNTIME_SERVICE_ACCOUNT} ${IMAGE} ${PORTAL_URL} ${MICROSOFT_TENANT_ID} ${MICROSOFT_CLIENT_ID} ${SESSION_DURATION_HOURS} ${SHAREPOINT_ORIGIN}
${PUBLISHER_EMAILS} ${PUBLISH_BUCKET} ${MICROSOFT_CLIENT_SECRET_NAME} ${MICROSOFT_CLIENT_SECRET_VERSION} ${SESSION_SECRET_NAME} ${SESSION_SECRET_VERSION}' \
  < "$here/service.yaml" |
  if [ -n "$SESSION_DURATION_HOURS" ]; then cat; else sed '/name: SESSION_DURATION_HOURS/,+1d'; fi |
  if [ -n "$SHAREPOINT_ORIGIN" ]; then cat; else sed '/name: SHAREPOINT_ORIGIN/,+1d'; fi |
  if [ -n "$PUBLISHER_EMAILS" ]; then cat; else sed '/name: PUBLISHER_EMAILS/,+1d'; fi |
  if [ -n "$PUBLISH_BUCKET" ]; then cat; else sed '/name: PUBLISH_BUCKET/,+1d'; fi
