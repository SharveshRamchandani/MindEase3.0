"use client";
import { useState, useRef, useEffect } from "react";
import { handleGenerateText } from "./action"; // Import the action for handling text generation

export default function Home() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);  // Initialize chatHistory as an empty array
  const [isTyping, setIsTyping] = useState(false);  // State for typing animation
  const chatContainerRef = useRef(null);

  // Load chat history from localStorage when the component mounts
  useEffect(() => {
    const storedChat = localStorage.getItem("chatHistory");
    if (storedChat) {
      setChatHistory(JSON.parse(storedChat));
    } else {
      setChatHistory([{ role: "ai", content: "MindEase 2.0" }]);  // Default message
    }
  }, []);

  // Save chat history to localStorage whenever it updates
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Auto-scroll when chat content changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input) {
      const userMessage = { role: "user", content: input };
      const updatedChat = [...chatHistory, userMessage];
      setChatHistory(updatedChat);  // Update chat history

      setInput(""); // Clear the input field

      // Simulate typing
      setIsTyping(true);
      setTimeout(async () => {
        const generatedText = await handleGenerateText(input); // Fetch AI response
        const aiMessage = {
          role: "ai",
          content: generatedText || "Error: Could not fetch response from Gemini AI.",
        };

        setChatHistory((prev) => [...prev, aiMessage]);  // Add AI response to chat history
        setIsTyping(false);  // Stop typing animation after the response
      }, 1000); // Simulate a 1-second delay before showing AI's response
    } else {
      alert("Please enter some text.");
    }
  };

  // Handle clear chat history
  const handleClearChat = () => {
    localStorage.removeItem("chatHistory"); // Remove from local storage
    setChatHistory([{ role: "ai", content: "MindEase 2.0" }]); // Reset chat
  };

  return (
    <div className="layout-container">
      <main>
        {/* Clear Chat Button */}
        <button 
          onClick={handleClearChat} 
          className="clear-btn"
          
        >
          Clear Chat
        </button>

        {/* Chat history display */}
        <div ref={chatContainerRef} className="chat-container" style={{ display: "flex" , msOverflowStyle: 'none', scrollbarWidth: 'none', '&::webkit-scrollbar': { display: 'none' } }}>
          {chatHistory.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.role}`}>
              <p>{message.content}</p>
            </div>
          ))}

          {/* Typing animation */}
          {isTyping && (
            <div className="chat-bubble ai typing">
              <p>...</p> {/* Display typing animation */}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your text here"
            className="input-field"
          />
          <button type="submit" className="submit-btn">
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
