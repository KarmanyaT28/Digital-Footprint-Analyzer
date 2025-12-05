# # # Use Node 18 Alpine for small image
# # FROM node:18-alpine

# # WORKDIR /app

# # # Copy package.json and package-lock.json
# # COPY package*.json ./

# # # Install dependencies
# # RUN npm install

# # # Copy all files
# # COPY . .

# # # Set environment
# # ENV NODE_ENV=production/

# # # Expose internal port
# # EXPOSE 5001

# # # Run the server
# # CMD ["node", "index.js"]

# FROM node:18-slim

# WORKDIR /app

# # Install tools + Perl deps Nikto needs
# RUN apt-get update && apt-get install -y \
#     git \
#     perl \
#     make \
#     gcc \
#     libnet-ssleay-perl \
#     libio-socket-ssl-perl \
#     libwww-perl \
#     libssl-dev \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# # Install Nikto manually
# RUN git clone https://github.com/sullo/nikto.git /opt/nikto && \
#     ln -s /opt/nikto/program/nikto.pl /usr/local/bin/nikto && \
#     chmod +x /usr/local/bin/nikto

# # Copy backend
# COPY package*.json ./
# RUN npm install
# COPY . .

# ENV NODE_ENV=production
# EXPOSE 5001

# CMD ["node", "index.js"]

FROM node:18-slim

WORKDIR /app

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    git \
    perl \
    make \
    gcc \
    build-essential \
    python3 \
    python3-pip \
    wget \
    unzip \
    libnet-ssleay-perl \
    libio-socket-ssl-perl \
    libwww-perl \
    libssl-dev \
    libpcre3-dev \
    libidn11-dev \
    zlib1g-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Wapiti Scanner
RUN pip3 install --break-system-packages wapiti3

# # Install Skipfish Scanner (build from source)
# RUN wget https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/skipfish/skipfish-2.10b.tgz \
#     && tar xvf skipfish-2.10b.tgz \
#     && cd skipfish-2.10b && make \
#     && cp skipfish /usr/local/bin/ \
#     && cd .. && rm -rf skipfish-2.10b skipfish-2.10b.tgz

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
