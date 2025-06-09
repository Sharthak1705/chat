import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from "../components/ChatHeader"
import MessageInput from "../components/Message"
const ChatContainer = () => {
  const {messages, getMessages, isMessagesLoading,selectedUser} =useChatStore()
   
  useEffect(()=>{
  getMessages(selectedUser._id)
  },[selectedUser._id, getMessages])
  
  if(isMessagesLoading) {return <div>Loading...</div>

  }
 

  return (
    <div className='flex-col flex-1 overflow-auto'>
      <ChatHeader />
      <p>
        Messages..
      </p>
      <MessageInput />
    </div>
  )
}

export default ChatContainer
