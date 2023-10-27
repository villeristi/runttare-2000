ARG BASE_IMG=arm32v7/golang:1.21.1-bullseye

# base ------------------------------
FROM $BASE_IMG AS base

LABEL maintainer="Wille <villeristimaki@gmail.com>"

ENV CGO_ENABLED=1 \
    LC_ALL=C.UTF-8

WORKDIR /app

# Install Git & openssh-client
RUN apt-get update && apt-get install -y \
  git \
  openssh-client \
  tini \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/* \
  && mkdir -p -m 0700 ~/.ssh  \
  && ssh-keyscan github.com | sort > ~/.ssh/known_hosts

COPY go.mod .
COPY go.sum .

RUN --mount=type=ssh go mod download

COPY . .

# Build the worker
RUN go build -o cmd/worker cmd/runttare.go

# Move to /dist directory as the place for resulting binary folder
WORKDIR /dist

# Copy binary from build to main folder
RUN cp /app/cmd/worker .


# dev ------------------------------
FROM base AS development

COPY . /app

WORKDIR /app

RUN --mount=type=ssh \
      go install github.com/cespare/reflex@latest \
      && chmod a+x docker/entrypoint-dev.sh \
      && true

ENTRYPOINT ["/usr/bin/tini", "--", "/app/docker/entrypoint-dev.sh"]


# prod ------------------------------
FROM scratch

COPY --from=base /dist/worker /

# Command to run the executable
ENTRYPOINT ["/worker"]
