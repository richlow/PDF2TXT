document.addEventListener("DOMContentLoaded", () => {
  const messagesDiv = document.getElementById("messages");
  const message = messagesDiv.getAttribute("data-message");
  const filename = messagesDiv.getAttribute("data-filename");

  if (message && filename) {
      messagesDiv.innerHTML = message + ' <a href="/uploads/' + filename + '">Download text file</a>';
  }

  const uploadForm = document.getElementById("upload-form");
  const inputFile = document.getElementById("file");
  const dropZone = document.getElementById("drop-zone");
  const submitButton = uploadForm.querySelector('button[type="submit"]');

  // Initially disable the convert button
  submitButton.disabled = true;

  // Enable the convert button once a file has been selected
  inputFile.addEventListener('change', () => {
      submitButton.disabled = false;
  });

  uploadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const file = inputFile.files[0];
    if (file.size > 5 * 1024 * 1024) { // size in bytes
        alert('File size cannot exceed 5MB.');
        return;
    }
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/upload");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const convertedMessage = response.message;
            const convertedFilename = response.filename;
    
            const messageHtml = document.createElement('p');
            messageHtml.innerHTML = convertedMessage + ' <a href="/uploads/' + convertedFilename + '">download text file</a>';
    
            messagesDiv.appendChild(messageHtml);
    
            // Clear the file input and disable the submit button
            inputFile.value = '';
            submitButton.disabled = true;
        }
    };
    
      xhr.send(formData);
  });

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, unhighlight, false);
  });

  dropZone.addEventListener('drop', handleDrop, false);

  function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
  }

  function highlight(e) {
      dropZone.classList.add('highlight');
  }

  function unhighlight(e) {
      dropZone.classList.remove('highlight');
  }

  function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;

      inputFile.files = files;
  }
});
