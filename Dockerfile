FROM node:10.15.3
COPY --from=emurgo/seiza-src:latest /src /src
WORKDIR /src

RUN npm install -g yarn && \
    yarn install && \
    cd /src/frontend && \
    yarn install && \
    yarn build && \
    cd /src/graphql-server && \
    yarn install && \
    yarn build
