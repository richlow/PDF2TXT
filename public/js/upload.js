document.addEventListener("DOMContentLoaded", () => {
    const messagesDiv = document.getElementById("messages");
    const message = messagesDiv.getAttribute("data-message");
    const filename = messagesDiv.getAttribute("data-filename");
  
    if (message && filename) {
      messagesDiv.innerHTML = message + ' <a href="/uploads/' + filename + '">Download text file</a>';
    }
  
    const uploadForm = document.getElementById("upload-form");
    const inputFile = document.getElementById("file");
  
    uploadForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const file = inputFile.files[0];
      const formData = new FormData();
      formData.append("file", file);
  
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/upload");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const convertedMessage = response.message;
          const convertedFilename = response.filename;
  
          messagesDiv.innerHTML = convertedMessage + ' <a href="/uploads/' + convertedFilename + '">Download text file</a>';
        }
      };
      xhr.send(formData);
    });
  });
  