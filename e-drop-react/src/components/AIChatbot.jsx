import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'model', text: 'Hello! I am your E-Drop Assistant. Main apki kia madad kar sakta hoon?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = { role: 'user', text: message };
        setChatHistory(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            // Convert history to Gemini format (role: user/model, parts: [{text}])
            // Gemini history MUST start with 'user' role.
            const historyForGemini = chatHistory
                .filter((msg, idx) => !(idx === 0 && msg.role === 'model')) // Skip welcome message if it's first
                .map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.text }]
                }));

            const res = await axios.post('http://localhost:5000/api/chatbot/chat', {
                message: message,
                history: historyForGemini
            });

            setChatHistory(prev => [...prev, { role: 'model', text: res.data.reply }]);
        } catch (error) {
            console.error("Full Chat Error:", error);
            const errorMsg = error.response?.data?.reply || "Connection to AI server failed. Please ensure the backend is running.";
            setChatHistory(prev => [...prev, { role: 'model', text: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Chat Toggle Button */}
            <button onClick={() => setIsOpen(!isOpen)} style={styles.toggleBtn}>
                {isOpen ? (
                    <i className="fas fa-times" style={{ fontSize: '24px' }}></i>
                ) : (
                    <i className="fas fa-comment-dots" style={{ fontSize: '28px' }}></i>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div style={styles.window}>
                    <div style={styles.header}>
                        <div style={styles.headerIcon}>
                            <i className="fas fa-robot"></i>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={styles.headerTitle}>E-Drop Support</div>
                            <div style={styles.headerStatus}>
                                <span style={styles.statusDot}></span> AI Assistant Online
                            </div>
                        </div>
                    </div>

                    <div style={styles.messagesArea} ref={scrollRef}>
                        {chatHistory.map((msg, index) => (
                            <div key={index} style={{
                                ...styles.messageRow,
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    ...styles.messageBubble,
                                    backgroundColor: msg.role === 'user' ? '#ff6b35' : '#ffffff',
                                    color: msg.role === 'user' ? '#ffffff' : '#333333',
                                    borderBottomLeftRadius: msg.role === 'model' ? '0' : '15px',
                                    borderBottomRightRadius: msg.role === 'user' ? '0' : '15px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
                                <div style={{ ...styles.messageBubble, backgroundColor: '#ffffff' }}>
                                    <div className="typing-dots">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSend} style={styles.inputArea}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            style={styles.input}
                        />
                        <button type="submit" style={styles.sendBtn} disabled={isLoading || !message.trim()}>
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            )}

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .typing-dots { display: flex; gap: 4px; }
                .typing-dots span {
                    width: 6px; height: 6px; background: #999; border-radius: 50%;
                    animation: bounce 1s infinite ease-in-out;
                }
                .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
            `}</style>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 100000,
        fontFamily: "'Poppins', sans-serif"
    },
    toggleBtn: {
        width: '65px',
        height: '65px',
        borderRadius: '50%',
        backgroundColor: '#ff6b35',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(255, 107, 53, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
    },
    window: {
        position: 'absolute',
        bottom: '85px',
        right: '0',
        width: '360px',
        height: '520px',
        backgroundColor: '#f8f9fa',
        borderRadius: '20px',
        boxShadow: '0 15px 50px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.05)'
    },
    header: {
        padding: '20px',
        backgroundColor: '#1a1a1a',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    headerIcon: {
        width: '45px',
        height: '45px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px'
    },
    headerTitle: {
        fontWeight: '700',
        fontSize: '16px'
    },
    headerStatus: {
        fontSize: '11px',
        color: 'rgba(255,255,255,0.7)',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    statusDot: {
        width: '7px',
        height: '7px',
        backgroundColor: '#4ade80',
        borderRadius: '50%'
    },
    messagesArea: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    messageRow: {
        display: 'flex',
        width: '100%'
    },
    messageBubble: {
        maxWidth: '80%',
        padding: '12px 18px',
        borderRadius: '15px',
        fontSize: '13px',
        lineHeight: '1.5'
    },
    inputArea: {
        padding: '15px',
        backgroundColor: 'white',
        display: 'flex',
        gap: '10px',
        borderTop: '1px solid #eee'
    },
    input: {
        flex: 1,
        padding: '12px 15px',
        backgroundColor: '#f1f3f5',
        border: 'none',
        borderRadius: '10px',
        outline: 'none',
        fontSize: '14px'
    },
    sendBtn: {
        backgroundColor: '#ff6b35',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        width: '45px',
        cursor: 'pointer',
        fontSize: '16px'
    }
};

export default AIChatbot;
