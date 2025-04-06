(function (window) {
    function createChatWidget(url, color, title, font_family, first_message, init_payload, z_index, api_type = 'openrouter') {
        const style = document.createElement('style');
        style.textContent = `
              .chat-widget-container {
                  position: fixed;
                  bottom: 20px;
                  right: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-end;
                  z-index: ${z_index};
              }
              .chat-widget {
                  width: 350px;
                  height: 500px;
                  border-radius: 10px;
                  overflow: hidden;
                  box-shadow: 0 5px 40px rgba(0,0,0,0.16);
                  font-family: ${font_family};
                  display: flex;
                  flex-direction: column;
                  background-color: white;
                  margin-bottom: 10px;
                  transition: all 0.3s ease;
              }
              .chat-widget.collapsed {
                  height: 0;
                  opacity: 0;
              }
              .chat-widget.fullscreen {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  border-radius: 0;
                  z-index: 1001;
              }
              .chat-bubble {
                  width: 60px;
                  height: 60px;
                  background-color: ${color};
                  border-radius: 30px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  cursor: pointer;
              }
              .chat-bubble img {
                  width: 40px;
                  height: 40px;
              }
              .chat-content {
                  display: flex;
                  flex-direction: column;
                  height: 100%;
              }
              .chat-header {
                  background-color: ${color};
                  color: white;
                  padding: 15px;
                  font-weight: bold;
                  font-size: 16px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
              }
              .fullscreen-btn {
                  background: none;
                  border: none;
                  color: white;
                  cursor: pointer;
                  font-size: 20px;
              }
              .chat-messages {
                  flex-grow: 1;
                  overflow-y: auto;
                  padding: 15px;
                  display: flex;
                  flex-direction: column;
              }
              .message-container {
                  display: flex;
                  flex-direction: column;
                  margin-bottom: 10px;
              }
              .message {
                  max-width: 80%;
                  padding: 10px 14px;
                  border-radius: 18px;
                  font-size: 14px;
                  line-height: 1.4;
              }
              .ai-message {
                  background-color: #F2F3F5;
                  color: #000;
                  align-self: flex-start;
              }
              .user-message {
                  background-color: ${color};
                  color: white;
                  align-self: flex-end;
              }
              .error-message {
                background-color: #FFEDED;
                color: #FF0000;
                align-self: flex-start;
                border: 1px solid #FF0000;
              }
              .chat-input {
                  display: flex;
                  padding: 10px;
                  border-top: 1px solid #E6E6E6;
                  align-items: center;
              }
              .chat-input input {
                  flex-grow: 1;
                  padding: 10px;
                  border: none;
                  font-size: 14px;
                  outline: none;
              }
              .chat-input button {
                  background-color: transparent;
                  border: none;
                  color: #8E8E93;
                  cursor: pointer;
                  font-size: 20px;
                  padding: 0 10px;
              }
              .timestamp {
                  font-size: 12px;
                  color: #8E8E93;
                  margin-top: 5px;
              }
              .ai-message-container .timestamp {
                  align-self: flex-start;
              }
              .user-message-container .timestamp {
                  align-self: flex-end;
              }
              .typing-indicator {
                  display: flex;
                  align-items: center;
                  margin-bottom: 10px;
              }
              .typing-indicator span {
                  height: 8px;
                  width: 8px;
                  background-color: #93959F;
                  border-radius: 50%;
                  display: inline-block;
                  margin-right: 5px;
                  animation: bounce 1.3s linear infinite;
              }
              .typing-indicator span:nth-child(2) {
                  animation-delay: -1.1s;
              }
              .typing-indicator span:nth-child(3) {
                  animation-delay: -0.9s;
              }
              @keyframes bounce {
                  0%, 60%, 100% {
                      transform: translateY(0);
                  }
                  30% {
                      transform: translateY(-4px);
                  }
              }
          `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.className = 'chat-widget-container';
        container.innerHTML = `
              <div class="chat-widget collapsed">
                  <div class="chat-content">
                      <div class="chat-header">
                          <span>${title}</span>
                          <button class="fullscreen-btn">⛶</button>
                      </div>
                      <div class="chat-messages"></div>
                      <div class="chat-input">
                          <input style="box-shadow: none;" type="text" placeholder="Type your message in here...">
                          <button>➤</button>
                      </div>
                  </div>
              </div>
              <div class="chat-bubble">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><g id="tabler-icon-message-circle-2-filled__tabler-icon-message-circle-2-filled"><path id="tabler-icon-message-circle-2-filled__Vector" fill="#fff" d="M5.821 4.91c3.898-2.765 9.469-2.54 13.073.536 3.667 3.127 4.168 8.238 1.152 11.897-2.842 3.447-7.965 4.583-12.231 2.805l-.232-.101-4.375.93-.075.014-.11.009-.113-.004-.044-.005-.11-.02-.105-.034-.1-.044-.076-.042-.108-.077-.081-.074-.073-.083-.053-.075-.065-.115-.042-.106-.031-.113-.013-.075-.009-.11.004-.113.005-.044.02-.11.022-.072 1.15-3.451-.022-.036C.969 12.45 1.97 7.805 5.59 5.079l.23-.168.001-.001Z"></path></g></svg>
              </div>
          `;
        document.body.appendChild(container);

        const widget = container.querySelector('.chat-widget');
        const chatBubble = container.querySelector('.chat-bubble');
        const messagesContainer = container.querySelector('.chat-messages');
        const input = container.querySelector('input');
        const sendButton = container.querySelector('button');
        const fullscreenButton = container.querySelector('.fullscreen-btn');

        let userUUID = sessionStorage.getItem('chatUserUUID');
        let chatHistory = [];
        let apiType = api_type; // Store the API type

        function generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        function initializeUser() {
            if (!userUUID) {
                userUUID = generateUUID();
                sessionStorage.setItem('chatUserUUID', userUUID);
            }
            loadChatHistory();
        }

        function loadChatHistory() {
            const storedHistory = sessionStorage.getItem(`chatHistory_${userUUID}`);
            if (storedHistory) {
                chatHistory = JSON.parse(storedHistory);
                chatHistory.forEach(message => {
                    addMessage(message.text, message.sender, false);
                });
            }
        }

        function saveChatHistory() {
            sessionStorage.setItem(`chatHistory_${userUUID}`, JSON.stringify(chatHistory));
        }

        function toggleChat() {
            widget.classList.toggle('collapsed');
        }

        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        document.body.appendChild(overlay);

        let isFullscreen = false;
        let originalRect;

        function toggleFullscreen() {
            const widgetRect = widget.getBoundingClientRect();

            if (!isFullscreen) {
                // Entering fullscreen
                originalRect = widgetRect;

                widget.style.transition = 'none';
                widget.style.top = `${widgetRect.top}px`;
                widget.style.left = `${widgetRect.left}px`;
                widget.style.width = `${widgetRect.width}px`;
                widget.style.height = `${widgetRect.height}px`;
                widget.style.borderRadius = '10px';

                widget.offsetHeight; // Force reflow

                widget.style.transition = 'all 0.3s ease';
                widget.classList.add('fullscreen', 'animating');
                overlay.classList.add('active');

                setTimeout(() => {
                    widget.style.top = '0';
                    widget.style.left = '0';
                    widget.style.width = '100%';
                    widget.style.height = '100%';
                    widget.style.borderRadius = '0';
                }, 50);

                setTimeout(() => {
                    widget.classList.remove('animating');
                    widget.style.transition = '';
                    isFullscreen = true;
                }, 300);
            } else {
                // Exiting fullscreen
                widget.style.transition = 'all 0.3s ease';
                widget.classList.add('animating');
                overlay.classList.remove('active');

                widget.style.top = `${originalRect.top}px`;
                widget.style.left = `${originalRect.left}px`;
                widget.style.width = `${originalRect.width}px`;
                widget.style.height = `${originalRect.height}px`;
                widget.style.borderRadius = '10px';

                setTimeout(() => {
                    widget.classList.remove('fullscreen', 'animating');
                    widget.style.transition = '';
                    widget.style.top = '';
                    widget.style.left = '';
                    widget.style.width = '';
                    widget.style.height = '';
                    isFullscreen = false;
                }, 300);
            }

            fullscreenButton.textContent = isFullscreen ? '⛶' : '⛶';
        }

        chatBubble.addEventListener('click', toggleChat);
        fullscreenButton.addEventListener('click', toggleFullscreen);

        function addMessage(text, sender, save = true) {
            const messageContainer = document.createElement('div');
            messageContainer.className = `message-container ${sender}-message-container`;

            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            messageDiv.textContent = text;

            const timestampDiv = document.createElement('div');
            timestampDiv.className = 'timestamp';
            timestampDiv.textContent = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

            messageContainer.appendChild(messageDiv);
            messageContainer.appendChild(timestampDiv);
            messagesContainer.appendChild(messageContainer);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            if (save) {
                chatHistory.push({ text, sender, timestamp: new Date().toISOString() });
                saveChatHistory();
            }
        }

        function addErrorMessage(text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message error-message';
            messageDiv.textContent = text;

            const timestampDiv = document.createElement('div');
            timestampDiv.className = 'timestamp';
            timestampDiv.textContent = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

            messagesContainer.appendChild(messageDiv);
            messagesContainer.appendChild(timestampDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function addTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'typing-indicator';
            typingDiv.innerHTML = '<span></span><span></span><span></span>';
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            return typingDiv;
        }

        function removeTypingIndicator(indicator) {
            messagesContainer.removeChild(indicator);
        }

        function sendMessage() {
            const text = input.value.trim();
            if (text) {
                addMessage(text, 'user');
                input.value = '';
                const typingIndicator = addTypingIndicator();

                const headers = {
                    'Content-Type': 'application/json'
                };

                // Add API key to headers if using direct connection to OpenRouter
                if (apiType === 'openrouter-direct' && window.OPENROUTER_API_KEY) {
                    headers['Authorization'] = `Bearer ${window.OPENROUTER_API_KEY}`;
                    // Add required OpenRouter headers
                    headers['HTTP-Referer'] = window.location.origin;
                    headers['X-Title'] = "Luke's Healthcare AI Portfolio";
                }

                // Comprehensive system message with portfolio information
                const detailedSystemPrompt = `
You are an AI assistant integrated into Luke (Guanhua) Cao's healthcare AI portfolio website. You are NOT Luke - you are representing him through this chat widget.

ABOUT LUKE (the portfolio owner):
Luke is a Machine Learning Engineer specializing in healthcare AI solutions based in Sydney. He is an individual professional who develops AI-powered solutions for healthcare challenges, focusing on delivering accurate, interpretable models that help healthcare providers improve diagnosis, treatment planning, and patient care.

EXPERTISE (with proficiency levels):
- Classical Machine Learning (95%): Implementing statistical and ML algorithms including linear regression, gradient boosting trees, and random forests.
- Clinical Decision Support (90%): Building AI systems that analyze patient data for evidence-based recommendations.
- Health Data Analytics (85%): Analyzing electronic health records and clinical notes using NLP.
- Predictive Patient Monitoring (80%): Creating real-time monitoring systems to predict patient deterioration.

NOTABLE PROJECTS:
1. Health Roundtable Insights Platform: Developed ML models for predictive forecasting of hospital performance metrics.
2. Clinical Notes Analysis: NLP system extracting key medical information from clinical notes.
3. Patient Deterioration Predictor: Real-time monitoring system predicting deterioration up to 24 hours in advance.
4. Auto Clinical Coding: System using LLM agents and RAG to generate accurate ICD and procedure codes.

YOUR ROLE: You are a virtual assistant on the personal portfolio website of Luke Cao, who is a human professional. You should be helpful, informative, and professional when discussing Luke's expertise, projects, and potential collaborations.
`;

                // Build message history for contexts
                const messages = [
                    {
                        role: "system",
                        content: detailedSystemPrompt
                    }
                ];
                
                // Add chat history
                chatHistory.forEach(msg => {
                    const role = msg.sender === 'user' ? 'user' : 'assistant';
                    messages.push({
                        role: role,
                        content: msg.text
                    });
                });
                
                // Add current message
                messages.push({
                    role: "user",
                    content: text
                });
                
                // Prepare request payload for OpenRouter
                const jsonData = {
                    messages: messages
                };

                fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(jsonData)
                })
                .then(response => response.json())
                .then(data => {
                    removeTypingIndicator(typingIndicator);
                    
                    // Handle OpenRouter format
                    if (data.choices && data.choices.length > 0) {
                        const message = data.choices[0].message;
                        if (message && message.content) {
                            addMessage(message.content, 'ai');
                        } else {
                            addErrorMessage("Received invalid response format");
                        }
                    } else {
                        addErrorMessage("Received invalid response format");
                    }
                })
                .catch(error => {
                    removeTypingIndicator(typingIndicator);
                    addErrorMessage(error.toString());
                });
            }
        }

        // Fix the button reference to ensure it correctly selects the send button
        const chatInputButton = container.querySelector('.chat-input button');
        chatInputButton.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        initializeUser();

        if (chatHistory.length === 0 && first_message.length > 0) {
            addMessage(first_message, 'ai');
        }

        // If we have no chat history yet, trigger the first message to get an introduction
        if (chatHistory.length === 0) {
            input.value = "Introduce yourself as an AI assistant for Luke's portfolio. Make it clear that Luke is a person, not an AI or company.";
            sendMessage();
        }
    }

    window.ChatWidget = {
        init: function (
            url,
            color = "#0056FF",
            title = "Conversation",
            font_family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            first_message = "Hello, my name is bot!",
            init_payload = 'SpecialInitPayLoadDoNotTouch',
            z_index = '1000',
            api_type = 'openrouter',
            api_key = null
        ) {
            // Store API key in window object if provided (for direct API access)
            if (api_key) {
                window.OPENROUTER_API_KEY = api_key;
            }
            createChatWidget(url, color, title, font_family, first_message, init_payload, z_index, api_type);
        }
    };
})(window);