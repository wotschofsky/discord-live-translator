FROM node:14-slim

# Update environment
RUN apt-get update; apt-get upgrade -y

# Install FFmpeg
RUN apt-get install ffmpeg -y

# Set directory
WORKDIR /app

# Install node modules
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

# Copy application files
COPY . .

# Create cache volume
VOLUME [ "./cache" ]

# Start app
CMD yarn start
