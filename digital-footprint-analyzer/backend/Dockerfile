# Use Node 18 Alpine for small image
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Set environment
ENV NODE_ENV=production

# Expose internal port
EXPOSE 5001

# Run the server
CMD ["node", "index.js"]
