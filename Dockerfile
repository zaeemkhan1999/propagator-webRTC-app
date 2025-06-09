# Use a Node.js base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build
# Expose the development server port
EXPOSE 3000

# Add environment variable for Vite to enable host accessibility
ENV HOST=0.0.0.0

# Start the React app in development mode with Vite
CMD ["npm", "run", "dev"]
