import {
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Coordinates } from './domain/coordinates';
import {
  AddressService,
  GeoLocationErrorCode,
} from './application/address.service';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('geo-code')
  async getGeoCode(@Query('address') address: string): Promise<Coordinates> {
    const result = await this.addressService.getGeoCode(address);

    if (result.isOk()) {
      return result.value;
    }

    switch (result.error.code) {
      case GeoLocationErrorCode.AddressNotFound:
        throw new NotFoundException(result.error.message, {
          cause: result.error,
        });
      case GeoLocationErrorCode.InvalidAPIKey:
        throw new HttpException(
          {
            statusCode: 424,
            message: result.error.message,
            code: '01',
          },
          424,
          {
            cause: result.error,
          },
        );
      default:
        throw result.error;
    }
  }
}
