# Dockerfile.hardhat
FROM node:18

WORKDIR /usr/src/app

# copy package manifests for caching
COPY package*.json ./

# install deps
RUN npm ci

# copy source
COPY . .

# default command is overridden by compose
CMD ["bash"]
