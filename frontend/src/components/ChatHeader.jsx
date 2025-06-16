import { useState } from "react";
import { X, Video, Phone } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import VideoCall from "./Videocall";
import AudioCall from "./AudioCall"; // ✅ Import AudioCall

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();

  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showAudioCall, setShowAudioCall] = useState(false); // ✅ State for Audio

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="relative rounded-full size-10">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <Video
          size={35}
          onClick={() => setShowVideoCall(true)}
          className="text-blue-500 cursor-pointer hover:text-blue-300 ml-60"
        />

        <Phone
          size={32}
          onClick={() => setShowAudioCall(true)}
          className="ml-4 text-green-500 cursor-pointer hover:text-green-300"
        />

        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>

      {showVideoCall && (
        <VideoCall
          caller={authUser._id}
          receiver={selectedUser._id}
          isCaller={true}
          onClose={() => setShowVideoCall(false)}
        />
      )}

      {showAudioCall && (
        <AudioCall
          caller={authUser._id}
          receiver={selectedUser._id}
          isCaller={true}
          onClose={() => setShowAudioCall(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;
