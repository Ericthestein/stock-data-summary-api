# Use node as a base image
FROM node:18

# Create app work directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Run app on port 8000
EXPOSE 8000

# Build the app
RUN npm run build

# Start the app
CMD ["npm", "start"]