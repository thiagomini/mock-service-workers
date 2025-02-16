import { http, HttpResponse } from 'msw';
import { GoogleGeocodeResponse } from '../address.service';

export function stubGoogleAPIResponse(response: GoogleGeocodeResponse) {
  return http.get('https://maps.googleapis.com/maps/api/geocode/json', () =>
    HttpResponse.json(response),
  );
}
