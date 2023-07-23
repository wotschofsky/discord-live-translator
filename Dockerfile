FROM node:18-slim

# Update environment
RUN apt-get update && apt-get upgrade -y

# Install system dependencies
RUN apt-get install -y --no-install-recommends \
    ca-certificates \
    espeak-ng \
    ffmpeg \
    g++ \
    gcc \
    # libsndfile required for Whisper bindings
    libsndfile1 \
    libsndfile1-dev \
    # libsqlite3-dev required for Python
    libsqlite3-dev \
    make \
    wget

# Add Python
COPY --from=python:3.10-slim /usr/local /usr/local

# Set directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY src/lib/tts/preload_models.py src/lib/tts/
RUN python3 src/lib/tts/preload_models.py

# Install Node.js dependencies
COPY package.json yarn.lock .
RUN yarn install --frozen-lockfile --ignore-scripts && \
    yarn cache clean

# Download whisper.cpp model
RUN mkdir models/ && \
    wget https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin --progress=bar:force:noscroll -P models/

# Copy application files
COPY . .

# Build application
RUN yarn build

# Create cache volume
VOLUME [ "/app/cache" ]

# Start app
CMD yarn start
