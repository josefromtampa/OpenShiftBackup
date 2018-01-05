

var vm = {
    username: '',
    password: '',
    inProg: false
};


rivets.binders.buttonicon = function (ele, inProg) {

    var $ele = $(ele).removeAttr('rv-buttonicon');

    if (inProg){

        $ele.removeClass('fa-lock').addClass('fa-spinner fa-spin');
    } else {
        $ele.removeClass('fa-spinner').removeClass('fa-spin').addClass('fa-lock');

    }// if-else

};

$(document).ready(function () {

    var $form = $('#loginForm');

    rivets.bind($form, vm);

    function login() {

        var $err = $('#error').hide();

        if (!vm.inProg) {

            if (vm.username == '' || vm.password == '') {

                alert('Please enter a username and password.')
            } else {
                vm.inProg = true;

                ibhs.data.user.login(vm.username, vm.password, function (results) {

                    if (results.success) {

                        // save info into localStorage
                        if (results.data.access_token) {
                            localStorage.setItem('ibhs_access_token', results.data.access_token);
                        }// if

                        if (results.data.user) {
                            localStorage.setItem('ibhs_user', JSON.stringify(results.data.user));
                        }// if

                        window.location = '/members/' + results.data.access_token;

                    } else {


                        vm.inProg = false;
                        // login failed
                        $err.show();

                    }// if-else

                    //vm.username = '';
                    //vm.password = '';
                    //vm.inProg = false;


                });
            }// if-else
        }// if

    };

    $('#loginButton').click(login);

    $('#username').keypress(function (e) {
        
        // Enter is pressed
        if (e.keyCode == 13) {

            login();
            e.preventDefault(); // sometimes useful
        }
    });
    $('#password').keypress(function (e) {

        // Enter is pressed
        if (e.keyCode == 13) {

            login();
            e.preventDefault(); // sometimes useful
        }
    });


});