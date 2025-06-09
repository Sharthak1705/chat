
import { MessageSquare, User, Send, Smile, ThumbsUp, PhoneCall, Mic, Video, Bell } from 'lucide-react';

const AuthImagePattern = ({ title, subtitle }) => {
  const items = [
    { icon: <User className="size-4" />, text: "User123 joined" },
    { icon: <MessageSquare className="size-4" />, text: "New message received" },
    { icon: <Send className="size-4" />, text: "Message sent" },
    { icon: <Smile className="size-4" />, text: "Reacted with ❤️" },
    { icon: <ThumbsUp className="size-4" />, text: "Liked your message" },
    { icon: <PhoneCall className="size-4" />, text: "Incoming call..." },
    { icon: <Mic className="size-4" />, text: "Voice message sent" },
    { icon: <Video className="size-4" />, text: "Video call started" },
    { icon: <Bell className="size-4" />, text: "You’ve got a notification" },
  ];

  return (
    <div className="items-center justify-center hidden p-12 lg:flex bg-base-200">
      <div className="max-w-md text-center">
        <div className="relative h-[320px] mb-10">
          {items.map((item, index) => (
            <div
              key={index}
              className="absolute flex items-center gap-2 px-4 py-2 text-sm rounded-xl shadow bg-base-100 text-base-content/80 animate-bounce"
              style={{
                top: `${index * 32}px`,
                left: `${index % 2 === 0 ? 0 : 100}px`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        <h2 className="mb-4 text-2xl font-bold">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
