const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const ExampleModel = require('../../src/models/exampleModel');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Example Controller', () => {
  describe('GET /api/example', () => {
    before(async () => {
      // Create some example data in the database for testing
      const examples = [
        { name: 'Example 1', value: 100 },
        { name: 'Example 2', value: 200 },
      ];
      await ExampleModel.create(examples);
    });

    after(async () => {
      // Delete all example data from the database after testing
      await ExampleModel.deleteMany();
    });

    it('should return an array of examples', async () => {
      const res = await chai.request(app).get('/api/example');
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(2);
    });
  });
});
