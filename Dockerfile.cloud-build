# Docker container for running integration tests.
# This is mostly a workaround for https://github.com/puppeteer/puppeteer/issues/379: we install the current stable
# version of Chrome, which pulls in all of the required dependencies. But we still use puppeteer to pick which version
# of chrome to use during tests.

# Base is debian stretch, Node V14
FROM node:14-stretch

# Install chrome and all of it's dependencies, then update all packages.
RUN apt-get update \
   && wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
   && apt install -y ./google-chrome-stable_current_amd64.deb \
   && rm -rf /var/lib/apt/lists/*
