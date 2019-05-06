FROM alpine:latest

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY . /app

RUN npm install --only=production

RUN npm run build

EXPOSE 3005

ENTRYPOINT ["node"]

CMD ["dist/app.js"]
