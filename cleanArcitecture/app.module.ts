import { Module } from "@nestjs/common";
import { EsignModule } from "./infrastructure/web/module/esign.module";

@Module({
  imports: [EsignModule],
})
export class AppModule {}
