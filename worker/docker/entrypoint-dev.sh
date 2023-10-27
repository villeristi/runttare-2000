#!/bin/bash -l
set -e

# Reload on .go & .mod changes (https://github.com/cespare/reflex)
exec $GOPATH/bin/reflex -r '(\.go$|go\.mod)' -d none -s -- sh -c "/usr/local/go/bin/go run cmd/runttare.go $*"
