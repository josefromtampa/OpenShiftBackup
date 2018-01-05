var nodemailer = require('nodemailer'),
  _ = require('lodash')

var Email = {
  send: function (opts) {
    if (_.isUndefined(Email._transport)) {
      createTransport(sails.config.email)
    }

    if (!_.isObject(opts)) {
      throw new Error('Email.send requires a nodemailer opts object in first arg')
    }

    Email._transport.sendMail(opts, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Message sent to', opts.to, info.response)
      }
    })
  }
}

module.exports = Email


function createTransport(config) {
  if (!_.isObject(config)) {
    throw new Error('Email requires a sails.config.email object for nodemailer')
  }
  Email._transport = nodemailer.createTransport(config)
}
