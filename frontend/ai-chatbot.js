// E-DROP AI Chatbot System
class EDROPChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.responses = {
            greeting: [
                "Hello! I'm E-DROP's AI assistant. How can I help you today?",
                "Hi there! Welcome to E-DROP. What can I assist you with?",
                "Greetings! I'm here to help you with E-DROP services. What would you like to know?"
            ],
            services: {
                keywords: ['service', 'services', 'what do you offer', 'what do you do', 'logistics', 'delivery', 'shipping', 'cargo'],
                responses: [
                    "E-DROP offers comprehensive logistics solutions including:\n\n🚛 E-CAB: Reliable transportation services\n📦 E-Shipping: Fast and secure shipping\n🚚 E-Cargo: Specialized freight solutions\n🏭 Warehousing: Secure storage facilities\n⚡ Express Delivery: Same-day delivery services\n\nWhich service interests you most?",
                    "We provide end-to-end logistics solutions:\n\n• E-CAB for passenger transportation\n• E-Shipping for package delivery\n• E-Cargo for heavy freight\n• Warehousing and storage\n• Express and standard delivery\n\nWould you like details about any specific service?"
                ]
            },
            pricing: {
                keywords: ['price', 'cost', 'pricing', 'rates', 'how much', 'fee', 'charges'],
                responses: [
                    "Our pricing depends on the service type, distance, and package details. Here are our general ranges:\n\n🚛 E-CAB: Starting from PKR 500\n📦 E-Shipping: PKR 200-2000 depending on weight\n🚚 E-Cargo: Custom quotes for heavy freight\n⚡ Express: 50% surcharge on standard rates\n\nFor accurate pricing, please contact us at 0925-681111 or visit our office.",
                    "Pricing varies based on:\n• Service type and distance\n• Package weight and dimensions\n• Delivery urgency\n• Additional services required\n\nContact our team for personalized quotes!"
                ]
            },
            contact: {
                keywords: ['contact', 'phone', 'email', 'address', 'location', 'office', 'reach'],
                responses: [
                    "You can reach us through:\n\n📞 Phone: 0925-681111\n📧 Email: info@edrop.com\n📍 Address: Sadar Bazar, Peshawar, KPK\n🕒 Hours: 9 AM - 6 PM (Monday-Saturday)\n\nFeel free to contact us anytime!",
                    "Get in touch with E-DROP:\n\n📱 Call us: 0925-681111\n📧 Email: info@edrop.com\n🏢 Visit: Sadar Bazar, Peshawar\n🌐 Website: www.edrop.com\n\nWe're here to help!"
                ]
            },
            tracking: {
                keywords: ['track', 'tracking', 'status', 'where is my', 'delivery status'],
                responses: [
                    "Track your shipment using our online tracking system! Visit our website and enter your tracking number. You can also call us at 0925-681111 for status updates.\n\nFor real-time updates, download our mobile app.",
                    "To track your package:\n1. Visit www.edrop.com/tracking\n2. Enter your tracking number\n3. Get real-time status updates\n\nOr call 0925-681111 for immediate assistance!"
                ]
            },
            locations: {
                keywords: ['where', 'locations', 'cities', 'areas', 'coverage', 'serve'],
                responses: [
                    "E-DROP serves major cities across Pakistan including:\n\n🏙️ Karachi, Lahore, Islamabad\n🏙️ Rawalpindi, Peshawar, Quetta\n🏙️ Multan, Faisalabad, Hyderabad\n🏙️ Sialkot, Gujranwala, Bahawalpur\n\nWe provide nationwide coverage with reliable service!",
                    "Our service coverage includes all major Pakistani cities and towns. Whether you're in Karachi, Lahore, Islamabad, or any other city, E-DROP has you covered with fast, reliable logistics solutions."
                ]
            },
            faq: {
                keywords: ['faq', 'question', 'help', 'how to', 'what is'],
                responses: [
                    "Here are answers to common questions:\n\n❓ How to book a service?\nCall 0925-681111 or visit our website\n\n❓ What's your delivery time?\n2-7 days depending on location\n\n❓ Do you offer insurance?\nYes, for high-value shipments\n\n❓ What areas do you serve?\nAll major cities in Pakistan\n\nNeed more help? Ask me anything!",
                    "Frequently Asked Questions:\n\n📦 Delivery Time: 2-7 business days\n💰 Payment: Cash, card, online banking\n📱 Tracking: Real-time GPS tracking\n🛡️ Insurance: Available for valuable items\n📞 Support: 24/7 customer service\n\nWhat else would you like to know?"
                ]
            },
            bye: {
                keywords: ['bye', 'goodbye', 'thanks', 'thank you', 'see you', 'exit', 'close'],
                responses: [
                    "Thank you for choosing E-DROP! We're here whenever you need us. Have a great day! 👋",
                    "Thanks for chatting with us! Feel free to reach out anytime. Safe travels! 🚛",
                    "Goodbye! Remember, E-DROP is just a call away at 0925-681111. Take care! 📞"
                ]
            }
        };
    }

    init() {
        this.createChatbotUI();
        this.bindEvents();
        this.showWelcomeMessage();
    }

    createChatbotUI() {
        const chatbotHTML = `
            <div id="edrop-chatbot" class="edrop-chatbot">
                <div class="chatbot-toggle" id="chatbot-toggle">
                    <i class="fas fa-robot"></i>
                    <span class="notification-badge" id="notification-badge" style="display: none;">1</span>
                </div>

                <div class="chatbot-window" id="chatbot-window" style="display: none;">
                    <div class="chatbot-header">
                        <div class="chatbot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="chatbot-info">
                            <div class="chatbot-name">E-DROP Assistant</div>
                            <div class="chatbot-status">Online</div>
                        </div>
                        <button class="chatbot-close" id="chatbot-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="chatbot-messages" id="chatbot-messages">
                        <div class="message bot-message welcome-message">
                            <div class="message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-content">
                                <div class="message-text">Hello! I'm E-DROP's AI assistant. How can I help you today?</div>
                                <div class="message-time">${new Date().toLocaleTimeString()}</div>
                            </div>
                        </div>
                    </div>

                    <div class="chatbot-quick-actions">
                        <button class="quick-action-btn" onclick="chatbot.sendQuickMessage('services')">
                            <i class="fas fa-cogs"></i> Services
                        </button>
                        <button class="quick-action-btn" onclick="chatbot.sendQuickMessage('pricing')">
                            <i class="fas fa-tags"></i> Pricing
                        </button>
                        <button class="quick-action-btn" onclick="chatbot.sendQuickMessage('tracking')">
                            <i class="fas fa-search"></i> Track Package
                        </button>
                        <button class="quick-action-btn" onclick="chatbot.sendQuickMessage('contact')">
                            <i class="fas fa-phone"></i> Contact
                        </button>
                    </div>

                    <div class="chatbot-input-area">
                        <input type="text" id="chatbot-input" placeholder="Type your message..." maxlength="200">
                        <button id="chatbot-send" class="chatbot-send-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                        <button id="voice-search-btn" class="voice-btn" title="Voice Search">
                            <i class="fas fa-microphone"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        this.addStyles();
    }

    addStyles() {
        const styles = `
            <style>
                .edrop-chatbot {
                    position: fixed;
                    bottom: 20px;
                    right: 24px;
                    z-index: 1000;
                    font-family: 'Arial', sans-serif;
                }

                .chatbot-toggle {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
                    transition: all 0.3s ease;
                    color: white;
                    font-size: 24px;
                    position: relative;
                }

                .chatbot-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(255, 107, 53, 0.4);
                }

                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #dc3545;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                }

                .chatbot-window {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 350px;
                    height: 500px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .chatbot-header {
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                    color: white;
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .chatbot-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                }

                .chatbot-name {
                    font-weight: bold;
                    font-size: 16px;
                }

                .chatbot-status {
                    font-size: 12px;
                    opacity: 0.8;
                }

                .chatbot-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 50%;
                    transition: background 0.3s;
                }

                .chatbot-close:hover {
                    background: rgba(255,255,255,0.2);
                }

                .chatbot-messages {
                    flex: 1;
                    padding: 15px;
                    overflow-y: auto;
                    background: #f8f9fa;
                }

                .message {
                    display: flex;
                    margin-bottom: 15px;
                    animation: fadeIn 0.3s ease-in;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .message-avatar {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 10px;
                    font-size: 14px;
                }

                .bot-message .message-avatar {
                    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                    color: white;
                }

                .user-message {
                    flex-direction: row-reverse;
                }

                .user-message .message-avatar {
                    background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
                    color: white;
                    margin-right: 0;
                    margin-left: 10px;
                }

                .user-message .message-content {
                    align-items: flex-end;
                }

                .message-content {
                    max-width: 70%;
                    display: flex;
                    flex-direction: column;
                }

                .message-text {
                    background: white;
                    padding: 10px 15px;
                    border-radius: 18px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    word-wrap: break-word;
                    white-space: pre-wrap;
                }

                .user-message .message-text {
                    background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
                    color: white;
                }

                .message-time {
                    font-size: 11px;
                    color: #6c757d;
                    margin-top: 3px;
                    padding: 0 5px;
                }

                .chatbot-quick-actions {
                    padding: 10px 15px;
                    background: white;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    gap: 5px;
                    overflow-x: auto;
                }

                .quick-action-btn {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 20px;
                    padding: 6px 12px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .quick-action-btn:hover {
                    background: #ff6b35;
                    color: white;
                    border-color: #ff6b35;
                }

                .chatbot-input-area {
                    padding: 15px;
                    background: white;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                #chatbot-input {
                    flex: 1;
                    padding: 10px 15px;
                    border: 1px solid #dee2e6;
                    border-radius: 25px;
                    outline: none;
                    font-size: 14px;
                }

                #chatbot-input:focus {
                    border-color: #ff6b35;
                    box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
                }

                .chatbot-send-btn, .voice-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }

                .chatbot-send-btn {
                    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                    color: white;
                }

                .chatbot-send-btn:hover {
                    transform: scale(1.1);
                }

                .voice-btn {
                    background: #f8f9fa;
                    color: #6c757d;
                    border: 1px solid #dee2e6;
                }

                .voice-btn:hover {
                    background: #007bff;
                    color: white;
                }

                .voice-btn.recording {
                    background: #dc3545;
                    color: white;
                    animation: pulse 1s infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                @media (max-width: 480px) {
                    .chatbot-window {
                        width: calc(100vw - 40px);
                        height: calc(100vh - 120px);
                        bottom: 100px;
                    }

                    .chatbot-toggle {
                        bottom: 15px;
                        right: 15px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    bindEvents() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        const voiceBtn = document.getElementById('voice-search-btn');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        voiceBtn.addEventListener('click', () => this.startVoiceSearch());
    }

    toggleChat() {
        const window = document.getElementById('chatbot-window');
        const badge = document.getElementById('notification-badge');

        this.isOpen = !this.isOpen;
        window.style.display = this.isOpen ? 'flex' : 'none';

        if (this.isOpen) {
            badge.style.display = 'none';
            document.getElementById('chatbot-input').focus();
        }
    }

    sendMessage(message = null) {
        const input = document.getElementById('chatbot-input');
        const text = message || input.value.trim();

        if (!text) return;

        this.addMessage(text, 'user');
        input.value = '';

        // Simulate typing indicator
        this.showTypingIndicator();

        // Generate response after delay
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(text);
            this.addMessage(response, 'bot');

            // Show notification if chat is closed
            if (!this.isOpen) {
                document.getElementById('notification-badge').style.display = 'flex';
            }
        }, 1000 + Math.random() * 1000);
    }

    sendQuickMessage(type) {
        let message = '';
        switch(type) {
            case 'services': message = 'What services do you offer?'; break;
            case 'pricing': message = 'Tell me about pricing'; break;
            case 'tracking': message = 'How can I track my package?'; break;
            case 'contact': message = 'How can I contact you?'; break;
        }
        this.sendMessage(message);
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();

        // Check for bye keywords
        if (this.responses.bye.keywords.some(keyword => message.includes(keyword))) {
            return this.getRandomResponse(this.responses.bye.responses);
        }

        // Check for service keywords
        if (this.responses.services.keywords.some(keyword => message.includes(keyword))) {
            return this.getRandomResponse(this.responses.services.responses);
        }

        // Check for pricing keywords
        if (this.responses.pricing.keywords.some(keyword => message.includes(keyword))) {
            return this.getRandomResponse(this.responses.pricing.responses);
        }

        // Check for contact keywords
        if (this.responses.contact.keywords.some(keyword => message.includes(keyword))) {
            return this.getRandomResponse(this.responses.contact.responses);
        }

        // Check for tracking keywords
        if (this.responses.tracking.keywords.some(keyword => message.includes(keyword))) {
            return this.getRandomResponse(this.responses.tracking.responses);
        }

        // Check for location keywords
        if (this.responses.locations.keywords.some(keyword => message.includes(keyword))) {
            return this.getRandomResponse(this.responses.locations.responses);
        }

        // Check for FAQ keywords
        if (this.responses.faq.keywords.some(keyword => message.includes(keyword))) {
            return this.getRandomResponse(this.responses.faq.responses);
        }

        // Default responses for unrecognized queries
        const defaultResponses = [
            "I'm here to help with E-DROP services, pricing, tracking, and contact information. What would you like to know?",
            "I can assist you with information about our logistics services, delivery tracking, pricing, and contact details. How can I help?",
            "Feel free to ask me about E-DROP's services, shipping rates, package tracking, or how to contact us!",
            "I'm your E-DROP assistant! I can help with service information, pricing details, tracking guidance, and contact support."
        ];

        return this.getRandomResponse(defaultResponses);
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = sender === 'bot' ?
            '<i class="fas fa-robot"></i>' :
            '<i class="fas fa-user"></i>';

        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content">
                <div class="message-text">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    startVoiceSearch() {
        const voiceBtn = document.getElementById('voice-search-btn');

        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice search is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            voiceBtn.classList.add('recording');
            this.addMessage('🎤 Listening...', 'bot');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chatbot-input').value = transcript;
            this.sendMessage(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.addMessage('Sorry, I couldn\'t hear you. Please try again or type your message.', 'bot');
        };

        recognition.onend = () => {
            voiceBtn.classList.remove('recording');
        };

        recognition.start();
    }

    showWelcomeMessage() {
        // Welcome message already shown in HTML
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.chatbot = new EDROPChatbot();
    window.chatbot.init();
});
