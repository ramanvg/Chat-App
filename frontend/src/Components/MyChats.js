import React, { useState } from 'react';
import { AddIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import { useToast } from '@chakra-ui/react';
import { Box , Stack ,Text } from '@chakra-ui/layout';
import axios from 'axios';
import { getSender } from '../config/ChatLogics';
import { useEffect } from "react";
import { Button } from '@chakra-ui/button';
import ChatLoading from './ChatLoading';
import GroupChatModal from './miscellaneous/GroupChatModel';

const MyChats = () => {
    
    
    const [loggedUser, setLoggedUser] = useState();

    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const toast = useToast();
   
    const getSender = (loggedUser, users) => {
                             return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
                           };
    
    
    const fetchChats = async () => {
        // console.log(user._id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("/api/chat", config);

            setChats(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };
    useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    
  }, []);
    
    return ( <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      backgroundColor="white"
      width={{ base: "100%", md: "31%" }}
      borderWidth="1px">
        <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        >
            My Chats
            <GroupChatModal>
                <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
            </Button>
            </GroupChatModal>
            
        </Box>
        <Box display="flex" flexDir="column" p={3} backgroundColor="#F8F8F8" width="100%" height="100%" overflowY="hidden">
        {chats ? (
            <Stack overflowY="scroll">
                {chats.map((chat) => (
                    <Box
                        onClick={() => setSelectedChat(chat)}
                        cursor="pointer"
                        backgroundColor= { selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                        color={selectedChat === chat ? "white" : "black"}
                        px={3}
                        py={2}
                        key={chat._id}
                    >
                        <Text>
                        
                            {getSender(loggedUser, chat.users)}
                      
                        </Text>
                        
              
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
    );
};
export default MyChats;