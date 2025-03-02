export class Coordinates {
  public readonly latitude: number;
  public readonly longitude: number;

  constructor(lat: number, lng: number) {
    if (!Coordinates.isValid(lat, lng)) {
      throw new Error(`Invalid coordinates: lat=${lat}, lng=${lng}`);
    }

    this.latitude = lat;
    this.longitude = lng;
  }

  static isValid(lat: number, lng: number): boolean {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  }
}
