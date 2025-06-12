import React, { useState } from "react";

const Chatbox = () => {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! Do you have any questions about your resume?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // You could later add AI reply logic here
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Thanks for your question! I'm still learning to chat." }
      ]);
    }, 1000);
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.from === "user" ? styles.userMsg : styles.aiMsg}>
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          placeholder="Ask a follow-up question..."
        />
        <button onClick={handleSend} style={styles.button}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    borderTop: "1px solid #ccc",
    marginTop: "2rem",
    paddingTop: "1rem"
  },
  chatWindow: {
    maxHeight: "200px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #eee",
    background: "#fafafa",
    marginBottom: "0.5rem"
  },
  userMsg: {
    textAlign: "right",
    color: "#333",
    margin: "5px 0"
  },
  aiMsg: {
    textAlign: "left",
    color: "#007acc",
    margin: "5px 0"
  },
  inputArea: {
    display: "flex",
    gap: "0.5rem"
  },
  input: {
    flexGrow: 1,
    padding: "0.5rem"
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#007acc",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  }
};

export default Chatbox;
