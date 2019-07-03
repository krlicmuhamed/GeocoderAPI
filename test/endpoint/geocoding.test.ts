import assert from 'assert';
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiXml from 'chai-xml';

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

                    // Sanity test
                    chai.expect(res.body.error_message).to.exist;
                    chai.expect(res.body.results).to.exist;
                    chai.expect(res.body.status).to.exist;
                    chai.expect(res.body.status).to.eq('INVALID_REQUEST');
                    done();
                });
        });

        // https://jsoneditoronline.org/?id=aa8e7fc084d6490687147ce5bc6de0bf
        it('should respond with geocoding object', (done) => {
            chai.request(url)
                .get('json?' + 'key=' + apiKey + '&address=Otoka')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).be.json;

                    // Sanity test
                    chai.expect(res.body.error_message).to.not.exist;
                    chai.expect(res.body.results).to.exist;
                    assert(res.body.results.length>0);
                    chai.expect(res.body.results[0].formatted_address).to.eq('Bosanska Otoka, Bosnia and Herzegovina');

                    chai.expect(res.body.status).to.exist;
                    chai.expect(res.body.status).to.eq('OK');

                    done();
                });
        });
    });
    describe('XML response', () => {
        //no key
        it('should respond with error object', (done) => {
            chai.request(url)
                .get('xml?' + 'key=' + apiKey)
                .end((err, res) => {
                    chai.expect(res).to.not.have.status(200);
                    chai.expect(res).to.have.header('content-type', /^application\/xml/);
                    // chai.expect(res).xml.to.be.valid();
                    done();
                });
        });

        it('should respond with geocoding object', (done) => {
            chai.request(url)
                .get('xml?' + 'key=' + apiKey + '&address=Otoka')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).to.have.header('content-type', /^application\/xml/);
                    done();
                });
        });
    });
}
