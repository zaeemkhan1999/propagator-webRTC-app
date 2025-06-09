export interface OnJoinedPageData {
  user: User;
}

export interface User {
  id: number;
  gender: string;
  room: string;
  socketID: string;
  username: string;
  isMobile: boolean;
  cameraOn: boolean;
  audioOn: boolean;
}

export interface StatusUpdate {
  userId: number;
  roomUsers: {
    id: number;
    gender: "male" | "female";
    room: string;
    socketID: string;
    username: string;
    isMobile: true;
    cameraOn: boolean;
    audioOn: boolean;
  }[];
}

export interface onUserJoined {
  socketId: string;
  username: string;
  gender: "male" | "female";
  roomId: string;
  participants: User[];
}

export enum RoomType {
  FRIEND_ZONE = "friend-zone",
  PROPAGATION = "propagation", // gender filter
}

export type CallStatus =
  | "idle" // Initial state, no activity yet
  | "joining_room" // Attempting to join the room
  | "room_joined" // Successfully joined the room
  | "waiting_for_user" // Waiting for another user to join
  | "user_connected" // Connected to another user
  | "establishing_call" // Establishing the WebRTC connection
  | "call_in_progress" // Call is active
  | "call_ended" // Call has ended
  | "disconnected"; // User disconnected from room or network
