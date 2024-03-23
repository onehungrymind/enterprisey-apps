# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=20.11.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing production dependecies.
FROM base as deps

ARG SERVER_DIR=users

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm set maxsockets 1 && npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

ARG SERVER_DIR=users

RUN apk add --no-cache python3 make g++

# Copy the rest of the source files into the image.
COPY package.json .
COPY package-lock.json .
COPY jest.preset.js .
COPY jest.config.ts .
COPY tsconfig.base.json .
COPY nx.json .
COPY ./libs ./libs
COPY ./remote/${SERVER_DIR} ./remote/${SERVER_DIR}
COPY ./databases ./databases

 # Build the application.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm set maxsockets 1 && npm ci
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npx nx build ${SERVER_DIR}-api



################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

RUN apk add --no-cache dumb-init

ARG SERVER_DIR=users

# Use production node environment by default.
ENV NODE_ENV production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist/remote/${SERVER_DIR} ./
COPY --from=build /usr/src/app/databases ./databases


# Expose the port that the application listens on.
ENV PORT 3500
EXPOSE 3500

# Run the application.
ENTRYPOINT ["dumb-init", "--"]
CMD node main.js
