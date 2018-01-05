"use strict";

var _ = require('lodash')

module.exports = {

  byRegion: function (req, res) {
    if (_.isUndefined(req.params.regionCode)) {
      res
        .status(400)
        .end('regionCode required')
      return
    }

    DisasterRiskRegion
      .findOneById(req.params.regionCode)
      .then(function (region) {
        if (!region) {
          res.notFound()
          return
        }
        res.json(region)
      })
      .catch(function (err) {
        res.notFound(err)
      })
  },

  byZipCode: function (req, res) {
    if (_.isUndefined(req.params.zipCode)) {
      res
        .status(400)
        .end('zipcode required')
      return
    }

    DisasterRiskZipcode
      .findOneById(req.params.zipCode)
      .then(function (zipcode) {
        if (!zipcode) {
          res.notFound()
          return
        }
        res.json(zipcode)
      })
      .catch(function (err) {
        res.notFound()
      })
  }

}
