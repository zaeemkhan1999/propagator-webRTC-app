import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./style.module.css";
import { useLocation } from "react-router-dom";
import { useSnapshot } from "valtio";
import { userStore } from "@/store/user";
import {
  CallStatus,
  onUserJoined,
  RoomType,
  StatusUpdate,
  User,
} from "./types";
import { SocketEvents } from "./SocketEvents";
import { getInitials, getIsMobile, getMediaConstraints } from "./utils";
import ChatBox from "./ChatBox";
import Controls from "./Controls";
import WaitingForMatch from "./waiting";
import io from "socket.io-client";
import Auth from "../Auth/Auth";

const RETRY_DELAY = 50;
const MAX_RETRIES = 5;
const SIGNAL_SERVER_WSS = "https://live.api.specterman.io";
// const SIGNAL_SERVER_WSS = "http://localhost:5001";
// const SIGNAL_SERVER_WSS = "https://192.168.100.153:5001";
const VideoCallMain = () => {
  const isMobile = useRef(getIsMobile()).current;
  const location = useLocation();
  const roomType = location.pathname.endsWith("pg")
    ? RoomType.PROPAGATION
    : RoomType.FRIEND_ZONE;
  const user = useSnapshot(userStore.store).user;
  const mediaConstraints = useMemo(() => getMediaConstraints(isMobile), []);
  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [showChatbox, setShowChatbox] = useState(false);
  const [unseenMsgCount, setUnseenMsgCount] = useState(0);
  const [showComponent, setShowComponent] = useState(true);
  const [remoteUser, setRemoteUser] = useState<User | null>(null);
  const remoteInitial = useMemo(
    () => getInitials(remoteUser?.username),
    [remoteUser],
  );
  const localInitial = useMemo(
    () => getInitials(user?.username),
    [user?.username],
  );
  const [status, setStatus] = useState<CallStatus>("idle");
  const [retries, setRetries] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideo2Ref = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const RTCConfiguration = useRef<RTCConfiguration | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const socket = useMemo(
    () =>
      io(SIGNAL_SERVER_WSS, {
        transports: ["websocket"],
        reconnection: true,
        query: {
          id: user?.id,
          gender: user?.gender?.toLowerCase(),
          username: user?.username,
          isMobile: true,
        },
      }),
    [],
  );

  useEffect(() => {
    if (localVideoRef.current && streamRef.current) {
      localVideoRef.current.srcObject = streamRef.current;
      console.log("Local video stream set:", localVideoRef.current.srcObject);
    }
  }, [streamRef.current]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      console.log("Remote video stream set:", remoteVideoRef.current.srcObject);
    }
  }, [remoteVideoRef.current?.srcObject]);

  const getUserMedia = async (shouldInit?: boolean) => {
    if (streamRef.current && !shouldInit) {
      return streamRef.current;
    }
    try {
      const currentStream =
        await navigator.mediaDevices.getUserMedia(mediaConstraints);
      setIsCameraOn(true);
      streamRef.current = currentStream;
      if (localVideoRef.current && localVideo2Ref.current) {
        localVideoRef.current.srcObject = currentStream;
        localVideo2Ref.current.srcObject = currentStream;
        console.log("Local stream set:", localVideoRef.current.srcObject);
      }
      return currentStream;
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const handleMuteToggle = async () => {
    let currentStream = streamRef.current;
    if (!currentStream) {
      currentStream = (await getUserMedia()) ?? null;
    }
    currentStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    socket.emit(SocketEvents.STATUS_UPDATE, {
      cameraOn: isCameraOn,
      audioOn: isMuted,
    });
    setIsMuted(!isMuted);
  };

  const handleCameraToggle = async () => {
    let currentStream = streamRef.current;
    if (!currentStream) {
      currentStream = (await getUserMedia()) ?? null;
    }
    const videoTracks = currentStream?.getVideoTracks();

    videoTracks?.forEach((track) => {
      track.enabled = !track.enabled;
    });

    const videoTrack = videoTracks?.[0];

    if (peerConnectionRef.current && videoTrack) {
      const senders = peerConnectionRef.current.getSenders();
      const videoSender = senders.find(
        (sender) => sender.track?.kind === "video",
      );
      if (videoSender) {
        if (videoTrack?.enabled) {
          console.log("Replacing video track in peer connection...");
          videoSender.replaceTrack(videoTrack);
        } else {
          console.log("Disabling video track...");
        }
      } else {
        console.log("Adding video track to peer connection...");
        if (currentStream) {
          peerConnectionRef.current.addTrack(videoTrack, currentStream);
        }
      }
    }

    socket.emit(SocketEvents.STATUS_UPDATE, {
      cameraOn: !isCameraOn,
      audioOn: !isMuted,
    });
    setIsCameraOn(!isCameraOn);
  };

  function JoinRoom() {
    console.log("1. joining page...");
    setStatus("joining_room");
    socket.emit(SocketEvents.ROOM_JOIN, { roomType });
  }

  const retryConnection = () => {
    if (retries >= MAX_RETRIES) {
      console.error("Max retries reached. Unable to establish connection.");
      JoinRoom();
      setStatus("disconnected");
      return;
    }

    setRetries((prev) => prev + 1);
    setTimeout(() => {
      console.log(`Retrying connection... Attempt ${retries + 1}`);
      if (peerConnectionRef.current?.restartIce) {
        console.log("Restarting ICE...");
        peerConnectionRef.current.restartIce();
      } else {
        console.log("Reinitializing WebRTC...");
        peerConnectionRef.current?.close();
        initializeWebRTC();
      }
    }, RETRY_DELAY);
  };

  const initializeWebRTC = async () => {
    console.log("Creating RTCPeerConnection...");
    const config: RTCConfiguration = {
      iceServers: [
        { urls: ["stun:stun.l.google.com:19302"] },
        {
          urls: "turn:3.99.241.61:3478",
          credential: "mrTurn123",
          username: "iamturn",
        },
      ],
      iceCandidatePoolSize: 15,
      iceTransportPolicy: "relay",
    };

    peerConnectionRef.current = new RTCPeerConnection(config);

    let currentStream = streamRef.current;
    if (!currentStream) {
      currentStream = (await getUserMedia()) ?? null;
    }

    // Log the tracks being added
    currentStream?.getTracks().forEach((track) => {
      console.log(`Adding track: ${track.kind}`);
      try {
        peerConnectionRef.current!.addTrack(track, currentStream!);
      } catch (err) {
        console.error("Error adding track to PeerConnection:", err);
      }
    });

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        socket.emit(SocketEvents.RTC_CANDIDATE, {
          candidate: event.candidate,
        });
      } else {
        console.log("No more ICE candidates.");
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind);
      if (event.streams[0] && remoteVideoRef.current) {
        // Set the video source object
        remoteVideoRef.current.srcObject = event.streams[0];
        
        // Define a named function for the event handler
        function onMetadataLoaded() {
          // Remove the event listener to prevent memory leaks
          remoteVideoRef.current?.removeEventListener('loadedmetadata', onMetadataLoaded);
          
          // Play the video and handle any errors
          remoteVideoRef.current?.play().catch(err => {
            console.error(`Error starting remote video playback: ${err.message}`);
          });
        }
        
        // Add the event listener using the named function
        remoteVideoRef.current.addEventListener('loadedmetadata', onMetadataLoaded);
        
        setStatus("call_in_progress");
        setIsRemoteVideoOn(true);
        console.log("Remote stream received and set.");
      }
    };

    console.log("WebRTC initialized.");
  };

  const onRoomStart = async (config: RTCConfiguration) => {
    console.log("room-started", config);
    RTCConfiguration.current = config;
    setStatus("user_connected");
    initializeWebRTC();
  };

  useEffect(() => {
    console.log("Setting up socket and WebRTC...");
    getUserMedia(true);
    if (socket.disconnected) socket.connect();

    JoinRoom();

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setStatus("disconnected");
    });

    socket.on(SocketEvents.ROOM_START, onRoomStart);

    socket.on(SocketEvents.ROOM_OFFER, async (config: RTCConfiguration) => {
      try {
        if (!peerConnectionRef.current) {
          console.log("Initializing WebRTC as offerer...");
          await initializeWebRTC();
        }

        // Check if an offer is already in progress
        if (peerConnectionRef.current?.signalingState !== "stable") {
          console.warn("Cannot create offer: Signaling state is not stable.");
          return;
        }

        await getUserMedia();
        setStatus("establishing_call");
        console.log("Creating RTC offer...");
        const offer = await peerConnectionRef.current?.createOffer({
          iceRestart: true,
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });

        // Ensure offer.sdp is defined
        if (!offer.sdp) {
          throw new Error("Failed to create offer: SDP is undefined.");
        }

        // Log the SDP for debugging
        console.log("SDP before setting local description:", offer.sdp);

        // Set the local description with the offer
        await peerConnectionRef.current?.setLocalDescription(offer);
        socket.emit(SocketEvents.RTC_OFFER, { offer });
        console.log("RTC offer sent.");
      } catch (error: any) {
        console.error("Error in ROOM_OFFER:", error.message);
      }
    });

    socket.on(SocketEvents.USER_JOINED, ({ participants }: onUserJoined) => {
      const remoteUser = participants.find((_user) => _user.id !== user?.id);
      const currentUser = participants.find((_user) => _user.id === user?.id);
      if (currentUser) {
        setStatus("room_joined");
      }
      if (remoteUser) setRemoteUser(remoteUser);
    });

    socket.on(SocketEvents.USER_LEFT, () => {
      setRemoteUser(null);
      if (remoteVideoRef.current) {
        if (remoteVideoRef.current.srcObject) {
          const stream = remoteVideoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
        remoteVideoRef.current.srcObject = null;
        setIsRemoteVideoOn(false);
      }
      cleanupResourses();
    });

    socket.on(SocketEvents.STATUS_UPDATE, (status: StatusUpdate) => {
      const otherUser = status.roomUsers.find(
        (user) => user.id === status.userId,
      );
      if (otherUser) {
        setIsRemoteVideoOn(otherUser.cameraOn);
      }
    });

    socket.on(SocketEvents.RTC_OFFER, async ({ offer }: any) => {
      console.log("RTC Offer received. Processing...");
      try {
        if (!peerConnectionRef.current) {
          console.log(
            "PeerConnection is not initialized. Initializing WebRTC...",
          );
          await initializeWebRTC();
        }
        await getUserMedia();

        // Confirm that peerConnection is now available
        if (!peerConnectionRef.current) {
          throw new Error("PeerConnection initialization failed.");
        }

        console.log(
          "Setting Remote Description with the received RTC Offer...",
        );
        const state = peerConnectionRef.current.signalingState;
        console.log("[RTC_OFFER]: Current signaling state:", state);

        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(offer),
        );

        console.log("Creating RTC Answer...");
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);

        socket.emit(SocketEvents.RTC_ANSWER, { answer });
        console.log("RTC Answer sent.");
      } catch (e: any) {
        console.log("Error in rtc:offer: " + e.message);
      }
    });

    socket.on(SocketEvents.RTC_ANSWER, async ({ answer }: any) => {
      await getUserMedia();
      console.log("RTC Answer received.");
      if (peerConnectionRef.current) {
        const state = peerConnectionRef.current.signalingState;
        console.log("Current signaling state:", state);

        // Only set the remote description if the state is 'have-local-offer'
        if (state === "have-local-offer") {
          try {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(answer),
            );
            console.log("RTC Answer processed.");
          } catch (error: any) {
            console.error("Error setting remote description:", error.message);
          }
        } else {
          console.warn("Cannot set remote description in current state:", state);
        }
      }
    });

    socket.on(SocketEvents.RTC_CANDIDATE, async ({ candidate }: any) => {
      await getUserMedia();
      console.log("ICE Candidate received. Adding...");
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate),
          );
          console.log("ICE Candidate added.");
        } catch (error: any) {
          console.error("Error adding ICE candidate:", error.message);
        }
      }
    });

    socket.on(SocketEvents.DISCONNECT, () => {
      if (peerConnectionRef.current) peerConnectionRef.current.close();
      peerConnectionRef.current = null;
      cleanupResourses();
    });

    window.addEventListener("online", handleConnectionStatus);
    window.addEventListener("offline", handleConnectionStatus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      console.log("user leaved page");
      socket.off(SocketEvents.ROOM_START);
      socket.off(SocketEvents.ROOM_OFFER);
      socket.off(SocketEvents.USER_JOINED);
      socket.off(SocketEvents.USER_LEFT);
      socket.off(SocketEvents.RTC_OFFER);
      socket.off(SocketEvents.RTC_ANSWER);
      socket.off(SocketEvents.RTC_CANDIDATE);
      socket.off(SocketEvents.DISCONNECT);
      socket.off(SocketEvents.STATUS_UPDATE);
      socket.close();
      setStatus("idle");
      cleanupResourses();
      if (streamRef.current) {
        // Stop all tracks
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleConnectionStatus);
      window.removeEventListener("offline", handleConnectionStatus);
    };
  }, []);

  useEffect(() => {
    if (showChatbox) {
      setUnseenMsgCount(0);
    }
  }, [showChatbox]);

  const handleConnectionStatus = () => {
    const status = navigator.onLine;
    console.log("network status changed:", status);
    if (!status) {
      cleanupResourses();
    } else {
      JoinRoom();
    }
  };

  const handleVisibilityChange = () => {
    if (isMobile) {
      const isVisible = !document.hidden;
      socket.emit(SocketEvents.STATUS_UPDATE, {
        cameraOn: isVisible,
        audioOn: !isMuted,
      });

      if (isVisible && !streamRef.current) {
        getUserMedia();
      }
    }
  };

  const endCall = () => {
    console.log(SocketEvents.ROOM_LEAVE);
    socket.emit(SocketEvents.ROOM_LEAVE);
    cleanupResourses();
  };

  const cleanupResourses = () => {
    setStatus("idle");

    setShowComponent(false);
    setTimeout(() => {
      setShowComponent(true);
    }, 250);

    if (remoteVideoRef.current) {
      if (remoteVideoRef.current.srcObject) {
        const stream = remoteVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      remoteVideoRef.current.srcObject = null;
      setIsRemoteVideoOn(false);
      console.log("Remote stream Removed.");
    }
    setIsRemoteVideoOn(false);
    setShowControls(false);
    setShowChatbox(false);
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    peerConnectionRef.current = null;
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };
  const toggleChatbox = () => {
    setShowChatbox(!showChatbox);
  };

  const callActiveclass =
    status === "call_in_progress" || status === "establishing_call"
      ? styles.callActive
      : styles.callNotActive;
  const waitingClass =
    status === "call_in_progress" || status === "establishing_call"
      ? styles.callNotActive
      : styles.callActive;

  const localCamOffClass = isCameraOn ? "" : styles.camOff;
  const remoteCamOffClass = isRemoteVideoOn ? "" : styles.camOff;
  const animationClass = styles.slideUpAni;

  return (
    <div className={styles.videoChatContainer}>
      <div className={`${callActiveclass} ${animationClass}`}>
        <div className={styles.videoCallScreen}>
          {/* Remote Video */}
          <div
            className={`${styles.remoteVideo} ${remoteCamOffClass}`}
            onClick={toggleControls}
          >
            <video id="remote" ref={remoteVideoRef} autoPlay playsInline />
            <div className={styles.initial}>{remoteInitial}</div>
          </div>

          {/* Local Video */}
          <div className={`${styles.localVideo} ${localCamOffClass}`}>
            <video id="local" ref={localVideoRef} autoPlay muted playsInline />
            <div className={styles.initial}>{localInitial}</div>
          </div>

          {/* Remote User Info */}
          {showControls && (
            <div className={`${styles.remoteUserInfo} `}>
              <img
                className={styles.profilePic}
                src="/images/live/default-profile-pic.png"
                alt="Profile"
              />
              <span className={styles.userName}>
                {remoteUser ? remoteUser.username : "Remote User"}
              </span>
            </div>
          )}
          <Controls
            endCall={endCall}
            toggleChatbox={toggleChatbox}
            unseenMsgCount={unseenMsgCount}
            isCameraOn={isCameraOn}
            isMuted={isMuted}
            showControls={showControls}
            handleMuteToggle={handleMuteToggle}
            handleCameraToggle={handleCameraToggle}
          />
          <ChatBox
            setShowChatbox={setShowChatbox}
            showChatbox={showChatbox}
            setUnseenMsgCount={setUnseenMsgCount}
            socket={socket}
          />
        </div>
      </div>
      <div className={`${waitingClass} ${animationClass}`}>
        <div className={styles.lookingForMatch}>
          <div className={`${styles.localVideoWaiting}`}>
            <video ref={localVideo2Ref} autoPlay muted playsInline />
          </div>
          <WaitingForMatch status={status} />
        </div>
      </div>
    </div>
  );
};

export default VideoCallMain;