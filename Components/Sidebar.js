import styled from "styled-components";
import { Avatar, Button, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import { Create } from "@material-ui/icons";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "../Components/Chat";

export default function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatSnapshot] = useCollection(userChatRef);
//  getting a value for a vh unit
let vh = window.innerHeight * 0.01;
//etting the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);
  const createChat = () => {
    const input = prompt("Enter email");
    if (!input) return null;
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };
  const chatAlreadyExists = (recipiantEmail) =>
    !!chatSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipiantEmail)?.length > 0
    );

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        <IconContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconContainer>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search In chats" />
      </Search>
      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
      {/* list of chats */}
      {chatSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  min-width: 300px;
  max-width: 350px;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconContainer = styled.div`
  display: flex;
  alighn-items: center;
  padding: 5px;
  border-radius: 2px;
`;

const Search = styled.div`
  display: flex;
  alighn-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 2px solid whitesmoke;
    border-bottom: 2px solid whitesmoke;
  }
`;
