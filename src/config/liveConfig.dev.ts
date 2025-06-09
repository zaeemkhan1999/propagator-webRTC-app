const { VITE_TURN_SERVER_URL, VITE_TURN_SERVER_USERNAME, VITE_TURN_SERVER_CREDENTIALS } = import.meta.env || {};

const liveConfig = {
    VITE_TURN_SERVER_URL,
    VITE_TURN_SERVER_USERNAME,
    VITE_TURN_SERVER_CREDENTIALS,
    VITE_SIGNAL_SERVER_WSS: "https://live.api.specterman.io"
};

export default liveConfig;
