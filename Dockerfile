FROM --platform=amd64 node:16-slim

# Update environment
RUN apt-get update; apt-get upgrade -y

# Install system dependencies
RUN apt-get install ffmpeg make gcc g++ wget -y

# Set directory
WORKDIR /app

# Install node modules
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile && \
    yarn cache clean

# Build whisper.cpp in whisper-node and download model
RUN (cd node_modules/whisper-node/lib/whisper.cpp/; make)
RUN wget https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin -P node_modules/whisper-node/lib/whisper.cpp/models/

# Copy application files
COPY . .

# Build application
RUN yarn build

# Create cache volume
VOLUME [ "/app/cache" ]

# Start app
CMD yarn start
