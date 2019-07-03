import assert from 'assert';
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiXml from 'chai-xml';
import Ajv from 'ajv';
import schema from './schemas/revergeocode.json';

export default function endpoint() {
    chai.use(chaiHttp);
    chai.use(chaiXml);

    const url = 'https://maps.googleapis.com/maps/api/geocode/';
    const apiKey = 'AIzaSyD12EIr7kYvWQlgq6jkKHsqgDTaxtKoTSo';

    // Smoke Test
    before('status check', (done) => {
        const requester = chai.request(url).keepOpen();
        // every request fails because key and other parameters are not entered
        // and should return code 400
        Promise.all([
            chai.request(url).get('json'),
            chai.request(url).get('xml')
        ]).then(responses => {
            responses.forEach((res) => {
                chai.expect(res).to.have.status(400);
            })
        }).then(() => {
            requester.close();
            done();
        }).catch((e) => {
            console.error(e, 'Smoke check failed');
            process.exit();
        });
    });

    describe('JSON response', () => {
        let revergeocoderResponseObject: any;

        it('should respond with error object', (done) => {
            chai.request(url)
                .get('json?' + 'key=' + apiKey)
                .end((err, res) => {
                    chai.expect(res).to.have.status(400);
                    chai.expect(res).be.json;
                    done();
                });
        });
        it('should respond with geocoding object', (done) => {
            //latlng=40.714224,-73.961452
            chai.request(url)
                .get('json?' + 'key=' + apiKey + '&latlng=40.714523,18.965243')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).be.json;

                    revergeocoderResponseObject = res.body;
                    done();
                });
        });
        it('should respond with request-denied status, invalid api-key', (done) => {
            chai.request(url)
                .get('json?' + 'key=' + 'AIzaSyD12EIr7kYvWQlgq7jkKHsqgDTaxtKoTSo' + '&latlng=40.714523,18.965243')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).be.json;

                    // Sanity test
                    chai.expect(res.body.error_message).to.exist;
                    chai.expect(res.body.results).to.exist;
                    chai.expect(res.body.status).to.exist;
                    chai.expect(res.body.status).to.eq('REQUEST_DENIED');
                    done();
                });
        });

        it('should respond with invalid-request status, invalid api-key', (done) => {
            chai.request(url)
                .get('json?' + 'key=' + 'AIzaSyD12EIr7kYvWQlgq7jkKHsqgDTaxtKoTSo')
                .end((err, res) => {
                    chai.expect(res).to.have.status(400);
                    chai.expect(res).be.json;

                    // Sanity test
                    chai.expect(res.body.error_message).to.exist;
                    chai.expect(res.body.results).to.exist;
                    chai.expect(res.body.status).to.exist;
                    chai.expect(res.body.status).to.eq('INVALID_REQUEST');
                    done();
                });
        });

        it('should respond with invalid-request status, parameters missing', (done) => {
            //valid apiKey this time
            chai.request(url)
                .get('json?' + 'key=' + apiKey)
                .end((err, res) => {
                    chai.expect(res).to.have.status(400);
                    chai.expect(res).be.json;

                    // Sanity test
                    chai.expect(res.body.error_message).to.exist;
                    chai.expect(res.body.results).to.exist;
                    chai.expect(res.body.status).to.exist;
                    chai.expect(res.body.status).to.eq('INVALID_REQUEST');
                    done();
                });
        });

        it('should respond with invalid-request status, incorrect parameter', (done) => {
            //invalid location_type
            chai.request(url)
                .get('json?' + 'key=' + apiKey + '&location_type=ROOFTOPS' + '&latlng=40.714523,18.965243')
                .end((err, res) => {
                    chai.expect(res).to.have.status(400);
                    chai.expect(res).be.json;

                    // Sanity test
                    chai.expect(res.body.error_message).to.exist;
                    chai.expect(res.body.results).to.exist;
                    chai.expect(res.body.status).to.exist;
                    chai.expect(res.body.status).to.eq('INVALID_REQUEST');
                    done();
                });
        });

        it('should respond with invalid-request status', (done) => {
            //valid apiKey this time
            chai.request(url)
                .get('json?' + 'key=' + apiKey)
                .end((err, res) => {
                    chai.expect(res).to.have.status(400);
                    chai.expect(res).be.json;

                    // Sanity test
                    chai.expect(res.body.error_message).to.exist;
                    chai.expect(res.body.results).to.exist;
                    chai.expect(res.body.status).to.exist;
                    chai.expect(res.body.status).to.eq('INVALID_REQUEST');
                    done();
                });
        });

        it('should respond with zero-results status', (done) => {
            chai.request(url)
                .get('json?' + 'key=' + apiKey + '&latlng=11.853801,45.135981')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).be.json;

                    // Sanity test
                    chai.expect(res.body.error_message).to.not.exist;
                    chai.expect(res.body.results).to.exist;
                    assert(res.body.results.length == 0);

                    chai.expect(res.body.status).to.exist;
                    chai.expect(res.body.status).to.eq('ZERO_RESULTS');

                    done();
                });
        });
        it('should be a valid reverse geocoder object', () => {
            let ajv = new Ajv({
                allErrors: true,
                verbose: true
            });
            let validate = ajv.compile(schema);
            let valid = validate(revergeocoderResponseObject);
            assert(valid);
        });
    });
    describe('XML response', () => {
        //no key
        it('should respond with error object', (done) => {
            chai.request(url)
                .get('xml?' + 'key=' + apiKey + '&latlng=40.714523,18.965243')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).to.have.header('content-type', /^application\/xml/);
                    // chai.expect(res).to.have.
                    done();
                });
        });
        it('should respond with geocoding object', (done) => {
            chai.request(url)
                .get('xml?' + 'key=' + apiKey + '&latlng=40.714523,18.965243')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).to.have.header('content-type', /^application\/xml/);
                    // chai.expect(res).to.have.
                    done();
                });
        });
    });
}
