import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setupServer, SetupServerApi } from 'msw/node';
import * as request from 'supertest';
import { stubGoogleAPIResponse } from '../src/address/application/test/google-geocode-mock.handler';
import { AppModule } from '../src/app.module';

describe('Get GeoCode Address', () => {
  let app: INestApplication;
  let mockServer: SetupServerApi;

  beforeAll(() => {
    mockServer = setupServer();
    mockServer.listen();
  });

  afterAll(() => {
    mockServer.close();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    mockServer.resetHandlers();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('returns the latitude/longitude for a given address', () => {
    mockServer.use(
      stubGoogleAPIResponse({
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
      }),
    );

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

  it.todo('returns a 404 error when the address is not found');
  it.todo('returns a 424 error (code=01) when there is a network error');
  it.todo('returns a 424 error (code=02) when the API key is invalid');
});
