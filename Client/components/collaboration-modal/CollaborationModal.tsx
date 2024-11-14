import React, { useState } from "react";
import styles from "./collaborationModal.module.css";
import { CollaborationModalProps } from "@/types/interfaces";
import { MdMeetingRoom } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";

const CollaborationModal: React.FC<CollaborationModalProps> = ({
  onClose,
}): JSX.Element => {
  const [detectRoom, setDetectRoom] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [inputRoomId, setInputRoomId] = useState<string>("");

  // Handle change mode
  const handleChangeRoom = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const buttonText = e.currentTarget.innerText;
    setDetectRoom(buttonText);
  };

  // Generate random ID for user
  const handleGenerateRoomId = () => {
    const generatedId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setRoomId(generatedId);
  };

  // Handle back to default view
  const handleBack = (): void => {
    setDetectRoom("");
  };

  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        <IoMdCloseCircleOutline
          className={styles.modal_close_btn}
          onClick={onClose}
        />
        {!detectRoom && (
          <div className={styles.room_modal_content_wrapper}>
            <button
              onClick={(e) => handleChangeRoom(e)}
              className={styles.room_modal_content_item}
            >
              <MdMeetingRoom className={styles.room_modal_content_icon} />
              <p>Create Room</p>
            </button>
            <button
              onClick={(e) => handleChangeRoom(e)}
              className={styles.room_modal_content_item}
            >
              <FaUserFriends className={styles.room_modal_content_icon} />
              <p>Join Room</p>
            </button>
          </div>
        )}

        {/* Conditional rendering for Create Room */}
        {detectRoom === "Create Room" && (
          <div className={styles.create_room_content}>
            <p onClick={handleBack} className={styles.back_btn}>Back</p>
            <h3 className={styles.room_header}>New Room</h3>
            <form className={styles.room_form}>
              <div className={styles.room_form_name_wrapper}>
                <input
                  type="text"
                  id="room"
                  name="room"
                  placeholder="Enter room name"
                  value={roomName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRoomName(e.target.value)
                  }
                />
              </div>
              <div className={styles.room_generate_id_wrapper}>
                <button
                  type="button"
                  onClick={handleGenerateRoomId}
                  className={styles.generate_button}
                >
                  Generate Room ID
                </button>
                <input
                  type="text"
                  value={roomId}
                  readOnly
                  className={styles.room_id_input}
                />
              </div>
            </form>
            <button className={styles.create_room_btn}>Create Room</button>
          </div>
        )}

        {/* Conditional rendering for Join Room */}
        {detectRoom === "Join Room" && (
          <div className={styles.create_room_content}>
            <p onClick={handleBack} className={styles.back_btn}>Back</p>
            <h3 className={styles.room_header}>Join Room</h3>
            <form className={styles.room_form}>
              <div className={styles.room_form_id_wrapper}>
                <input
                  type="text"
                  id="room"
                  name="room"
                  placeholder="Enter Room ID"
                  value={inputRoomId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInputRoomId(e.target.value)
                  }
                />
              </div>
            </form>
            <button className={styles.create_room_btn}>Join Room</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationModal;
