import { Module } from '@nestjs/common';
import { EsignModule } from './esign/esign.module';

@Module({
  imports: [EsignModule],
})
export class AppModule {}
