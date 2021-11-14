FROM node:16-slim

# Update environment
RUN apt-get update; apt-get upgrade -y

# Install FFmpeg
RUN apt-get install ffmpeg -y

# Install Python and pip
RUN apt-get install python3 python3-pip -y

# Set directory
WORKDIR /app

# Install node modules
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile && \
    yarn cache clean

# Copy application files
COPY . .

# Create cache volume
VOLUME [ "/app/cache" ]

# Start app
CMD yarn start
