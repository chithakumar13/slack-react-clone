import React, { useEffect, useState } from 'react';

import MessageHeader from './MessageHeader/MessageHeader.component';
import MessageContent from "./MessageContent/MessageContent.component";
import MessageInput from "./MessageInput/MessageInput.component";
import { connect } from "react-redux";
import firebase from "../../server/firebase";
import { Segment, Comment } from 'semantic-ui-react';
import "./Messages.css";

const Messages = (props) => {

    const messageRef = firebase.database().ref('messages');

    const [messagesState, setMessagesState] = useState([]);

    const [searchTermState, setSearchTermState] = useState("");

    useEffect(() => {
        if (props.channel) {
            setMessagesState([]);
            messageRef.child(props.channel.id).on('child_added', (snap) => {
                setMessagesState((currentState) => {
                    let updatedState = [...currentState];
                    updatedState.push(snap.val());
                    return updatedState;
                })
            })

            return () => messageRef.child(props.channel.id).off();
        }
    }, [props.channel])

    const displayMessages = () => {
        let messagesToDisplay = searchTermState ? filterMessageBySearchTerm() : messagesState;
        if (messagesToDisplay.length > 0) {
            return messagesToDisplay.map((message) => {
                return <MessageContent ownMessage={message.user.id === props.user.uid} key={message.timestamp} message={message} />
            })
        }
    }

    const uniqueusersCount = () => {
        const uniqueUsers = messagesState.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);

        return uniqueUsers.length;
    }

    const searchTermChange = (e) => {
        const target = e.target;
        setSearchTermState(target.value);
    }

    const filterMessageBySearchTerm = () => {
        const regex = new RegExp(searchTermState,"gi");
        const messages = messagesState.reduce((acc, message) => {
            if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, []);

        return messages;
    }

    return <div className="messages"><MessageHeader searchTermChange={searchTermChange} channelName={props.channel?.name} uniqueUsers={uniqueusersCount()} />
        <Segment className="messagecontent">
            <Comment.Group>
                {displayMessages()}
            </Comment.Group>
        </Segment>
        <MessageInput /></div>
}

const mapStateToProps = (state) => {
    return {
        channel: state.channel.currentChannel,
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(Messages);