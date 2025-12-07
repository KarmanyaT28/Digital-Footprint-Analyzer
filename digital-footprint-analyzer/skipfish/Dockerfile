FROM ubuntu:14.04

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    libssl-dev \
    libidn11-dev \
    libpcre3-dev \
    zlib1g-dev \
    wget \
    ca-certificates

# Clone and build Skipfish
RUN git clone https://github.com/spinkham/skipfish.git /opt/skipfish && \
    cd /opt/skipfish && \
    make

# Make skipfish available globally
RUN ln -s /opt/skipfish/skipfish /usr/local/bin/skipfish

CMD ["skipfish"]
