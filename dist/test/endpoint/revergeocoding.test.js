"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __importDefault(require("assert"));
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var chai_xml_1 = __importDefault(require("chai-xml"));
var ajv_1 = __importDefault(require("ajv"));
var revergeocode_json_1 = __importDefault(require("./schemas/revergeocode.json"));
function endpoint() {
    chai_1.default.use(chai_http_1.default);
    chai_1.default.use(chai_xml_1.default);
    var url = 'https://maps.googleapis.com/maps/api/geocode/';
    var apiKey = 'AIzaSyD12EIr7kYvWQlgq6jkKHsqgDTaxtKoTSo';
    // Smoke Test
    before('status check', function (done) {
        var requester = chai_1.default.request(url).keepOpen();
        // every request fails because key and other parameters are not entered
        // and should return code 400
        Promise.all([
            chai_1.default.request(url).get('json'),
            chai_1.default.request(url).get('xml')
        ]).then(function (responses) {
            responses.forEach(function (res) {
                chai_1.default.expect(res).to.have.status(400);
            });
        }).then(function () {
            requester.close();
            done();
        }).catch(function (e) {
            console.error(e, 'Smoke check failed');
            process.exit();
        });
    });
    describe('JSON response', function () {
        var revergeocoderResponseObject;
        it('should respond with error object', function (done) {
            chai_1.default.request(url)
                .get('json?' + 'key=' + apiKey)
                .end(function (err, res) {
                chai_1.default.expect(res).to.have.status(400);
                chai_1.default.expect(res).be.json;
                done();
            });
        });
        it('should respond with geocoding object', function (done) {
            //latlng=40.714224,-73.961452
            chai_1.default.request(url)
                .get('json?' + 'key=' + apiKey + '&latlng=40.714523,18.965243')
                .end(function (err, res) {
                chai_1.default.expect(res).to.have.status(200);
                chai_1.default.expect(res).be.json;
                revergeocoderResponseObject = res.body;
                done();
            });
        });
        it('should respond with request-denied status, invalid api-key', function (done) {
            chai_1.default.request(url)
                .get('json?' + 'key=' + 'AIzaSyD12EIr7kYvWQlgq7jkKHsqgDTaxtKoTSo' + '&latlng=40.714523,18.965243')
                .end(function (err, res) {
                chai_1.default.expect(res).to.have.status(200);
                chai_1.default.expect(res).be.json;
                // Sanity test
                chai_1.default.expect(res.body.error_message).to.exist;
                chai_1.default.expect(res.body.results).to.exist;
                chai_1.default.expect(res.body.status).to.exist;
                chai_1.default.expect(res.body.status).to.eq('REQUEST_DENIED');
                done();
            });
        });
        it('should respond with invalid-request status, invalid api-key', function (done) {
            chai_1.default.request(url)
                .get('json?' + 'key=' + 'AIzaSyD12EIr7kYvWQlgq7jkKHsqgDTaxtKoTSo')
                .end(function (err, res) {
                chai_1.default.expect(res).to.have.status(400);
                chai_1.default.expect(res).be.json;
                // Sanity test
                chai_1.default.expect(res.body.error_message).to.exist;
                chai_1.default.expect(res.body.results).to.exist;
                chai_1.default.expect(res.body.status).to.exist;
                chai_1.default.expect(res.body.status).to.eq('INVALID_REQUEST');
                done();
            });
        });
        it('should respond with invalid-request status, parameters missing', function (done) {
            //valid apiKey this time
            chai_1.default.request(url)
                .get('json?' + 'key=' + apiKey)
                .end(function (err, res) {
                chai_1.default.expect(res).to.have.status(400);
                chai_1.default.expect(res).be.json;
                // Sanity test
                chai_1.default.expect(res.body.error_message).to.exist;
                chai_1.default.expect(res.body.results).to.exist;
                chai_1.default.expect(res.body.status).to.exist;
                chai_1.default.expect(res.body.status).to.eq('INVALID_REQUEST');
                done();
            });
        });
        it('should respond with invalid-request status, incorrect parameter', function (done) {
            //invalid location_type
            chai_1.default.request(url)
                .get('json?' + 'key=' + apiKey + '&location_type=ROOFTOPS' + '&latlng=40.714523,18.965243')
                .end(function (err, res) {
                chai_1.default.expect(res).to.have.status(400);
                chai_1.default.expect(res).be.json;
                // Sanity test
                chai_1.default.expect(res.body.error_message).to.exist;
                chai_1.default.expect(res.body.results).to.exist;
                chai_1.default.expect(res.body.status).to.exist;
                chai_1.default.expect(res.body.status).to.eq('INVALID_REQUEST');
                done();
            });
        });
        it('should respond with invalid-request status', function (done) {
            //valid apiKey this time
            chai_1.default.request(url)
                .get('json?' + 'key=' + apiKey)
                .end(function (err, res) {
                chai_1.default.expect(res).to.have.status(400);
                chai_1.default.expect(res).be.json;
                // Sanity test
                chai_1.default.expect(res.body.error_message).to.exist;
                chai_1.default.expect(res.body.results).to.exist;
                chai_1.default.expect(res.body.status).to.exist;
                chai_1.default.expect(res.body.status).to.eq('INVALID_REQUEST');
                done();
            });
        });
        it('should respond with zero-results status', function (done) {
            chai_1.default.request(url)
                .get('json?' + 'key=' + apiKey + '&latlng=11.853801,45.135981')
                .end(function (err, res) {
                chai_1.default.expect(res).to.have.status(200);
                chai_1.default.expect(res).be.json;
                // Sanity test
                chai_1.default.expect(res.body.error_message).to.not.exist;
                chai_1.default.expect(res.body.results).to.exist;
                assert_1.default(res.body.results.length == 0);
                chai_1.default.expect(res.body.status).to.exist;
                chai_1.default.expect(res.body.status).to.eq('ZERO_RESULTS');
                done();
            });
        });
        it('should be a valid reverse geocoder object', function () {
            var ajv = new ajv_1.default({
                allErrors: true,
                verbose: true
            });
            var validate = ajv.compile(revergeocode_json_1.default);
            var valid = validate(revergeocoderResponseObject);
            assert_1.default(valid);
        });
    });
    describe('XML response', function () {
        //no key
        it('should respond with error object', function (done) {
            chai_1.default.request(url)
                .get('xml?' + 'key=' + apiKey + '&latlng=40.714523,18.965243')
                .end(function (err, res) {
                chai_1.default.expect(res).to.have.status(200);
                chai_1.default.expect(res).to.have.header('content-type', /^application\/xml/);
                // chai.expect(res).to.have.
                done();
            });
        });
        it('should respond with geocoding object', function (done) {
            chai_1.default.request(url)
                .get('xml?' + 'key=' + apiKey + '&latlng=40.714523,18.965243')
                .end(function (err, res) {
                chai_1.default.expect(res).to.have.status(200);
                chai_1.default.expect(res).to.have.header('content-type', /^application\/xml/);
                // chai.expect(res).to.have.
                done();
            });
        });
    });
}
exports.default = endpoint;
