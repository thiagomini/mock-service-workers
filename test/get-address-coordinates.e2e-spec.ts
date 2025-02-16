import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { http, HttpResponse } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';

describe('Get GeoCode Address', () => {
  let app: INestApplication;
  let mockServer: SetupServerApi;

  const handlers = [
    // Intercept "GET 'https://maps.googleapis.com/maps/api/geocode" requests...
    http.get('https://maps.googleapis.com/maps/api/geocode/json', () => {
      // ...and respond to them using this JSON response.
      return HttpResponse.json({
        results: [
          {
            geometry: {
              location: {
                lat: 37.4224082,
                lng: -122.0856086,
              },
            },
          },
        ],
        status: 'OK',
      });
    }),
  ];

  beforeAll(() => {
    mockServer = setupServer(...handlers);
    mockServer.listen();
  });

  afterAll(() => {
    mockServer.close();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('returns the latitude/longitude for a given address', () => {
    return request(app.getHttpServer())
      .get(
        '/addresses/geo-code?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA',
      )
      .expect(200)
      .expect({
        latitude: 37.4224082,
        longitude: -122.0856086,
      });
  });
});
