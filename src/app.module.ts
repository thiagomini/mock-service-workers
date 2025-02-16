import { Module } from '@nestjs/common';
import { AddressModule } from './address/address.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AddressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
