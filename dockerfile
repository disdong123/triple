# step 1
FROM --platform=linux/amd64 node:14-alpine as builder

# WORKDIR 을 설정합니다.
WORKDIR /app

COPY ./package*.json ./

RUN npm install

# build configuration
COPY tsconfig.json tsconfig.build.json nest-cli.json ./

# sources to build
COPY ./src ./src

# build sources
RUN npm run build

# step 2
FROM --platform=linux/amd64 node:14-alpine as runner

#
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD npm run start:prod