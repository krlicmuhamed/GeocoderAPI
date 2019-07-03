"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var chai_xml_1 = __importDefault(require("chai-xml"));
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
                // chai.expect(res).to.have.
                done();
            });
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
