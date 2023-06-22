// Get DOM elements
const micContainer = document.getElementById('micContainer');
const responseContainer = document.getElementById('responseContainer');

let isMicActive = false;

// Declare the recognition variable in the outer scope
let recognition;

micContainer.addEventListener('click', toggleMic);

function toggleMic() {
  if (!isMicActive) {
    startSpeechRecognition();
    micContainer.classList.add('active');
  } else {
    stopSpeechRecognition();
    micContainer.classList.remove('active');
  }
  isMicActive = !isMicActive;
}

function startSpeechRecognition() {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.start();

  recognition.onresult = function (event) {
    const speechResult = event.results[event.results.length - 1][0].transcript;
    console.log('Speech:', speechResult);

    displaySpeechInput(speechResult);

    fetch('/process-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speech: speechResult })
    })
      .then(response => response.json())
      .then(data => {
        const chatGPTResponse = data.response;
        console.log('ChatGPT:', chatGPTResponse);
        displayResponse('ChatGPT is generating a response...');
        speakResponse(chatGPTResponse); // Speak the response
        displayResponse(chatGPTResponse);
      })
      .catch(error => {
        console.error('Error:', error);
        displayResponse('An error occurred.');
      });
  };
}

function stopSpeechRecognition() {
  if (recognition) {
    recognition.stop();
  }
}

function displaySpeechInput(speech) {
  responseContainer.innerHTML = `<p>You: ${speech}</p>`;
}

function displayResponse(response) {
  const chatGPTResponse = `<p><strong>ChatGPT is responding:</strong> ${response}</p>`;
  responseContainer.innerHTML += chatGPTResponse;
}

function speakResponse(response) {
  const speech = new SpeechSynthesisUtterance(response);
  speech.lang = 'en-US';
  speech.volume = 1; // Set the volume (0.0 to 1.0)
  speech.rate = 1; // Set the speaking rate (0.1 to 10)
  speech.pitch = 1; // Set the pitch (0 to 2)

  speechSynthesis.speak(speech);
}
