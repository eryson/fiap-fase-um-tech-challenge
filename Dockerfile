FROM node:22-alpine

ARG VERSION
LABEL version="${VERSION}"

WORKDIR /app

COPY package*.json ./

COPY . .

RUN apk add --no-cache openssl musl-dev bash tzdata git ffmpeg && \
    cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && \
    echo "America/Sao_Paulo" > /etc/timezone && \
    rm -rf node_modules package-lock.json yarn.lock && \
    yarn install --mode=production

ENTRYPOINT ["sh", "/app/entrypoint.sh"]
