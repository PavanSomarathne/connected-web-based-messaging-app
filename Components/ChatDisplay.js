import { useRouter } from "next/router";
import styled from "styled-components";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useCollection } from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import Message from "../Components/Message";
import firebase from "firebase";
import { useRef, useState } from "react";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo  from "timeago-react";
import MicIcon from '@material-ui/icons/Mic';
export default function ChatDisplay({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [input, setInput]= useState("");
  const endOfMsgsRef=useRef(null)
  const router = useRouter();
  const [msgsSnapShot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
const [recipientSnapshot]=useCollection(
  db.collection('users').where("email","==",getRecipientEmail(chat.users,user))
)
  const showMessages = () => {
    if (msgsSnapShot) {
      return msgsSnapShot.docs.map((message) => (
        <Message
          key={messages.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    }else{
        return JSON.parse(messages).map(message=>{
            <Message
          key={messages.id}
          user={message.user}
          message={message}
        />
        })
    }
  };

  const scrollToBotom = () => {
     endOfMsgsRef.current.scrollIntoView({
         behavior:"smooth",
         block: "start",
     }); 
  }
const sendMsg=(e)=>{
        e.preventDefault();
        //update last seen
        db.collection("users").doc(user.uid).set({
            lastSeen:firebase.firestore.FieldValue.serverTimestamp(),
        },{merge:true});

        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            message:input,
            user:user.email,
            photoURL:user.photoURL,
        });
         
        setInput("");
        scrollToBotom();
}
const recipient= recipientSnapshot?.docs?.[0]?.data();
const recipiantEmail=getRecipientEmail(chat.users,user);
  return (
    <Container>
      <Header>
          {recipient?(<Avatar src={recipient?.photoURL}/>):(<Avatar >{recipiantEmail[0]}</Avatar>)}
        
        <HeaderInfo>
          <h3>{recipiantEmail}</h3>
          {recipientSnapshot?(
              <p>Last active{' '}{recipient?.lastSeen?.toDate()?(<TimeAgo datetime={recipient.lastSeen?.toDate()} />):"Unavailable"}</p>
          ):(<p>Loading...</p>)}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
        
          </IconButton>
          <IconButton>
           
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MsgContainer>
        {showMessages()}
        <EndOfMsg ref={endOfMsgsRef} />
      </MsgContainer>
      
      <InputContainer>
        <InsertEmoticonIcon/>
        <Input value={input} onChange={(e)=>setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMsg}>Send message</button><MicIcon />
      </InputContainer>
    </Container>
  );
}

const Container = styled.div``;
const Header = styled.div`
  position: sticky;
  background-color: #ffffff;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11x;
  height: 80px;
  align-items: center;
  border-bottom: 2px solid whitesmoke;
`;
const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: 0px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;
const MsgContainer = styled.div`
padding: 30px;
background-color: #e5ded8;
min-height:90vh;
`;

const EndOfMsg = styled.div`
margin-bottom:50px;
`;

const HeaderIcons = styled.div``;

const InputContainer = styled.form`
display: flex;
	align-items: center;
	padding: 10px;
	position: sticky;
	bottom: 0;
	background-color: white;
	z-index: 100;
`;

const Input = styled.input`
flex: 1;
	outline: none;
	border: none;
	border-radius: 10px;
	background-color: whitesmoke;
	padding: 20px;
	margin-left: 15px;
	margin-right: 15px;
`;