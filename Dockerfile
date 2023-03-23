# Use node as a base image
FROM node:18

# Create app work directory
WORKDIR /app

# Install Redis server
RUN apt-get update && apt-get install -y redis-server

# Install pm2
RUN npm install pm2 -g

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port for API
EXPOSE 80

# Build the app
RUN npm run build

# Start the app
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
