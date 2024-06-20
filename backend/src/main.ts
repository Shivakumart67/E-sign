import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as express from "express";
import * as path from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from the 'uploads' folder
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
  app.use(
    "/downloads",
    express.static(path.join(__dirname, "..", "downloads"))
  );

  app.enableCors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization", // Include Authorization header if used
    credentials: true, // Include cookies in the requests if needed
  });

  await app.listen(3001);
}
bootstrap();
