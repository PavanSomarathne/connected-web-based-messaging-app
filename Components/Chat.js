import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

export default function Chat({ id, users }) {
  console.log(users);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(users, user);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );
  const enterChat = () => router.push(`/chat/${id}`);

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      {recipient?.name ? (
        <p>
          <b>{recipient?.name}</b>
          <br />
          <EmailSpan>{recipientEmail}</EmailSpan>
        </p>
      ) : (
        <p>
          Not Registered
          <br />
          <EmailSpan>{recipientEmail}</EmailSpan>
        </p>
      )}
    </Container>
  );
}
const EmailSpan = styled.span`
  color: gray;
  font-size: 0.8em;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
