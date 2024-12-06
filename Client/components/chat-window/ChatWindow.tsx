import React, { useState } from "react";
import styles from "./chatWindow.module.css";
import { ChatWindowProps } from "@/types/interfaces";
import { IoIosSend } from "react-icons/io";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import socket from "@/config/socket_io";

const ChatWindow: React.FC<ChatWindowProps> = ({ roomUsers, messages, setMessages }): JSX.Element => {
  const params = useParams();
  const roomId = Array.isArray(params.roomId)
    ? params.roomId[0]
    : params.roomId;
  const { username } = useAuth();
  const [message, setMessage] = useState<string>("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Emit message to server
      socket.emit("send-message", { roomId, username, message });

      // Update local messages for the sender
      setMessages((prev) => [...prev, { username: "You", message }]);
      setMessage("");
    }
  };

  return (
    <div className={styles.chat_window}>
      {/* User List */}
      <ul className={styles.chat_window_users}>
        {roomUsers.map((user: string) => (
          <li key={user} className={styles.chat_window_user}>
            {user}
          </li>
        ))}
      </ul>

      {/* Chat Content */}
      <div className={styles.chat_window_content}>
        {/* Messages Display */}
        <div className={styles.chat_window_messages}>
          {messages.map((msg, index) => (
            <div key={index} className={styles.chat_message}>
              <strong>{msg.username}:</strong> {msg.message}
            </div>
          ))}
        </div>

        {/* Input Field */}
        <form className={styles.chat_window_input}>
          <input
            type="text"
            placeholder="Type a message..."
            className={styles.chat_input_field}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className={styles.chat_window_send} onClick={handleSendMessage}>
            <IoIosSend className={styles.chat_window_send_icon} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
