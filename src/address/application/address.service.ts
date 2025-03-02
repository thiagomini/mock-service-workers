import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, of } from 'rxjs';
import { ApplicationError } from '../../common/application.error';
import { Result } from '../../common/result';
import { Coordinates } from '../domain/coordinates';

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
  error_message?: string;
};

export const GeoLocationErrorCode = {
  AddressNotFound: 'ADDRESS_NOT_FOUND',
  InvalidAPIKey: 'INVALID_API_KEY',
  UnknownException: 'UNKNOWN',
  NetworkException: 'NETWORK',
  InvalidRequest: 'INVALID_REQUEST',
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

export class GeoLocationNetworkError extends ApplicationError {
  constructor() {
    super('Failed to get coordinates', GeoLocationErrorCode.NetworkException);
  }
}

export class InvalidInputError extends ApplicationError {
  constructor() {
    super('Invalid input', GeoLocationErrorCode.InvalidRequest);
  }
}

export class UnknownGeolocationError extends ApplicationError {
  constructor() {
    super('Unknown error', GeoLocationErrorCode.UnknownException);
  }
}

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);
  constructor(private readonly httpService: HttpService) {}

  async getGeoCode(
    address: string,
  ): Promise<Result<Coordinates, ApplicationError | AxiosError>> {
    const response = await firstValueFrom(
      this.httpService
        .get<GoogleGeocodeResponse>(
          `https://maps.googleapis.com/maps/api/geocode/json?key=test&address=${address}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            if (error.response) {
              return of(error);
            }

            if (error.request) {
              return of(new GeoLocationNetworkError());
            }

            return of(new UnknownGeolocationError());
          }),
        ),
    );

    if (response instanceof Error) {
      return Result.fail(response);
    }

    const data = response.data;

    if (data.status !== 'OK') {
      this.logger.error(`Failed to get coordinates: ${data.error_message}`);
      switch (data.status) {
        case 'ZERO_RESULTS':
          return Result.fail(new AddressNotFoundError());
        case 'REQUEST_DENIED':
          return Result.fail(new InvalidAPIKeyError());
        case 'INVALID_REQUEST':
          return Result.fail(new InvalidInputError());
        default:
          return Result.fail(new UnknownGeolocationError());
      }
    }

    const { lat, lng } = data.results[0].geometry.location;

    return Result.ok(new Coordinates(lat, lng));
  }
}
