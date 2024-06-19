import { Module } from '@nestjs/common';
import { EsignController } from './controllers/esign/esign.controller';
import { EsignService } from './services/esign/esign.service';

@Module({
  controllers: [EsignController],
  providers: [EsignService],
})
export class EsignModule {}
