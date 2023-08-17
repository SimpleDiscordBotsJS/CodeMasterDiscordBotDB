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


RUN apk add --no-cache git

# Install python3
# RUN apk add --no-cache python3

# Install libs for node-canvas build
# RUN apk add --no-cache build-base g++ cairo-dev jpeg-dev pango-dev giflib-dev


RUN mkdir -p /home/codembot
WORKDIR /home/codembot

COPY package.json /home/codembot
RUN npm install --build-from-source
COPY . /home/codembot
CMD ["node", "."]