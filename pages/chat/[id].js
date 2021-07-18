import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatDisplay from "../../Components/ChatDisplay";
import Sidebar from "../../Components/Sidebar";
import { db,auth } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";

export default function Chat({chat,messages}) {

    const [user]=useAuthState(auth);

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users,user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatDisplay chat={chat} messages={messages}/>
                </ChatContainer>
        </Container>
    )
}

export async function getServerSideProps(context){
    const ref=db.collection("chats").doc(context.query.id);
    //create messages on server
    const messagesRes=await ref.collection("messages").orderBy('timestamp','asc').get();

    const messages=messagesRes.docs.map(doc=>({id:doc.id,...doc.data()})).map((messages => ({
        ...messages,timestamp:messages.timestamp.toDate().getTime()
    })))

    //create chats
    const chatsRes=await ref.get();
    const chat={
        id:chatsRes.id,
        ...chatsRes.data(),
    }
    return{
    props:{
        messages:JSON.stringify(messages),
        chat:chat
    }
    }
}

const Container = styled.div`
display: flex;
`;

const ChatContainer = styled.div`
flex: 1;
overflow: scroll;
height: 100vh ;

::-webkit-scrollbar {
    display: none;
}
--ms-overflow-style: none; /*IE and Edge*/
	scrollbar-width: none; /*Firefox*/
`;