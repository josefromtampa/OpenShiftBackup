/**
 * Allow any authenticated user.
 */

module.exports = function (req, res, next) {

    try {

        var apikey = req.headers['api-key'];

        var ip = req.headers['x-forwarded-for'] ||
                     req.connection.remoteAddress ||
                     req.socket.remoteAddress ||
                     req.connection.socket.remoteAddress;
        sails.log.info('API key validation from from: ' + ip);

        BlackList.findOne({ ip: ip.toString() }).exec(function (e, doc) {
                
                if (!doc && apikey == 'o&!JPK^pA7ZR@7ZCqfm2FFmQC') {
                    sails.log.info('API access from from ' + ip + ' is valid');
                    return next();
                } else {

                    if (doc) {
                        sails.log.error('API access attempt from blacklist IP ' + ip);
                    }// if

                    sails.log.warn((new Date()).toString() + ' - Invalid API access to ' + req.url + ' from ' + ip);
                    return res.forbidden({
                        success: false,
                        message: 'You are not authorized'
                    });
                }// if-else
            });


    } catch (e) {
        return res.serverError({ error: e.message });
    }// try-catch

};