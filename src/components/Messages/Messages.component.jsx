import React, { useEffect, useState,useRef } from 'react';

import MessageHeader from './MessageHeader/MessageHeader.component';
import MessageContent from "./MessageContent/MessageContent.component";
import MessageInput from "./MessageInput/MessageInput.component";
import { connect } from "react-redux";
import { setfavouriteChannel, removefavouriteChannel } from "../../store/actioncreator";
import firebase from "../../server/firebase";
import { Segment, Comment } from 'semantic-ui-react';
import "./Messages.css"; 

const Messages = (props) => {

    const messageRef = firebase.database().ref('messages');

    const usersRef = firebase.database().ref('users');

    const [messagesState, setMessagesState] = useState([]);

    const [searchTermState, setSearchTermState] = useState("");

    let divRef = useRef();

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

    useEffect(() => {

        if (props.user) {
            usersRef.child(props.user.uid).child("favourite")
                .on('child_added', (snap) => {
                    props.setfavouriteChannel(snap.val());
                })

            usersRef.child(props.user.uid).child("favourite")
                .on('child_removed', (snap) => {
                    props.removefavouriteChannel(snap.val());
                })

            return () => usersRef.child(props.user.uid).child("favourite").off();
        }
    }, [props.user])

    useEffect(()=> {
        divRef.scrollIntoView({behavior : 'smooth'});
    },[messagesState])

    const displayMessages = () => {
        let messagesToDisplay = searchTermState ? filterMessageBySearchTerm() : messagesState;
        if (messagesToDisplay.length > 0) {
            return messagesToDisplay.map((message) => {
                return <MessageContent imageLoaded={imageLoaded} ownMessage={message.user.id === props.user.uid} key={message.timestamp} message={message} />
            })
        }
    }

    const imageLoaded= () => {
        divRef.scrollIntoView({behavior : 'smooth'});
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
        const regex = new RegExp(searchTermState, "gi");
        const messages = messagesState.reduce((acc, message) => {
            if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, []);

        return messages;
    }

    const starChange = () => {
        let favouriteRef = usersRef.child(props.user.uid).child("favourite").child(props.channel.id);
        if (isStarred()) {
            favouriteRef.remove();
        } else {
            favouriteRef.set({ channelId: props.channel.id, channelName: props.channel.name })
        }
    }

    const isStarred = () => {
        return Object.keys(props.favouriteChannels).includes(props.channel?.id);
    }

    return <div className="messages"><MessageHeader starChange={starChange} starred={isStarred()} isPrivateChat={props.channel?.isPrivateChat} searchTermChange={searchTermChange} channelName={props.channel?.name} uniqueUsers={uniqueusersCount()} />
        <Segment className="messagecontent">
            <Comment.Group>
                {displayMessages()}
                <div ref={currentEl => divRef = currentEl}></div>
            </Comment.Group>
        </Segment>
        <MessageInput /></div>
}

const mapStateToProps = (state) => {
    return {
        channel: state.channel.currentChannel,
        user: state.user.currentUser,
        favouriteChannels: state.favouriteChannel.favouriteChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setfavouriteChannel: (channel) => dispatch(setfavouriteChannel(channel)),
        removefavouriteChannel: (channel) => dispatch(removefavouriteChannel(channel)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);