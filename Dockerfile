FROM node:16-slim as build-python

# Update environment
RUN apt-get update && apt-get upgrade -y

# Install system dependencies
RUN apt-get install -y --no-install-recommends \
    ca-certificates \
    dpkg-dev \
    gcc \
    libbluetooth-dev \
    libbz2-dev \
    libc6-dev \
    libexpat1-dev \
    libffi-dev \
    libgdbm-dev \
    liblzma-dev \
    libncursesw5-dev \
    libreadline-dev \
    libsqlite3-dev \
    libssl-dev \
    make \
    tk-dev \
    uuid-dev \
    wget \
    xz-utils \
    zlib1g-dev

# Download and compile Python
ENV PYTHON_VERSION 3.10.0
RUN wget -O python.tar.xz "https://www.python.org/ftp/python/${PYTHON_VERSION%%[a-z]*}/Python-$PYTHON_VERSION.tar.xz" && \
    mkdir -p /usr/src/python && \
    tar -xJC /usr/src/python --strip-components=1 -f python.tar.xz && \
    rm python.tar.xz && cd /usr/src/python && \
    ./configure --enable-optimizations && \
    make -j "$(nproc)" && \
    make install

FROM node:16-slim

# Update environment
RUN apt-get update && apt-get upgrade -y

# Install system dependencies
RUN apt-get install -y --no-install-recommends \
    ca-certificates \
    espeak-ng \
    ffmpeg \
    g++ \
    gcc \
    # libsqlite3-dev required for Python
    libsqlite3-dev \
    make \
    wget

# Copy Python from build stage
COPY --from=build-python /usr/local /usr/local

# Set directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY python/preload_models.py python/
RUN python3 python/preload_models.py

# Install Node.js dependencies
COPY package.json yarn.lock .
RUN yarn install --frozen-lockfile --ignore-scripts && \
    yarn cache clean

# Build whisper.cpp in whisper-node and download model
RUN (cd node_modules/whisper-node/lib/whisper.cpp/; make)
RUN wget https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin --progress=bar:force:noscroll -P node_modules/whisper-node/lib/whisper.cpp/models/

# Copy application files
COPY . .

# Build application
RUN yarn build

# Create cache volume
VOLUME [ "/app/cache" ]

# Start app
CMD yarn start
