FROM node:14-alpine

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
