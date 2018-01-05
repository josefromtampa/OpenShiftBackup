$(function(){

    var ul = $('#upload ul');

    $('#drop a').click(function(){
        // Simulate a click on the file input button
        // to show the file browser dialog
        $(this).parent().find('input').click();
    });

    function readFile(file, characterCount, readCallback, errorCallback) {

        if (window.File && window.FileReader && window.FileList && window.Blob) {

            var f = file;

            if (f) {

                console.log('Validating file');

                // read file
                var r = new FileReader();
                r.onload = function (e) {
                    var contents = e.target.result;

                    if (readCallback) {
                        readCallback({ success: true, data: contents.substring(0, characterCount) });
                    }// if
                }
                r.readAsText(f);

            } else {
                if (errorCallback) {
                    errorCallback('File is invalid');
                }// if
            }// if-else
        } else {

            console.log('HTML5 unsupported in current browser');

            if (readCallback) {
                readCallback({ success: false, data: 'HTML5 not supported by browser.' });
            }// if

        }// if-else
    }

    function validateFileStructure(file, validCallack, invalidCallback) {

        console.log('Validating upload file');

        readFile(file, 14,
            function (results) {

                if (results.success) {

                    // check to see if headers are valid
                    if (results.data.toLowerCase().replace(' ', '').indexOf('risk,zip,state') == 0) {
                        if (validCallack) {
                            validCallack();
                        }// if
                    } else {
                        if (invalidCallback) {
                            invalidCallback();
                        }// if
                    }// if-else

                } else {
                    if (validCallack) {
                        validCallack();
                    }// if
                }// if-else

            }, invalidCallback);
        // peek and validate file
        return true;
    };

    // Initialize the jQuery File Upload plugin
    $('#upload').fileupload({

        limitMultiFileUploads: 1,
        limitConcurrentUploads: 1,

        // This element will accept file drag/drop uploading
        dropZone: $('#drop'),

        // This function is called when a file is added to the queue;
        // either via the browse button, or via drag/drop:
        add: function (e, data) {

            console.log('starting to add');

            if (data && data != null && data.files && data.files != null && data.files.length > 0) {

                console.log('theres data');

                console.log('file number is ' + data.files.length);

                if (data.files[0].name.toLowerCase().indexOf('.csv') == data.files[0].name.length - 4) {

                    console.log('starting processing');

                    // return if file size is 0
                    if (data.files[0].size == 0) {
                        alert('The selected file has a size of 0 bytes. Please select a file with data to upload');
                        return;
                    }// if

                    // validate file structure
                    validateFileStructure(data.files[0], function () {

                        var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"' +
                            ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span id="clearBtn"></span></li>');

                        // Append the file name and file size
                        tpl.find('p').text(data.files[0].name)
                                     .append('<i>' + formatFileSize(data.files[0].size) + '</i>');

                        // Add the HTML to the UL element
                        data.context = tpl.appendTo(ul);
                        
                        // Initialize the knob plugin
                        tpl.find('input').knob();

                        // Listen for clicks on the cancel icon
                        tpl.find('span').click(function () {

                            if (tpl.hasClass('working')) {
                                jqXHR.abort();
                            }

                            tpl.fadeOut(function () {
                                tpl.remove();
                            });

                        });

                        // Automatically upload the file once it is added to the queue
                        var jqXHR = data.submit();
                    }, function () {

                        alert('The selected file does not contain a valid structure. The .CSV file must provide "Risk, ZIP, and State" fields.');
                       
                    });

                } else {

                    alert('File must be a CSV');
                }// if
            } else {
                alert('No data to upload');
            }// if-else
        },

        progress: function(e, data){

            // Calculate the completion percentage of the upload
            var progress = parseInt(data.loaded / data.total * 100, 10);

            // Update the hidden input field and trigger a change
            // so that the jQuery knob plugin knows to update the dial
            data.context.find('input').val(progress).change();

            if(progress == 100){
                data.context.removeClass('working');
            }
        },

        fail:function(e, data){
            // Something has gone wrong!
            data.context.addClass('error');

            alert('Upload Failed, please try again');
            console.error('Upload failed - ' + JSON.stringify(e));
        },

        done: function (e, data) {

            alert('Your file has been uploaded and is processing. Updates will take in affect within 1 minute.');
        }

    });


    // Prevent the default action when a file is dropped on the window
    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });

    // Helper function that formats the file sizes
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }

        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }

        return (bytes / 1000).toFixed(2) + ' KB';
    }

});