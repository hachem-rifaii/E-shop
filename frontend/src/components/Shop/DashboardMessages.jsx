import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { backend_url, server } from "../../server";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../../style/style";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
const ENDPOINT = "https://socket-server-eshop-kgyq.onrender.com/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const { seller } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [open, setOpen] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [checkActiveStatus, setCheckActiveStatus] = useState(false);
  const [images, setImages] = useState();
  const scrollRef = useRef(null);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${seller._id}`,
          {
            withCredentials: true,
          }
        );
        setConversations(response.data.conversations);
      } catch (error) {}
    };
    getConversation();
  }, [seller, messages]);

  // online user
  useEffect(() => {
    if (seller) {
      const userId = seller?._id;
      socketId.emit("addUser", userId);
      socketId.on("getUser", (users) => {
        setOnlineUser(users);
      });
    }
  }, [seller]);

  //online check
  const checkOnlineUser = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller?._id);
    const online = onlineUser.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  // get message from socket
  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [arrivalMessage]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // get messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);
  console.log(messages);

  // send message
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member.id !== seller._id
    );
    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });
    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // update last message
  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });
    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      })
      .then((res) => {
        console.log(res.data.conversation);
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImages(file);
    imageSendingHandler(file);
  };

  const imageSendingHandler = async (file) => {

    const formData = new FormData();
    formData.append("images", file);
    formData.append("sender",seller._id);
    formData.append("text" , newMessage);
    formData.append("conversationId", currentChat._id);

    const receiverId = currentChat.members.find(
      (member) => member.id !== seller._id
    );
    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
      images: file,
    });
    try {
     await axios.post(`${server}/message/create-new-message`, formData).then((res)=>{
      setImages();
      setMessages([...messages, res.data.message]);
      updateLastMessageForImage();
     });
    } catch (error) {
      console.log(error);
    }
  };

  // update last message for image
  const updateLastMessageForImage = async () => {
    await axios
     .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: 'Photo',
        lastMessageId: seller._id,
      })
     .then((res) => {
        console.log(res.data.conversation);
      })
     .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounnded">
      {/* All messages list */}
      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {conversations.map((conversation, index) => (
            <MessageList
              key={index}
              conversation={conversation}
              index={index}
              open={open}
              setOpen={setOpen}
              setCurrentChat={setCurrentChat}
              me={seller._id}
              userData={userData}
              setUserData={setUserData}
              online={checkOnlineUser(conversation)}
              setCheckActiveStatus={setCheckActiveStatus}
            />
          ))}
        </>
      )}
      {/* Single conversation */}
      {open && (
        <SellerInbox
          setOpen={setOpen}
          scrollRef={scrollRef}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          userData={userData}
          handleImageChange={handleImageChange}
          sellerID={seller._id}
          
          checkActiveStatus={checkActiveStatus}
        />
      )}
    </div>
  );
};

const MessageList = ({
  conversation,
  index,
  open,
  setOpen,
  setCurrentChat,
  me,
  userData,
  setUserData,
  online,
  setCheckActiveStatus,
}) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    // open the conversation
    navigate(`/dashboard-messages?${id}`);
    setOpen(true);
  };
  useEffect(() => {
    const userID = conversation.members.find((user) => user !== me);
    const getUsers = async () => {
      try {
        const response = await axios.get(`${server}/user/user-info/${userID}`);
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [conversation, me, setUserData]);
  //  get the value of state active
  console.log(online, "dffasfsw");
  return (
    <div
      className={`flex w-full p-3 px-3 ${
        active === index ? "bg-[#00000010]" : "bg-transparent"
      } cursor-pointer`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(conversation._id) ||
        setCurrentChat(conversation) ||
        setUserData(user) ||
        setCheckActiveStatus(online)
      }
    >
      <div className="relative">
        <img
          src={`${backend_url}${user?.avatar}`}
          alt=""
          className="w-[50px] h-[50px] rounded-full "
        />
        {online && (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className=" text-[18px]">{user?.name}</h1>
        <p className=" text-[16px] text-[#000c]">
          {conversation.lastMessageId !== userData?._id
            ? "You: "
            : user?.name?.split(" ")[0] + ": "}
          {conversation?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  setOpen,
  scrollRef,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerID,
  userData,
  online,
  checkActiveStatus,
  handleImageChange,
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* message header */}
      <div className="w-full flex p-3 items-center justify-between bg-orange-300 ">
        <div className="flex">
          <img
            src={`${backend_url}${userData?.avatar}`}
            alt=""
            className="w-[60px] h-[60px] rounded-full "
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1>{checkActiveStatus ? "Active Now " : "not Active"}</h1>
          </div>
        </div>
        <AiOutlineArrowRight size={20} onClick={() => setOpen(false)} />
      </div>

      {/* messages */}

      <div className="px-3  h-[65vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((message, index) => {
           return (
            <div
            key={index}
            className={`flex w-full my-2 ${
              message.sender === sellerID ? "justify-end" : "justify-start"
            }`}
            ref={scrollRef}
          >
            {message.sender !== sellerID && (
              <img
                src="http://localhost:8000/ablog-1727899083377-91380777.png"
                alt=""
                className="w-[40px] h-[40px] mr-3 rounded-full "
              />
            )}
            {/* show image if user send */}
            {message.images && (
              <img
              src={`${backend_url}/${message.images}`}
              className="w-[300px] h-[300px] object-cover mr-2" alt="" />
            )}

            {/* show text if user send */}
        {
          message.text !== "" && (
            <div>
            <div
              className={`w-max h-min rounded p-2 ${
                message.sender === sellerID
                  ? "bg-orange-200"
                  : "bg-gray-200"
              }`}
            >
              <p className="block">{message.text}</p>
            </div>
            <div className="flex justify-end">
              <p className="text-[12px] text-[#000c] ">
                {format(message.createdAt)}
              </p>
            </div>
          </div>
          )
        }

          </div>
           )
})}
      </div>

      {/* send message input */}
      <form
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[30px]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageChange}
          />
          <label htmlFor="image">
            <TfiGallery size={20} className="cursor-pointer" />
          </label>
        </div>
        <div className="w-[97%]">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input}`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send" className="cursor-pointer">
            <AiOutlineSend size={25} className=" absolute right-4 top-4" />
          </label>
        </div>
      </form>
    </div>
  );
};
export default DashboardMessages;
