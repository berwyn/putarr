FROM denoland/deno:alpine-1.40.5

WORKDIR /app

COPY . .

RUN deno cache --import-map deno.json src/main.ts

CMD ["task", "start"]
