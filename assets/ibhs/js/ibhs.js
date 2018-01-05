
$(document).ready(function () {

    var user = {
        expiry: new Date('3/30/2015'),
        user: {
            "id": "003j0000008xG56AAE",
            "name": "Kyle Beatty",
            "username": "kbeatty@veriskclimate.com",
            "membershipLevel": "Associate - Class IV",
            "isRACMember": true,
            "company": {
                "id": "001j000000Fj97oAAB",
                "name": "AAA Mid-Atlantic Insurance Company",
                "inRAC": true
            },
            "committees": [{
                "id": "a0fj0000000jRtSAAU",
                "name": "IBHS Research Advisory Council"
            }, {
                "id": "a0fj0000000jRteAAE",
                "name": "IBHS Board of Directors",
                role: 'Chairman'
            }
            ],
            "groups": ["Associate - Class IV", "RAC", "Verisk Climate - 001j000000Fj97oAAB", "IBHS Research Advisory Council - a0fj0000000jRtSAAU", "IBHS Actuarial and Data Subcommittee - a0fj0000000jRteAAE"]
        }
        };

    localStorage.setItem('ibhs_user', JSON.stringify(user));
    localStorage.setItem('ibhs_access_token', '');

    //var fb = new ibhs.widgets.fileBrowser('fb');
    //fb.initialize();

    var fl = new ibhs.widgets.link('fl');
    fl.initialize();


    


});
