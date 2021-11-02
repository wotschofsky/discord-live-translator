FROM node:14-slim

# Update environment
RUN apt-get update; apt-get upgrade -y

# Install FFmpeg
RUN apt-get install ffmpeg -y

# Install Python and pip
RUN apt-get install python3 python3-pip -y

# Install Mozilla DeepSpeech
RUN pip3 install deepspeech

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
