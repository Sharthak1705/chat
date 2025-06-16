import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Peer from "simple-peer";
import { useAuthStore } from "../store/useAuthStore";

const VideoCall = ({ caller, receiver, isCaller, onClose }) => {
  const { socket } = useAuthStore();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const [callAccepted, setCallAccepted] = useState(false);

  useEffect(() => {
    const initCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        const peer = new Peer({
          initiator: isCaller,
          trickle: false,
          stream: stream,
        });

        peerRef.current = peer;

        // When peer generates signaling data (offer/answer)
        peer.on("signal", (data) => {
          console.log("[PEER] Generated signal", data);
          if (isCaller) {
            socket.emit("call-user", {
              signalData: data,
              from: caller,
              to: receiver,
            });
          } else {
            socket.emit("call-accepted", {
              signal: data,
              to: caller,
            });
          }
        });

        
        peer.on("stream", (remoteStream) => {
          console.log("[PEER] Received remote stream");
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        });

        // Receive signals
        socket.on("call-user", ({ from, signalData }) => {
          console.log("[SOCKET] Received call from", from);
          peer.signal(signalData);
        });

        socket.on("call-accepted", ({ signal }) => {
          console.log("[SOCKET] Call accepted with signal");
          setCallAccepted(true);
          peer.signal(signal);
        });
      } catch (error) {
        console.error("Error accessing camera/mic", error);
        alert("Please allow camera and microphone access.");
        onClose();
      }
    };

    initCall();

    return () => {
      peerRef.current?.destroy();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      socket.off("call-user");
      socket.off("call-accepted");
    };
  }, [isCaller, caller, receiver, socket, onClose]);

  const handleClose = () => {
    peerRef.current?.destroy();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative flex items-center justify-center w-full h-full">
        <video ref={localVideoRef} autoPlay muted className="w-1/2 rounded-lg" />
        <video ref={remoteVideoRef} autoPlay className="w-1/2 rounded-lg" />
        <button
          onClick={handleClose}
          className="absolute p-2 text-white bg-red-600 rounded-full top-4 right-4"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
