import geocoding from './endpoint/geocoding.test';
import revergeocoding from './endpoint/revergeocoding.test';

describe('Geocoding API Tests', function() {
  describe('geocoding endpoint', geocoding.bind(this));
  describe('reverse geocoding endpoint', revergeocoding.bind(this));
});
