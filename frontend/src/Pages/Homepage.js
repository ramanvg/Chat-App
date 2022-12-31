import React, { useEffect } from 'react'
import { Box, Container, Text, TabList, Tab, Tabs, TabPanel, TabPanels } from '@chakra-ui/react'
import Login from '../Components/Authentication/Login';
import Signup from '../Components/Authentication/Signup';
import { useHistory } from 'react-router-dom';
const Homepage = () => {

    const history = useHistory();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) history.push("/chats");
    },[history]);
    return (
        <Container maxW="xl" centerContent>
            <Box
                d='flex'
                justifyContent='center'
                p={3}
                bg={"white"}
                w="100%"
                m="40px 0 15px 0"
                
                borderWidth="1px"
            >
                <Text fontSize='4xl' fontFamily="work sans" color='black'>Talk-A-Tive</Text>
            </Box>
            <Box bg="white" w="100%" p={4}  borderWidth="1px">
               <Tabs variant='soft-rounded' >
             <TabList mb='1em'>
             <Tab width='50%'>Login</Tab>
    <Tab width='50%'>Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
    <Login />
    </TabPanel>
    <TabPanel>
      <Signup /> 
    </TabPanel>
  </TabPanels>
</Tabs>
            </Box>
    </Container>
    );
};

export default Homepage;