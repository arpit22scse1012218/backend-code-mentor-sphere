// Get chatbox element
const chatbox = document.getElementById('chatbox');

// Display the bot's message in the chatbox
function displayBotMessage(message) {
  chatbox.innerHTML += `<p class="bot-message"><strong>MentorBot:</strong> ${message}</p>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Display user's message in the chatbox
function displayUserMessage(message) {
  chatbox.innerHTML += `<p class="user-message"><strong>You:</strong> ${message}</p>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Get bot response based on user message
function getBotResponse(userMessage) {
  const responses = {
    'hello': 'Hello! How can I assist you today?',
    'mentor': 'I can help you find a mentor or book a session. What do you need help with?',
    'schedule': 'You can view available mentors and their schedules on the mentor page.',
    'become mentor': 'If you want to become a mentor, you can apply on our registration page.',
    'reviews': 'You can leave a review for a mentor on their profile page.',
    'video call': 'You can schedule a video call with a mentor through Google Calendar. Check the mentor’s availability and book a session.',
  };

  for (let key in responses) {
    if (userMessage.toLowerCase().includes(key)) {
      return responses[key];
    }
  }
  return 'Sorry, I didn’t understand that. Could you try asking something else?';
}

// Send a message when the user clicks the send button
function sendMessage() {
  const userMessage = document.getElementById('messageInput').value;

  // Display the user's message
  displayUserMessage(userMessage);

  // Get the bot's response
  const botResponse = getBotResponse(userMessage);

  // Display the bot's response
  displayBotMessage(botResponse);

  // Clear the input field
  document.getElementById('messageInput').value = '';
}
