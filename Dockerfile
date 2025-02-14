ARG NODE_VERSION=20.12.2
ARG NODE_ENV=production
ARG PORT=3000
ARG HOSTNAME=0.0.0.0

# Create build stage
FROM node:${NODE_VERSION}-alpine AS base

# Define environment variables
ENV NODE_ENV=${NODE_ENV}

# Set the working directory inside the container.
WORKDIR /app

# Create build stage.
FROM base AS build

# Copy package.json and yarn.lock files to the working directory.
COPY ./package.json .
COPY ./yarn.lock .

# Install dependencies.
RUN yarn install --production=false --frozen-lockfile

# Copy the rest of the application files to the working directory.
COPY . .

# Build the application.
RUN yarn build

# Create a new stage for the production image.
FROM base

# Define environment variables.
ENV PORT=${PORT}
ENV HOSTNAME=${HOSTNAME}

# Copy the output from the build stage to the working directory.
COPY --from=build /app/.output /app/.output

# Expose the port the application will run on.
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]
