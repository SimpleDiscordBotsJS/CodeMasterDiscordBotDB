FROM node:16-alpine

# Token Of Your Discord Bot
# [Required]
ENV BOT_TOKEN="${BOT_TOKEN}"

# URI Of Your MongoDB
# [Required]
ENV DATABASE_URL="${DATABASE_URL}"

# Webhooks
ENV WEBHOOK_JOIN= 
ENV WEBHOOK_EXIT= 

# Audit webhooks
ENV WEBHOOK_AUDIT_CHANNEL= 
ENV WEBHOOK_AUDIT_BAN= 
ENV WEBHOOK_AUDIT_EVENT= 
ENV WEBHOOK_AUDIT_MEMBER= 
ENV WEBHOOK_AUDIT_MESSAGE= 
ENV WEBHOOK_AUDIT_ROLE= 
ENV WEBHOOK_AUDIT_THREAD= 


RUN apk add  --no-cache git

# Install font
RUN apk update
RUN apk add --no-cache msttcorefonts-installer
RUN update-ms-fonts

# Install python3
RUN apk add --no-cache python3

# Install libs for node-canvas build
RUN apk add --no-cache build-base g++ cairo-dev jpeg-dev pango-dev giflib-dev


RUN mkdir -p /usr/codebot
WORKDIR /usr/codebot

COPY package.json /usr/codebot
RUN npm install --build-from-source
COPY . /usr/codebot
CMD ["node", "."]