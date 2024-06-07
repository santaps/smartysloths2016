var images_uploaded = false;
var firstBenchmarkProcessReady = false;

// http://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capitalizeFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCurrentTime() {
    var d = new Date();
    return d.getTime();
}

function getCurrentMode() {
    return $('#current-mode').text();
}

function hideModal() {
    $('#processing-modal').modal('hide');
    $('#remote-status').hide();
    $('#local-status').hide();
}

function reset() {
    $('#result-form')[0].reset();
    $('#process').attr('disabled', true);
    images_uploaded = false;
    firstBenchmarkProcessReady = false;
}

function showErrorMessage(errorText) {
    reset();
    hideModal();
    var $errorTextElement = $('<li>').text(errorText);
    if ($('.alert-danger').length > 0) {
        $('.alert-danger').append($errorTextElement);
    } else {
        var $alertElement = $('<div>', {class: 'alert alert-dismissible alert-danger'})
            .append([
                $('<button>', {class: 'close', type: 'button', 'data-dismiss': 'alert'}).html('&times;'),
                $errorTextElement
                ])
        $(".container").prepend($alertElement);
    }
}

function updateStatusText(mode, statusText) {
    if (mode === 'remote') {
        $('#remote-status .status-text').text(statusText);
    } else if (mode === 'local') {
        $('#local-status .status-text').text(statusText);
    } 
}

function remoteOcr(fileIndex) {
    var files = $('#upload-images')[0].files;
    var file = files[fileIndex];
    var numberOfFiles = files.length;

    updateStatusText(
        'remote', 'Processing image(s) remotely... (' +
        (fileIndex + 1) +
        '/' +
        numberOfFiles +
        ')'
    );

    var $resultText = $('#result-text');
    var $remoteResultTimes = $('#remote-result-times')

    var startTime = getCurrentTime();

    var formData = new FormData();
    formData.append('csrfmiddlewaretoken', csrftoken);
    formData.append('image', file);

    var post = $.ajax({
        url: 'process/',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data){
            if (data.text !== undefined) {
                $remoteResultTimes.val($remoteResultTimes.val() + (getCurrentTime() - startTime) + ',');
                $('#result-data').val($('#result-data').val() + (parseInt(post.getResponseHeader('Content-Length')) + file.size) + ',');
                
                $resultText.val($resultText.val() + data.text + ' ');

                if (fileIndex === numberOfFiles - 1) {
                    updateStatusText('remote', 'Remote processing is ready!');
                    $('#number-of-images').val(numberOfFiles);
                    if (firstBenchmarkProcessReady || getCurrentMode() !== 'Benchmark') {
                        $('#result-form')[0].submit();
                    } else {
                        firstBenchmarkProcessReady = true;
                    }
                    
                } else {
                    remoteOcr(fileIndex + 1);
                }
            } else {
                showErrorMessage(data.error);
            }

        }
    });
}

function localOcr(fileIndex) {
    var files = $('#upload-images')[0].files;
    var file = files[fileIndex];
    var numberOfFiles = files.length;

    var $resultText = $('#result-text');
    var $localResultTimes = $('#local-result-times')

    var startTime = getCurrentTime();

    if (file["type"].indexOf('image/') >= 0) {
        Tesseract.recognize(files[fileIndex])
            .catch(err => console.error(err))
            .progress(message => {
                updateStatusText('local',
                    capitalizeFirstChar(message.status) +
                    '... ' +
                    Math.floor(message.progress * 100) +
                    '% ' +
                    '(' + (fileIndex + 1) + '/' +
                    numberOfFiles + ')'
                );
            })
            .catch(err => {
                console.error(err);
                showErrorMessage(err);
            })
            .then(result => {
                $localResultTimes.val($localResultTimes.val() + (getCurrentTime() - startTime) + ',');

                if (getCurrentMode() !== 'Benchmark') {
                    $resultText.val($resultText.val() + result.text + ' ');
                }

                if (fileIndex === numberOfFiles - 1) {
                    updateStatusText('local', 'Local processing is ready!');
                    $('#number-of-images').val(numberOfFiles);
                    if (firstBenchmarkProcessReady || getCurrentMode() !== 'Benchmark') {
                        $('#result-form')[0].submit();
                    } else {
                        firstBenchmarkProcessReady = true;
                    }
                } else {
                    localOcr(fileIndex + 1);
                }
            });
    } else {
        showErrorMessage(file.name + ' is either not an image or it is a corrupted image.');
    }
}

function processInput() {
    if (images_uploaded) {
        $('#processing-modal').modal({backdrop: 'static', keyboard: false});

        var currentMode = getCurrentMode();
        $('#result-mode').val(currentMode);

        if (currentMode === 'Remote') {
            updateStatusText('remote', 'Processing image(s) remotely...');
            $('#remote-status').show();
            remoteOcr(0);
        } else if (currentMode === 'Local') {
            updateStatusText('local', 'Processing image(s) locally...');
            $('#local-status').show();
            localOcr(0);
        } else {
            updateStatusText('remote', 'Processing image(s) remotely...');
            $('#remote-status').show();

            updateStatusText('local', 'Processing image(s) locally...');
            $('#local-status').show();

            localOcr(0);

            remoteOcr(0);
        }
    }
}

$(document).ready(
    function () {
        var $upload_images = $('#upload-images');
        $upload_images.change(
            function () {
                if ($upload_images[0].files.length > 0) {
                    // if some images were uploaded enable process button
                    $('#process').removeAttr('disabled');
                    images_uploaded = true;
                } else {
                    $('#process').attr('disabled', true);
                    images_uploaded = false;
                }
            }
        );

        $('#mode a').click(function(event) {
            $('#current-mode').text(event.target.text);
        })
    }
);

$(window).bind("pageshow", function() {
    reset();
});