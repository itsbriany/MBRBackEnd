/**
 * Created by itsbriany on 2016-03-24.
 */

/* global describe it*/
/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const crypto = require('crypto');
const request = require('supertest');
const config = require('config');
const assert = require('chai').assert;

const baseUrl = config.get('baseUrl');
const req = request(baseUrl);
const mortgageApplicationUrl = '/MortgageApplications';


describe('Tests for BASE_URL/MortgageApplications endpoint', () => {
  const secret = config.hashSecret;
  const hmac = crypto.createHmac('sha256', secret);

  it('Should return a unique mortgageID', (done) => {

    const payload = {
      applicantName: 'TestApplicant',
      mortgageValue: 1337,
      houseID: 1234,
      mortgageID: '',
    };

    req.post(mortgageApplicationUrl)
      .send({
        payload,
      })
      .expect(200)
      .expect((err, res) => {
        if (err) {
          console.log(err.message());
        }
        const actual = res.args.mortageID;
        const expected = hmac.update(payload).digest('hex');
        assert.property(actual, 'response');
        assert.equal(actual, expected);
      })
      .end(done);
  });
});
