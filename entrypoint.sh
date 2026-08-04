#!/bin/bash

cd /app

if [ "$TIMEZONE" != "America/Sao_Paulo" ]; then
  echo "Setting timezone to $TIMEZONE"
  ln -snf /usr/share/zoneinfo/$TIMEZONE /etc/localtime
  echo $TIMEZONE > /etc/timezone
fi

cp .env-example .env

npx ts-node --transpile-only src/main/server.ts