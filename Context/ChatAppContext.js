import React, { useState, useEffect, } from 'react';
import { useRouter } from 'next/router';

//INTERNAL IMPORT
import { 
    CheckIfWalletConnected, 
    connectWallet, 
    connectingWithContract 
} from '@/Utils/apiFeature';

export const ChatAppContext = React.createContext();

export const ChatAppProvider = ({children}) => {
    //USESTATE
    const [account, setAccount] = useState("");
    const [userName, setUserName] = useState("");
    const [friendLists, setFriendLists] = useState([]);
    const [friendMsg, setfriendMsg] = useState([]);
    const [loading, setloading] = useState(false);
    const [userLists, setuserLists] = useState([]);
    const [error, seterror] = useState("");

    //CHAT USER DATA
    const [currentUserName, setcurrentUserName] = useState("");
    const [currentUserAddress, setcurrentUserAddress] = useState("");

    const router = useRouter();

    //FETCH DATA TIME OF PAGE LOAD
    const fetchData = async() => {
        try {
            //GET CONTRACT
            const contract = await connectingWithContract();

            //GET ACCOUNT
            const connectAccount = await connectWallet();
            setAccount(connectAccount);

            //GET USER NAME
            const userName = await contract.getUsername(connectAccount);
            setUserName(userName);

            //GET MY FRIEND LIST
            const friendLists = await contract.getMyFriendList();
            setFriendLists(friendLists);

            //GET ALL APP USER LIST
            const userList = await contract.getAllAppUser();
            setUserLists(userList);


        } catch (error) {
            seterror("Please Install and Connect your Wallet");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    //READ MESSAGE
    const readMessage = async (friendAddress) => {
        try {
            const contract = await connectingWithContract();
            const read = await contract.readMessage(friendAddress);
            setFriendMsg(read);
        } catch (error) {
            seterror("Currently you have No Message");
        }   
    };

    //CREATE ACCOUNT
    const createAccount = async ({ name, accountAddress }) => {
        try {
            if  (name || accountAddress)
                return seterror("Name and Account Address, cannot be empty");
            const contract = await connectingWithContract();
            const getCreatedUser = await contract.createAccount(name);
            setLoading (true);
            await getCreatedUser.wait();
            setLoading(false);
            window.location.reload();

        } catch (error) {
            seterror("Error while creating your acoount, Please reload browser");
        }
    };

    //ADD YOUR FRIENDS
    const addFriends = async ({ name, accountAddress }) => {
        try {
            // if(name || accountAddress) return seterror("Please provide data");

            const contract = await connectingWithContract();
            const addMyFriend = await contract.addFriend(accountAddress, name);
            setLoading(true);
            await addMyFriend.wait();
            setLoading(false);
            router.push("/");
            window.location.reload();

        } catch (error) {
            seterror("Something went wrong while adding friends, try again");
        }
    };

    //SEND MESSAGE TO YOUR FRIEND
    const sendMessage = async ({ msg, address }) => {
        try {
            if (msg || address) return seterror ("Please Type your Message");

            const contract = await connectingWithContract();
            const addMessage = await contract.sendMessage(address, msg);
            setLoading(true);
            await addMessage.wait();
            setLoading(false);
            window.location.reload();

        } catch (error) {
            seterror("Please reload and try again");
        }
    }

    //READ INFO
    const readUser = async (userAddress) => {
        const contract = await connectingWithContract();
        const userName = await contract.getUsername(userAddress);
        setcurrentUserName(userName);
        setcurrentUserAddress(userAddress);
    };


    return (
        <ChatAppContext.Provider value={{ 
            readMessage, 
            createAccount, 
            addFriends, 
            sendMessage, 
            readUser,
            connectWallet,
            CheckIfWalletConnected,
            account,
            userName,
            friendLists,
            friendMsg,
            userLists,
            loading,
            error,
            currentUserName,
            currentUserAddress,
            }}
            >
            {children}
        </ChatAppContext.Provider>
    );
};