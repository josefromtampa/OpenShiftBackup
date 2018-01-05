var Promise = require('bluebird')

module.exports = {

  attributes: {

    risks: {
      type: 'array',
      required: false
    }

  },

  upsert: function (data) {
    var resolver = Promise.pending()
    DisasterRiskZipcode.native(function (err, col) {
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
