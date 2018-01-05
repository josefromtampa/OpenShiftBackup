var Promise = require('bluebird'),
  async = require('async')

module.exports = {

  attributes: {

    zipcodes: {
      type: 'array',
      required: false,
      //collection: 'disasterriskzipcode',
      //via: 'id'
    }

  },

  upsert: function (data) {
    var resolver = Promise.pending()
    DisasterRiskRegion.native(function (err, col) {
      if (err) {
        sails.log.error('DisasterRiskRegion.upsert() update Exception - ' + err)
        resolver.reject(err)
        return
      }
      async.each(data, function (doc, cb) {
        col.update({_id: doc._id},
          doc, {
            upsert: true,
            safe: true
          },
          function (err) {
            if (err) {
              sails.log.error('DisasterRiskRegion.upsert() update Exception - ' + err)
              cb(err)
            } else {
              cb()
            }
          })
      }, function (err) {
        if (err) {
          resolver.reject(err)
          return
        }
        resolver.resolve()
      })
    })
    return resolver.promise
  }

}
