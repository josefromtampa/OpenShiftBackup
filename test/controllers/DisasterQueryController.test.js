'use strict';

var supertest = require('supertest')

/*var assert = require('assert'),
  sinon = require('sinon'),
  Sails = require('sails'),
  request = require('supertest')*/

describe('DisasterQuery', function () {

  //var DisasterQueryController = sails.controllers.disasterquery

  it('should log hello', function (done) {
    console.log('hello')
    done()
    supertest(sails.hooks.http.app)
      .get('/disastersafety/risks/region/33602')
      .send()
      .expect(200, done)
  })

})
