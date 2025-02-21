## Description

Example repository used as a guide for my [Testing External Dependencies with Mock Service Workers](https://dev.to/thiagomini/testing-external-dependencies-in-nest-with-mock-service-workers-jo8-temp-slug-4614660?preview=63346d847d29d73113f63d1f76ad86d73951b8c00c400c34f1c7d036f40a272c3fad3ea1ff76cf467f9d21ecc5c16148d609cfbd0ac7bc656fa4b394) article.

It uses [Mock Service Worker](https://mswjs.io/docs/) library to intercept outgoing requests and stub their responses so we can test how our application handles each possible response, ranging from success cases to network errors.

## Example Feature

This project implements an example feature used to retrieve the Coordinates of a given existing address utilizing Google's [Geocode API](https://developers.google.com/maps/documentation/geocoding/overview):

```gherkin
Feature: As a user I want to be able to see an address' location on the map.

  A user can enter an address to view their location on the map. The system
  returns either the coordinates of that address or an error when not found.

  Scenario: Successfully retrieve address coordinates
    Given the address '1600 Amphitheatre Parkway, Mountain View, CA' is valid with coordinates 37.4224082, -122.0856086
    When I search for that location's address
    Then I can see the PIN on the map at the specified location.

  Scenario: Handle non-existent address
    Given the address 'Invalid Address' is invalid
    When I search that location's address
    Then I receive an error message: 'Address not found'

  Scenario: Handle network error during coordinate retrieval
    Given a network error occurs
    When I search for the address 'Some Address'
    Then I see the error message: 'Failed to get coordinates'

```

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# e2e tests
$ pnpm run test:e2e

```
