import { Module } from "@nestjs/common";
import { EsignController } from "./controllers/esign.controller";
import { EsignService } from "./services/esign.service";

@Module({
  controllers: [EsignController],
  providers: [EsignService],
})
export class EsignModule {}
