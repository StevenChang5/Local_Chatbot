FROM node:23.11
WORKDIR /app

# Install dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

# Copy files into image
COPY . .

# Expose port that app runs on 
EXPOSE 3000 
# Make accessible from outside the container
ENV HOST=0.0.0.0
# Run server
CMD ["npm", "start"]
