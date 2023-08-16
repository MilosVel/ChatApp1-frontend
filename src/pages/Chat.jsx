import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) { // ako nema nista u localStorage vrati se na login
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);

  useEffect(() => { ///   Ovaj useEffect je dobar zbog optimizacije, jer se soket emituje samo dada se promeni currentUser, znaci kada se izlogujemo i ponovo ulogujemo
  if (currentUser) {
    socket.current = io(host);
    console.log('Soket je ',socket.current)
    socket.current.emit("add-user", currentUser._id); // we pass currentUser._id whenever currentUser is loggedin. I to ulazi u new Map na bekendu.
  }
  }, [currentUser]);

  useEffect(async () => {// ovaj useEffect se pokrece na samom pocetku - ucitavanju i kada se promeni currentUser. Znaci kada imamo currentUser mi dobijamo podatke iz baze i setujemo contacts
    if (currentUser) { // provera se da li postoji currentUser
      if (currentUser.isAvatarImageSet) { // proverava se da li currentUser ima sliku
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data); // setujemo contacts sa podacima-userima iz baze (i to prosledjujemo u Contect.jsx)
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
