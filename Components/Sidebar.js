import styled from "styled-components";
import {Avatar} from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat"
export default function Sidebar() {
  return (
    <Container>
      <Header>
        <UserAvatar />
        <IconContainer>
            </IconContainer>
      </Header>
    </Container>
  );
}

const Container = styled.div``;

const Header = styled.div``;

const UserAvatar = styled(Avatar)``;

const IconContainer = styled.div``;