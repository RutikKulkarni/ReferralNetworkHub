FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Copy source code
COPY . .
COPY tsconfig.json .

# Install dependencies
RUN npm install

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start the service
CMD ["node", "dist/server.js"]

