# Use an official Node.js runtime as a parent image
FROM node:20.9.0-alpine

# Set the working directory to /app
WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the NestJS server with PM2
CMD ["pm2-runtime", "dist/main.js"]
