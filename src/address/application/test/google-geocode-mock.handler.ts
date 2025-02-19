import { http, HttpResponse } from 'msw';
import { GoogleGeocodeResponse } from '../address.service';

export function stubGoogleAPIResponse(
  response: GoogleGeocodeResponse | Response,
) {
  return http.get(
    'https://maps.googleapis.com/maps/api/geocode/json',
    () =>
      response instanceof Response ? response : HttpResponse.json(response),
    {
      // Ensure this stubbed response is only used once.
      once: true,
    },
  );
}
