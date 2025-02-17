import { Controller, Get, Query } from '@nestjs/common';
import { Coordinates } from './domain/coordinates';
import { AddressService } from './application/address.service';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('geo-code')
  async getGeoCode(@Query('address') address: string): Promise<Coordinates> {
    const result = await this.addressService.getGeoCode(address);

    if (result.isOk()) {
      return result.value;
    }

    throw result.error;
  }
}
