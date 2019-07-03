"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function endpoint() {
    // Error with 200 code
    // {
    //   "error_message": "You must use an API key to authenticate each request to Google Maps Platform APIs. For additional information, please refer to http://g.co/dev/maps-no-account",
    //   "results": [],
    //   "status": "REQUEST_DENIED"
    // }
    // 200 OK
    // https://jsoneditoronline.org/?id=aa8e7fc084d6490687147ce5bc6de0bf
    describe('JSON response', function () {
        //no key
        it('should respond with error object', function () {
            // assert.strictEqual(result, 'good');
        });
        it('should respond with geocoding object', function () {
            // assert.strictEqual(result, 'good');
        });
    });
    describe('XML response', function () {
        //no key
        it('should respond with error object', function () {
            // assert.strictEqual(result, 'good');
        });
        it('should respond with geocoding object', function () {
            // assert.strictEqual(result, 'good');
        });
    });
}
exports.default = endpoint;
