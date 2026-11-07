# Both stages start from the same image, pinned by digest so a build does not change when the tag is republished: the index
# of node:24.21.0-slim, read on 2026-10-07. To update, change the tag and the digest together.
FROM node:24.21.0-slim@sha256:d6aa754f16b3197301076f047b5def2f02ea1dbbc2ca920407d46d7ec7f87b20 AS build
# The catalog is built from a clone of the skills repository, with its history, in .skills (see the README). With no
# SKILLS_REF, the catalog shows the branch of the clone. Cloud Build cannot pass a build argument with --tag, and the CI
# clones the ref it wants, so the label is always the real one.
ARG SKILLS_REF=
ENV SKILLS_DIR=/app/.skills SKILLS_REF=$SKILLS_REF
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# The build variables that are not in SKILLS_REF come in .build-env, a file of the context with KEY=value lines (the CI writes
# it, because Cloud Build cannot pass build arguments with --tag). The loop only exports each line, and never runs it.
RUN if [ -f .build-env ]; then while IFS='=' read -r key value; do [ -z "$key" ] || export "$key=$value"; done < .build-env; fi && npm run build

# node:24.21.0-slim, the same digest as above.
FROM node:24.21.0-slim@sha256:d6aa754f16b3197301076f047b5def2f02ea1dbbc2ca920407d46d7ec7f87b20
ENV NODE_ENV=production PORT=8080
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist/client ./dist/client
COPY bff ./bff
COPY src/shared ./src/shared
USER node
EXPOSE 8080
# Only for Docker. Cloud Run ignores it and uses the probes of deploy/service.yaml.
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 8080) + '/health').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"
CMD ["node", "bff/index.ts"]
