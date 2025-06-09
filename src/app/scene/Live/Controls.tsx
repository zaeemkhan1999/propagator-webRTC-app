import { Link } from "react-router-dom";
import styles from "./style.module.css";
import {
  IconHome,
  IconMessage2,
  IconMicrophoneFilled,
  IconMicrophoneOff,
  IconPhoneOff,
  IconVideo,
  IconVideoOff,
} from "@tabler/icons-react";

function Controls({
  toggleChatbox,
  endCall,
  unseenMsgCount,
  isCameraOn,
  isMuted,
  showControls,
  handleMuteToggle,
  handleCameraToggle,
}: {
  toggleChatbox: () => void;
  endCall: () => void;
  unseenMsgCount: number;
  isCameraOn: boolean;
  isMuted: boolean;
  showControls: boolean;
  handleMuteToggle: () => void;
  handleCameraToggle: () => void;
}) {
  return (
    <div
      className={`${styles.controlButtons} ${showControls ? "visible" : "invisible"}`}
    >
      <button className={styles.btn} onClick={handleMuteToggle}>
        {isMuted ? <IconMicrophoneOff /> : <IconMicrophoneFilled />}
      </button>
      <button className={styles.btn} onClick={handleCameraToggle}>
        {isCameraOn ? <IconVideo /> : <IconVideoOff />}
      </button>
      <button className={styles.btn} onClick={toggleChatbox}>
        <IconMessage2 />
        <span className={styles.countBadge}>
          {unseenMsgCount === 0 ? "" : unseenMsgCount}
        </span>
      </button>
      <button className={styles.btnRed} onClick={endCall}>
        <IconPhoneOff />
      </button>
      <Link to={"/specter/home"} className={styles.btnRed}>
        <IconHome />
      </Link>
    </div>
  );
}

export default Controls;
