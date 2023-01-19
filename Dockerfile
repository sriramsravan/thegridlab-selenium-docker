# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the application's dependencies
RUN npm ci

# Copy the rest of the application's files to the container
COPY . .

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
