import { Injectable } from '@nestjs/common';
import { Coordinates } from '../domain/coordinates';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export type GoogleGeocodeResponse = {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
};

@Injectable()
export class AddressService {
  constructor(private readonly httpService: HttpService) {}

  async getGeoCode(address: string): Promise<Coordinates> {
    const response = await firstValueFrom(
      this.httpService.get<GoogleGeocodeResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?key-test&address=${address}`,
      ),
    );

    const { lat, lng } = response.data.results[0].geometry.location;

    return new Coordinates(lat, lng);
  }
}
