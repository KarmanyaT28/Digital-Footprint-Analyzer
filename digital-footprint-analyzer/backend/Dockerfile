# # Use Node 18 Alpine for small image
# FROM node:18-alpine

# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy all files
# COPY . .

# # Set environment
# ENV NODE_ENV=production/

# # Expose internal port
# EXPOSE 5001

# # Run the server
# CMD ["node", "index.js"]

FROM node:18-slim

WORKDIR /app

# Install tools + Perl deps Nikto needs
RUN apt-get update && apt-get install -y \
    git \
    perl \
    make \
    gcc \
    libnet-ssleay-perl \
    libio-socket-ssl-perl \
    libwww-perl \
    libssl-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Nikto manually
RUN git clone https://github.com/sullo/nikto.git /opt/nikto && \
    ln -s /opt/nikto/program/nikto.pl /usr/local/bin/nikto && \
    chmod +x /usr/local/bin/nikto

# Copy backend
COPY package*.json ./
RUN npm install
COPY . .

ENV NODE_ENV=production
EXPOSE 5001

CMD ["node", "index.js"]
