# Use a Node.js base image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and the lockfile to leverage Docker layer caching
# A wildcard is used to copy package-lock.json if it exists
COPY package*.json ./

# Install all dependencies, including devDependencies
RUN npm install

# Copy the rest of the application's source code
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# The command to run the application in development mode with live-reloading
CMD ["npm", "run", "dev"]
