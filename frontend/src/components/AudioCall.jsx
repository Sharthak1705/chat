import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useAuthStore } from "../store/useAuthStore";
import { useCallStore } from "../store/useAudioCall";

const AudioCall = ({ caller, receiver, isCaller, onClose }) => {
  const { socket, authUser } = useAuthStore();
  const { logCall } = useCallStore();

  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const startTimeRef = useRef(new Date().toISOString());
  const [callAccepted, setCallAccepted] = useState(false);
  const [ringing, setRinging] = useState(!isCaller);

  useEffect(() => {
    const startCall = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const peer = new Peer({ initiator: isCaller, trickle: false, stream });
      peerRef.current = peer;

      peer.on("signal", signalData => {
        if (isCaller) {
          socket.emit("call-user", { signalData, from: caller, to: receiver });
        } else {
          socket.emit("call-accepted", { signal: signalData, to: caller });
        }
      });

      peer.on("stream", remoteStream => {
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play();
      });

      if (!isCaller) {
        socket.on("incoming-call", ({ from, signal }) => {
          peer.signal(signal);
          setRinging(false);
        });
      }

      socket.on("call-accepted", ({ signal }) => {
        peer.signal(signal);
        setCallAccepted(true);
      });
    };

    startCall();

    return () => {
      peerRef.current?.destroy();
      streamRef.current?.getTracks().forEach(track => track.stop());
      socket.off("incoming-call");
      socket.off("call-accepted");
    };
  }, []);

  const endCall = async () => {
    peerRef.current?.destroy();
    streamRef.current?.getTracks().forEach(track => track.stop());

    await logCall({
      caller: authUser._id,
      receiver,
      startTime: startTimeRef.current,
      endTime: new Date().toISOString(),
      type: "audio",
      status: callAccepted ? "completed" : "missed"
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center text-center text-white bg-black bg-opacity-80">
      <div>
        <h2>{callAccepted ? "Call Connected" : ringing ? "Ringing..." : "Calling..."}</h2>
        <p>Audio Call with {receiver}</p>
        <button onClick={endCall} className="px-4 py-2 mt-4 bg-red-600 rounded">
          End Call
        </button>
      </div>
    </div>
  );
};

export default AudioCall;
