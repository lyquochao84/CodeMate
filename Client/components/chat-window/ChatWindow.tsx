import React from "react";
import styles from "./chatWindow.module.css";
import { ChatWindowProps } from "@/types/interfaces";
import { FaRegUserCircle } from "react-icons/fa";

const ChatWindow: React.FC<ChatWindowProps> = ({ roomUsers }): JSX.Element => {
  return (
    <div className={styles.chat_window}>
      {/* User List */}
      <ul className={styles.chat_window_users}>
        {roomUsers.map((user: any, index: any) => (
          <li key={index} className={styles.chat_window_user}>{user}</li>
        ))}
      </ul>
      {/* Chat Content */}
      <div className={styles.chat_window_content}>
        {/* Messages Display */}
        <div className={styles.chat_window_messages}></div>
        {/* Input Field */}
        <div className={styles.chat_window_input}>
          <input
            type="text"
            placeholder="Type a message..."
            className={styles.chat_input_field}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
