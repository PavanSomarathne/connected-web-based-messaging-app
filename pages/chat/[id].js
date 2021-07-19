import Head from "next/head";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatDisplay from "../../Components/ChatDisplay";
import Sidebar from "../../Components/Sidebar";
import { db, auth } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { IconButton } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export default function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [isOpen, setIsOpen] = useState(false);

  //  getting a value for a vh unit
  let vh = window.innerHeight * 0.01;
  //etting the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const breakpoint = 768;
  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      {width <= breakpoint ? (
        <>
          <Panel>
            <div style={{ backgroundColor: "transparent" }}>
              <IconButton onClick={() => setIsOpen(isOpen ? false : true)}>
                {isOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
              </IconButton>
            </div>
          </Panel>
          {isOpen ? <Sidebar /> : null}
        </>
      ) : (
        <Sidebar />
      )}
      <ChatContainer>
        <ChatDisplay chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);
  //create messages on server
  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  //create chats
  const chatsRes = await ref.get();
  const chat = {
    id: chatsRes.id,
    ...chatsRes.data(),
  };
  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}
const Panel = styled.div`
  display: flex;
  direction: column;
  background-color: whitesmoke;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);

  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none; /*IE and Edge*/
  scrollbar-width: none; /*Firefox*/
`;
