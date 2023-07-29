FROM rust:1.71-slim-bookworm as builder

# Update and install necessary dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential cmake libclang-dev && \
    apt-get clean

# Set working directory
WORKDIR /app

# Copy manifests
COPY ./Cargo.lock ./Cargo.toml .

# Create dummy for dependency caching
RUN mkdir src && \
    echo "fn main() { println!(\"if you see this, the build broke\") }" > src/lib.rs && \
    cargo build --release --locked && \
    rm -rf src/

# Copy real source code
COPY src/ src/

# Build real application
RUN cargo build --release --locked


# Set a new stage for the final image
FROM debian:bookworm-slim

# Install wget
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates wget && \
    apt-get clean

# Add non-root user
RUN useradd stt && \
    mkdir /app && \
    chown -R stt:stt /app
USER stt

# Set working directory
WORKDIR /app

# Download whisper.cpp model
RUN mkdir models/ && \
    wget https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin --progress=bar:force:noscroll -P models/
ENV MODEL_PATH "models/ggml-small.bin"

# Copy binary from builder stage
COPY --from=builder /app/target/release/stt .

# Expose port
EXPOSE 8000

# Run the binary
ENV RUST_LOG=debug
CMD ["./stt"]
