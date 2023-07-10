document.getElementById('upload-form').addEventListener('submit', function(e) {
    e.preventDefault();

    var fileInput = document.getElementById('file');
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function(data) {
        var message = data.message;
        var filename = data.filename;
        var downloadLink = '/uploads/' + filename;
        document.getElementById('messages').innerHTML = `${message} <a href="${downloadLink}">Download text file</a>`;
    })
    .catch(function(error) {
        document.getElementById('messages').textContent = 'Error: ' + error.message;
    });
});
