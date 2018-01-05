var fs = require('fs'),
  Promise = require('bluebird'),
  _ = require('lodash'),
  request = require('request')

module.exports = {

  getByZip: function (zipcode) {
    var resolver = Promise.pending()
    if (_.isUndefined(zipcode)) {
      resolver.reject("Invalid zip code: " + zipcode)
      return
    }
    //request.get('http://maps.googleapis.com/maps/api/geocode/json?address='+zipcode, function())

    request({
      url: 'http://maps.googleapis.com/maps/api/geocode/json?address='+zipcode,
      json: true
    }, function(err, response, body) {
      if (err || response.stausCode >= 400) {
        resolver.reject(err)
        return
      }
      try {
        var components = body.results[0].address_components
        if (!components.length) {
          resolver.reject('unable to identify country')
          return
        }

        var country = components[components.length-1]
        if (!country.short_name || country.short_name.toLocaleLowerCase() != 'us') {
          resolver.reject('country not in the us')
          return
        }

        var state = _.find(components, function(component) {
          return ~_.indexOf(component.types, 'administrative_area_level_1')
          if (match) {
            return component
          }
        })

        if (!_.isObject(state)) {
          resolver.reject('unable to map state')
          return
        }

        state.short_name = state.short_name.toLowerCase()
        resolver.resolve(state)

      } catch (err) {
        resolver.reject(err)
      }
    })

    return resolver.promise
  },

  // missing too many valid zipcodes
  getByZipDep: function (zipcode) {
    var resolver = Promise.pending()

    if (!(zipcode = parseInt(zipcode, 10)))
      resolver.reject("Invalid zip code: " + zipcode)

    if (_.isNumber(zipcode)) {
      zipcode = zipcode.toString()
    }

    if (!_.isString(zipcode)) {
      resolver.reject("Invalid zip code")
      return
    }

    var GROUP_LENGTH = 2,
      zipGroup = zipcode.substring(0, GROUP_LENGTH),
      zipSet = zipcode.substring(GROUP_LENGTH),
      path = './assets/zip-lookup/db/us/' + zipGroup + ".json"

    fs.readFile(path, function (err, data) {
      if (err) {
        resolver.reject(err)
        return
      }

      try {
        data = JSON.parse(data)
      } catch (err) {
        resolver.reject(err)
        return
      }

      if (data === undefined || data[0] === undefined) {
        resolver.reject(err)
        return
      }

      var cityID = data[0][zipSet]
      if (!_.isString(data[1][cityID])) {
        resolver.reject("Zipcode City Not Found in DB")
        return
      }
      var cityData = data[1][cityID].split('|'),
        cityName = cityData[0]
      if (!cityData[1])
        cityData[1] = 0
      var stateID = cityData[1],
        stateData = data[2][stateID].split('|'),
        stateName = stateData[1],
        stateShortName = stateData[0]

      resolver.resolve({
        city: cityName,
        state: stateName,
        stateCode: stateShortName.toLowerCase()
      })
    })

    return resolver.promise
  }

}
