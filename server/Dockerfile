FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose ports (Express and Socket.io)
EXPOSE 3300 3301

# Start the application
CMD ["node", "main.js"]
