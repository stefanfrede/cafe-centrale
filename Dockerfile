ARG NODE_VERSION=22.14.0

# Use Node as base for Docker Build
FROM node:${NODE_VERSION}-alpine

# Createt the working directory in the container
RUN  mkdir -p /home/node/app/node_modules \
	&& mkdir -p /home/node/app/_dist \
	&& chown -R node:node /home/node/app

# Ensure that all application files are owned by the non-root node user
USER node

# Set the working directory in the container
WORKDIR /home/node/app

# Copy the package.json and package-lock.json files
COPY package*.json .

# Install any needed dependencies specified in package.json
RUN npm ci

# Copy the application code with the appropriate permissions to the application directory on the container
COPY --chown=node:node . .

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Start Eleventy Dev Server
CMD [ "npm", "run", "start" ]
