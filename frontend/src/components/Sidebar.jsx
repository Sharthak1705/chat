import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore.jsx';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.jsx';
const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const {onlineUsers} = useAuthStore();
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="flex flex-col w-20 h-full transition-all duration-200 border-r lg:w-72 border-base-300">
      <div className="w-full p-5 border-base-300 base-b">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="hidden font-medium lg:block">Contacts</span>
        </div>
      </div>

      <div className="w-full py-3 overflow-y-auto">
        {users.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                isSelected ? "bg-base-300 ring-1 ring-base-300" : ""
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName || "User"}
                  className="object-cover rounded-full size-12"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 bg-green-500 rounded-full size-3 ring-2 ring-zinc-900" />
                )}
              </div>

              <div className="hidden min-w-0 text-left lg:block">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
