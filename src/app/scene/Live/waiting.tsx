import styles from "./style.module.css";
import { CallStatus } from "./types";

const WaitingForMatch = ({ status }: { status: CallStatus }) => {
  return (
    <div className={styles.waitingWrap}>
      {status === "idle" && <p>Waiting to start...</p>}
      {status === "joining_room" && <p>Joining room...</p>}
      {status === "room_joined" && <p>Room joined. Waiting for a user...</p>}
      {status === "user_connected" && <p>User connected! Preparing call...</p>}
      {status === "call_in_progress" && <p>Call in progress</p>}
      {status === "call_ended" && <p>Call ended</p>}
      {status === "disconnected" && (
        <p>Disconnected. Please check your network.</p>
      )}
    </div>
  );
};

export default WaitingForMatch;
