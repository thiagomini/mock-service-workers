import { Controller, Get, Query } from '@nestjs/common';
import { Coordinates } from './domain/coordinates';
import { AddressService } from './application/address.service';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('geo-code')
  async getGeoCode(@Query('address') address: string): Promise<Coordinates> {
    return this.addressService.getGeoCode(address);
  }
}
