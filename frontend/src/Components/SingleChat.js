import React from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box, Spinner,FormControl, useToast } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import { getSender , getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModel';
import UpdateGroupChatModel from './miscellaneous/UpdatGroupChatModel';
import { Input } from '@chakra-ui/react';
import { useState , useEffect } from 'react';
import ScrollableChat from './ScrollableChat';
import axios from 'axios';
import io from 'socket.io-client';
import "./styles.css";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain  }) => {
   
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();
    const [socketConnected, setSocketConnected] = useState(false);
    
    const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
      const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
       }
      };
      useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    
  }, []);
    useEffect(() => {
    fetchMessages();
     selectedChatCompare = selectedChat;

    }, [selectedChat]);
    
    
    const sendMessage = async (event) => { 
        if (event.key === "Enter" && newMessage) {
            socket.emit('stop typing',selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config
                );
                socket.emit("new message",data)
                setMessages([...messages, data]);
            } catch (error) {
                
                 toast({
               title: "Error Occured!",
               description: "Failed to send the Message",
               status: "error",
               duration: 5000,
               isClosable: true,
               position: "bottom",
        });
        }
     }
    };


  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
    const typingHandler = (e) => { 
        setNewMessage(e.target.value);
        if (!socketConnected) return;

 if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
 }
        let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
    };
   
    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                         pb={3}
                         px={2}
                         width="100%"
                         fontFamily="Work sans"
                         display="flex"
                         justifyContent={{ base: "space-between" }}
                          alignItems="center"
                    >
                        <IconButton
                         display={{ base: "flex", md: "none" }}
                         icon={<ArrowBackIcon />}
                         onClick={() => setSelectedChat("")}
                        /> {!selectedChat.isGroupChat ? (
                                 < >
                                     {getSender(user, selectedChat.users)}
                                      <ProfileModal
                                        user={getSenderFull(user, selectedChat.users)}
                                        />
                                  </>
                        ) : (
                                <>{selectedChat.chatName.toUpperCase()}
                                    {<UpdateGroupChatModel
                                        fetchingAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                         /> }
                                </>
                        )}
                    </Text>
                    <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    p={3}
                    backgroundColor="#E8E8E8"
                    width="100%"
                    height="100%"
                     overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                               size="xl"
                               width={20}
                               height={20}
                               alignSelf="center"
                               margin="auto"
                            />
                        ) : (
                                <div className='messages'>
                                    <ScrollableChat messages={messages } />
                           </div>     
                        )}
                        <FormControl
                         onKeyDown={sendMessage}
                        id="first-name"
                        isRequired
                        mt={3}
                        >
                            { istyping ? <div>typing..</div>:(<></>)}
                            
                            
                            <Input
                               variant="filled"
                               backgroundColor="#E0E0E0"
                               placeholder="Enter a message.."
                               value={newMessage}
                                onChange={typingHandler}
                                
                            />
                      </FormControl>
                   </Box>
                </>
            ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                     <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                      Click on a user to start chatting
                     </Text>
                      </Box>

          )}
        </>
    );
  
};

export default SingleChat