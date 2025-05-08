FROM node:23.11
WORKDIR /app
# Install dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

# Copy files into image
COPY . .
# Run server
CMD ["node", "index.js"]
