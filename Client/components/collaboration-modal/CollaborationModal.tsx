import React, { useState } from "react";
import styles from "./collaborationModal.module.css";
import { CollaborationModalProps } from "@/types/interfaces";
import { MdMeetingRoom } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";

const CollaborationModal: React.FC<CollaborationModalProps> = ({
  onClose,
  roomId,
  handleGenerateRoomId,
  handleCreateRoom,
}): JSX.Element => {
  const [detectRoom, setDetectRoom] = useState<string>("");

  // Handle change mode
  const handleChangeRoom = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const buttonText = e.currentTarget.innerText;
    setDetectRoom(buttonText);
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
          </div>
        )}

        {/* Conditional rendering for Create Room */}
        {detectRoom === "Create Room" && (
          <div className={styles.create_room_content}>
            <p onClick={handleBack} className={styles.back_btn}>
              Back
            </p>
            <h3 className={styles.room_header}>New Room</h3>
            <form className={styles.room_form}>
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
                  value={roomId || ""}
                  readOnly
                  className={styles.room_id_input}
                />
              </div>
            </form>
            <button
              className={styles.create_room_btn}
              onClick={handleCreateRoom}
            >
              Create Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationModal;
