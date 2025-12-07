# # # # Use Node 18 Alpine for small image
# # # FROM node:18-alpine

# # # WORKDIR /app

# # # # Copy package.json and package-lock.json
# # # COPY package*.json ./

# # # # Install dependencies
# # # RUN npm install

# # # # Copy all files
# # # COPY . .

# # # # Set environment
# # # ENV NODE_ENV=production/

# # # # Expose internal port
# # # EXPOSE 5001

# # # # Run the server
# # # CMD ["node", "index.js"]

# # FROM node:18-slim

# # WORKDIR /app

# # # Install tools + Perl deps Nikto needs
# # RUN apt-get update && apt-get install -y \
# #     git \
# #     perl \
# #     make \
# #     gcc \
# #     libnet-ssleay-perl \
# #     libio-socket-ssl-perl \
# #     libwww-perl \
# #     libssl-dev \
# #     && apt-get clean \
# #     && rm -rf /var/lib/apt/lists/*

# # # Install Nikto manually
# # RUN git clone https://github.com/sullo/nikto.git /opt/nikto && \
# #     ln -s /opt/nikto/program/nikto.pl /usr/local/bin/nikto && \
# #     chmod +x /usr/local/bin/nikto

# # # Copy backend
# # COPY package*.json ./
# # RUN npm install
# # COPY . .

# # ENV NODE_ENV=production
# # EXPOSE 5001

# # CMD ["node", "index.js"]

# FROM node:18-slim

# WORKDIR /app

# # Install required system dependencies
# RUN apt-get update && apt-get install -y \
#     git \
#     perl \
#     make \
#     gcc \
#     build-essential \
#     python3 \
#     python3-pip \
#     wget \
#     unzip \
#     libnet-ssleay-perl \
#     libio-socket-ssl-perl \
#     libwww-perl \
#     libssl-dev \
#     libpcre3-dev \
#     libidn11-dev \
#     zlib1g-dev \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# # Install Wapiti Scanner
# RUN pip3 install --break-system-packages wapiti3

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


# FROM node:18-slim

# WORKDIR /app

# # Install system dependencies
# RUN apt-get update && apt-get install -y \
#     git \
#     perl \
#     make \
#     gcc \
#     build-essential \
#     python3 \
#     python3-pip \
#     wget \
#     unzip \
#     libnet-ssleay-perl \
#     libio-socket-ssl-perl \
#     libwww-perl \
#     libssl-dev \
#     libpcre3-dev \
#     libidn11-dev \
#     zlib1g-dev \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# # Install Wapiti Scanner
# RUN pip3 install --break-system-packages wapiti3

# # Install Nikto manually
# RUN git clone https://github.com/sullo/nikto.git /opt/nikto && \
#     ln -s /opt/nikto/program/nikto.pl /usr/local/bin/nikto && \
#     chmod +x /usr/local/bin/nikto

# # Install Skipfish manually (Debian removed package)
# RUN git clone https://github.com/spinkham/skipfish.git /opt/skipfish && \
#     cd /opt/skipfish && \
#     make && \
#     cp skipfish /usr/local/bin/ && \
#     chmod +x /usr/local/bin/skipfish

# # Create results directories
# RUN mkdir -p /app/wapiti-results && \
#     mkdir -p /app/skipfish-results

# # Copy backend and install dependencies
# COPY package*.json ./
# RUN npm install --omit=dev
# COPY . .

# EXPOSE 5001
# ENV NODE_ENV=production

# CMD ["node", "index.js"]


# FROM node:18-slim

# WORKDIR /app

# # Install system dependencies required for Wapiti and Nikto
# RUN apt-get update && apt-get install -y \
#     git \
#     perl \
#     make \
#     gcc \
#     build-essential \
#     python3 \
#     python3-pip \
#     wget \
#     unzip \
#     libnet-ssleay-perl \
#     libio-socket-ssl-perl \
#     libwww-perl \
#     libssl-dev \
#     libpcre3-dev \
#     libidn11-dev \
#     zlib1g-dev \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# # Install Wapiti Scanner
# RUN pip3 install --break-system-packages wapiti3

# # Install Nikto manually
# RUN git clone https://github.com/sullo/nikto.git /opt/nikto && \
#     ln -s /opt/nikto/program/nikto.pl /usr/local/bin/nikto && \
#     chmod +x /usr/local/bin/nikto

# # Create results directories for scanners
# RUN mkdir -p /app/wapiti-results && \
#     mkdir -p /app/skipfish-results

# # Copy backend and install dependencies
# COPY package*.json ./
# RUN npm install --omit=dev
# COPY . .

# # Expose backend port
# EXPOSE 5001
# ENV NODE_ENV=production

# # Start backend
# CMD ["node", "index.js"]




FROM node:18-slim

WORKDIR /app

# Install system dependencies required for Wapiti, Nikto, and Docker CLI
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
    docker.io \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Wapiti Scanner
RUN pip3 install --break-system-packages wapiti3

# Install Nikto manually
RUN git clone https://github.com/sullo/nikto.git /opt/nikto && \
    ln -s /opt/nikto/program/nikto.pl /usr/local/bin/nikto && \
    chmod +x /usr/local/bin/nikto

# Create results directories for scanners
RUN mkdir -p /app/wapiti-results && \
    mkdir -p /app/skipfish-results

# Copy backend and install dependencies
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

# Expose backend port
EXPOSE 5001
ENV NODE_ENV=production

# Start backend
CMD ["node", "index.js"]
