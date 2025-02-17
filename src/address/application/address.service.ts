import { Injectable } from '@nestjs/common';
import { Coordinates } from '../domain/coordinates';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Result } from '../../common/result';
import { ApplicationError } from '../../common/application.error';

export type GoogleGeocodeResponse = {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
  status: string;
};

export const GeoLocationErrorCode = {
  AddressNotFound: 'ADDRESS_NOT_FOUND',
  InvalidAPIKey: 'INVALID_API_KEY',
  UnknownException: 'UNKNOWN',
} as const;

export class AddressNotFoundError extends ApplicationError {
  constructor() {
    super('Address not found', GeoLocationErrorCode.AddressNotFound);
  }
}

export class InvalidAPIKeyError extends ApplicationError {
  constructor() {
    super('Failed to get coordinates', GeoLocationErrorCode.InvalidAPIKey);
  }
}

export class UnknownGeolocationError extends ApplicationError {
  constructor() {
    super('Unknown error', GeoLocationErrorCode.UnknownException);
  }
}

@Injectable()
export class AddressService {
  constructor(private readonly httpService: HttpService) {}

  async getGeoCode(
    address: string,
  ): Promise<Result<Coordinates, ApplicationError>> {
    const response = await firstValueFrom(
      this.httpService.get<GoogleGeocodeResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?key-test&address=${address}`,
      ),
    );

    if (response.data.status !== 'OK') {
      switch (response.data.status) {
        case 'ZERO_RESULTS':
          return Result.fail(new AddressNotFoundError());
        case 'REQUEST_DENIED':
          return Result.fail(new InvalidAPIKeyError());
        default:
          return Result.fail(new UnknownGeolocationError());
      }
    }

    const { lat, lng } = response.data.results[0].geometry.location;

    return Result.ok(new Coordinates(lat, lng));
  }
}
