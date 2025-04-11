# Generated by https://smithery.ai. See: https://smithery.ai/docs/config#dockerfile
FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Install dependencies without running scripts to avoid any unwanted pre-build scripts
RUN npm install --ignore-scripts

# Copy the rest of the project files
COPY . .

# Build the project
RUN npm run build

# Expose any port if required (MCP likely uses stdio but if needed)
# ENV PORT=3000

# Start the MCP server
CMD [ "npm", "start" ]
