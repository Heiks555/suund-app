#!/bin/zsh
cd "$(dirname "$0")"
CI=1 ./node_modules/.bin/expo start --web
