const sendChatBtn = document.querySelector('#send-btn')
const chatInput = document.querySelector('.chatInput .textArea')
const chatBox = document.querySelector('.chatbox');
const chatToggler = document.querySelector('#chatbot-toggler');
const mobileClose = document.querySelector('.mobileClose');
const inputChatHeight = chatInput.scrollHeight;
let userMessage;

const API_KEY = 'AIzaSyDOOpavENYMSmzhMYgNhr1vOYJKDua-EUY'

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add('chat', className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span><i class='bx bx-bot'></i></span>
                                                                        <p></p>`;
     chatLi.innerHTML  = chatContent;
     chatLi.querySelector('p').textContent = message;
     return chatLi ;                                                               
}
function generateResponse(inComingChatLi) {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
  const messageElement = inComingChatLi.querySelector('p');
  const requestOptions = {
      method : "POST",
      header: {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${API_KEY}`
      },
      body : JSON.stringify({
        model : "gemini-1.5-flash",
        contents:
          [{"parts":[{"text":userMessage}]}],
      })

}

  fetch(API_URL , requestOptions).then(res => res.json()).then( data => {
    messageElement.textContent = data.candidates[0].content.parts[0].text;
    
  }).catch(() => {
    messageElement.textContent = "Oops, Something went wrong, Please try again.";

  }).finally(() => 
    chatBox.scrollTo(0, chatBox.scrollHeight));
}


const handleChat = () => {
  userMessage = chatInput.value.trim();
  if(!userMessage) return;
  chatInput.value = ""
  chatInput.style.height = `${inputChatHeight}px`;

  chatBox.appendChild(createChatLi(userMessage, "outgoing"));
  chatBox.scrollTo(0, chatBox.scrollHeight);

  setTimeout(() => {
    const inComingChatLi = createChatLi("Generating...", "incoming")
    chatBox.appendChild(inComingChatLi);
    chatBox.scrollTo(0, chatBox.scrollHeight);
    generateResponse(inComingChatLi);
  },700)

}

chatInput.addEventListener('input', () => {
  chatInput.style.height = `${inputChatHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;

});
chatInput.addEventListener('keydown', (e) => {
  if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
  
});

chatToggler.addEventListener('click', () => document.body.classList.toggle("showChatBot"))
sendChatBtn.addEventListener('click', handleChat);
mobileClose.addEventListener('click', () => document.body.classList.remove("showChatBot"))


