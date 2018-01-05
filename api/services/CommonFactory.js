

module.exports = {

    isNullOrEmpty: function(val){

        return val === undefined || val == null || val == '';

    },

    isNull: function(val){
        return val === undefined || cal == null;
    },

    toQueryString: function (obj) {
        var query = [];
        var cur = null;

        for (var prop in obj) {

            cur = obj[prop];

            if (!CommonFactory.isNull(cur)) {
                query.push(prop + '=' + cur);
            }// if

        }// for

        return query.join('&');
    },

    parseFileAttributes: function (fileName) {
        try {

            if (fileName) {

                var attr = null;

                // regex to parse for group, tags, filename, and extension
                var regex = new RegExp(/\/?([^/_]*?)(?:_(.*?))?_(.*?)\.(.+$)/i);

                // parse file
                var match = regex.exec(fileName);

                if (match) {
                    attr = {
                        group: match[1],
                        tags: match[2],
                        name: match[3],
                        ext: match[4]
                    };
                }// if

                return attr;

            } else {
                sails.log.error('CommonFactory.parseFileAttributes() No file parameter specified');
                return null;
            }// if-else

        } catch (e) {
            sails.log.error('CommonFactory.parseFileAttributes() Exception - ' + e.message);
            return null;
        }// try-catch
    }

};
