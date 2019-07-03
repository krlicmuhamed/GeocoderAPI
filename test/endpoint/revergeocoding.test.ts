import assert from 'assert';
import chai from "chai";
import chaiHttp from "chai-http";
import chaiXml from "chai-xml";

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
                    // chai.expect(res).to.have.
                    done();
                });
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
