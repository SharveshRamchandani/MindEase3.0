"use client";
import { useState, useRef, useEffect } from "react";
import { handleGenerateText } from "./action"; // Import the action for handling text generation

export default function Home() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "ai", content: "MindEase 2.0" },
  ]);
  const [isTyping, setIsTyping] = useState(false); // New state for typing animation

  // Reference to chat container for auto-scrolling
  const chatContainerRef = useRef(null);

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
      setChatHistory([...chatHistory, userMessage]);
      setInput(""); // Clear the input field

      // Simulate typing
      setIsTyping(true);
      setTimeout(async () => {
        const generatedText = await handleGenerateText(input); // Use action.js to fetch AI response
        const aiMessage = {
          role: "ai",
          content: generatedText || "Error: Could not fetch response from Gemini AI.",
        };

        setChatHistory((prev) => [...prev, aiMessage]);
        setIsTyping(false); // Stop typing animation after the response
      }, 1000); // Simulate a 1-second delay before showing AI's response
    } else {
      alert("Please enter some text.");
    }
  };

  return ( 
    <div className="layout-container">
      
      <main>
        
        {/* Chat history display */}
        <div ref={chatContainerRef} className="chat-container" style={{msOverflowStyle: 'none', scrollbarWidth: 'none', '&::webkit-scrollbar' : {display: 'none'}}} >
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
