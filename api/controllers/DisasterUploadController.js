"use strict";

var async = require('async'),
  fs = require('fs'),
  readline = require('readline'),
  Promise = require('bluebird')

module.exports = {

  upload: function (req, res) {
    console.log('uploading......')
    console.time('upload.elapsed')
    req
      .file('upl')
      .upload({
        maxBytes: 20 * 1000 * 1000
      }, function whenDone(err, files) {
        if (err) {
          return res.badRequest(err)
        }
        if (files.length === 0) {
          return res.badRequest('{"message": "No file received"}')
        }
        parseFiles(files)
          .catch(function (err) {
            onError(err)
            res.serverError(err)
          })
          .then(function (result) {
            res.end('{"message": "Risk assessment update in progress"}')
            //console.log('regions:', result.regions)
            //console.log('zipcodes:', result.zipcodes)

            var zipcodePromise,
              regionPromise
            //DisasterRiskZipcode.drop()
            zipcodePromise = DisasterRiskZipcode
              .upsert(_.values(result.zipcodes))

            //DisasterRiskRegion.drop()
            regionPromise = DisasterRiskRegion
              .upsert(_.values(result.regions))

            return Promise.all([
              zipcodePromise,
              regionPromise
            ])
          })
          .then(function (result) {
            onSuccess(result)
          })
          .catch(function (err) {
            onError(err)
          })
      })
  }
}

function parseFiles(files) {
  var resolver = Promise.pending(),
    dicts = {
      zipcodes: {},
      regions: {}
    }
  async.mapSeries(files, function (file, cb) {
    parseFile(dicts, file, cb)
  }, function (err, parsedFiles) {
    if (err) {
      resolver.reject(err)
      return
    }
    resolver.resolve(dicts)
  })
  return resolver.promise
}

function parseFile(dicts, file, cb) {
  var rd = readline.createInterface({
    input: fs.createReadStream(file.fd),
    output: '/dev/null',//process.stdout,
    terminal: false
  })

  rd.on('line', function (line) {
    //console.log('line:', line)
    var arr = line.split(',')

    if (arr.length < 3) {
      return
    }

    var risk = arr[0],
      zipcode = arr[1],
      region = arr[2]

    if ('ZIP' == zipcode) {
      return
    }

    if (_.isUndefined(dicts.zipcodes[zipcode])) {
      dicts.zipcodes[zipcode] = {
        _id: zipcode,
        risks: [risk]
      }
    } else if (!~_.indexOf(dicts.zipcodes[zipcode].risks, risk)) {
      dicts.zipcodes[zipcode].risks.push(risk)
    }

    if (_.isUndefined(dicts.regions[region])) {
      dicts.regions[region] = {
        _id: region.toLowerCase(),
        risks: [risk]
      }
    } else if (!~_.indexOf(dicts.regions[region].risks, risk)) {
      dicts.regions[region].risks.push(risk)
    }
  })

  rd.on('close', function () {
    cb(null, dicts)

    fs.unlink(file.fd, function (err) {
      if (err)
        console.log(err)
    })
  })
}

function onSuccess(result) {
    console.timeEnd('upload.elapsed')

    try {
        var mail = {
            from: 'Laicos Support <errors@mytestingspot.com>',
            to: 'lee@laicos.com',
            subject: 'IBHS Upload Success',
            text: ''
        }

        Email.send(mail)
    } catch (e) {
        sails.log.error('DisasterUpload Exception - ' + e.message);
    }// try-catch
}

function onError(err) {
    console.log('err:', err)

    try  {
          var mail = {
            from: 'Laicos Support <errors@mytestingspot.com>',
            to: 'lee@laicos.com',
            subject: 'IBHS Upload Error',
            text: err.toString()
          }

          Email.send(mail)


    } catch (e) {
        sails.log.error('DisasterUpload Exception - ' + e.message);
    }// try-catch
}
