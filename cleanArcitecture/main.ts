import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as express from "express";
import * as path from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
  app.use(
    "/downloads",
    express.static(path.join(__dirname, "..", "downloads"))
  );

  app.enableCors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
