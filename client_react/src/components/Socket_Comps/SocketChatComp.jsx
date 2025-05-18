import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { io } from "socket.io-client"
import 'bootstrap/dist/css/bootstrap.css'; 
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faArrowsDownToLine } from '@fortawesome/free-solid-svg-icons'
import { SocketMsgComp } from "./SocketMsgComp";
import AppContext from '../appContext';
import "../../styles/Socket.css"

export const SocketChatComp=(props) => {
    const messagesColumnRef = useRef();
    const roomSelectElement = useRef();
    const currUser = useSelector(state => state.currUser);
    const [socket, setSocket] = useState({});
    const [chatMessages, setChatMessages] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [privateChat, setPrivateChat] = useState()
    const [messageBody, setMessageBody] = useState("");
    const [msgImageURL, setMsgImageURL] = useState("");
    const [chatRoom, setChatRoom] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [replyClone, setReplyClone] = useState();
    const [replyCloneShow, setReplyCloneShow] = useState(false);
    const [msgReplied, setMsgReplied] = useState({});
    const [scrollBtn, setScrollBtn] = useState(false);
    
    let messageDate = Date.now()
    const user = props.user;

    useEffect(() => {
        console.log("render socket")
        let socketObj = io (AppContext.SERVER_IP+AppContext.HTTP_PORT);
        const getSocket = () => {
            setSocket(socketObj);
            if(user){
                setPrivateChat(true)
                let privateChatRoom = [currUser.username, currUser._id, user.username, user._id].sort().join("");
                socketObj.emit("join_room", currUser.username, privateChatRoom)
                setSelectedRoom(privateChatRoom);
            } else {
                setPrivateChat(false);
                socketObj.emit("getRooms");
            }
            setReplyCloneShow(false);
        }

        socketObj.on("getRooms", (myRooms) => {    
            if(myRooms.length > 0){     
                setRooms([...myRooms]);
                socketObj.emit("roomSelect", currUser.username, myRooms[0]);
                setSelectedRoom(myRooms[0]);
                setScrollBtn(!scrollBtn)
            }
            return () => socketObj.off('getRooms');
        });

        socketObj.on("response", (messages, myRooms, currRoom) => {
            if (messages.length > 0 && (roomSelectElement.current == undefined || messages[0].room == roomSelectElement.current.value)){
                let tempArr = messages.map(message=>{
                    if(message.replyTo!=null){
                        let replyToMsg = messages.find(msg => msg._id == message.replyTo);
                        return {...message, 
                                    replyMsgBody: replyToMsg.body, 
                                    replyMsgSender: replyToMsg.sendName, 
                                    replyMsgImage: replyToMsg.imageURL,
                                    replyMsgTime: replyToMsg.sendDate
                                }
                    } else {
                        return message;
                    };

                })
                setChatMessages(tempArr);                
                setRooms([...myRooms]);
                setScrollBtn(!scrollBtn)
            } else {
                setChatMessages([]);                
                setRooms([...myRooms]);
            }
            return () => socketObj.off('response');
        });
        
        socketObj.on("join_room", (messages, myRooms) => {
            let tempArr = messages.map(message=>{
                if(message.replyTo!=null){
                    let replyToMsg = messages.find(msg => msg._id == message.replyTo);
                    return {...message, 
                                replyMsgBody: replyToMsg.body, 
                                replyMsgSender: replyToMsg.sendName, 
                                replyMsgImage: replyToMsg.imageURL,
                                replyMsgTime: replyToMsg.sendDate
                            }
                } else {
                    return message;
                };

            })
            setChatMessages(tempArr);                
            setRooms([...myRooms]);
            setScrollBtn(!scrollBtn)
            return () => socketObj.off('join_room');
        });
        
        socketObj.on("leave_room", (myRooms) => {
            setRooms(myRooms);
            roomSelect(myRooms[0]);
            return () => socket.off('leave_room');
        }); 
        
        socketObj.on("leave_all_rooms", () => {
            setRooms([]);
            setChatMessages([]);    
            return () => socket.off('leave_all_rooms');            
        }); 
                
        getSocket();
    }, []);

    useEffect(() => {
        if (messagesColumnRef.current != undefined) {
        messagesColumnRef.current.scrollTop =
          messagesColumnRef.current.scrollHeight;
        }
    }, [chatMessages, scrollBtn]);

    // useEffect(() => {
    //     // debugger;
    //     if(user){
    //         setPrivateChat(true)
    //         let privateChatRoom = [currUser.username, currUser._id, user.username, user._id].sort().join("");
    //         socket.emit("join_room", currUser.username, privateChatRoom)
    //         setSelectedRoom(privateChatRoom);
    //     } else {
    //         setPrivateChat(false);
    //         socket.emit("getRooms");
    //     }
    //     setReplyCloneShow(false);
    // }, []);

    // useEffect(() => {
    //     socket.on("getRooms", (myRooms) => {    
    //         if(myRooms.length > 0){     
    //             setRooms([...myRooms]);
    //             socket.emit("roomSelect", currUser.username, myRooms[0]);
    //             setSelectedRoom(myRooms[0]);
    //             setScrollBtn(!scrollBtn)
    //         }
    //     });
    //     return () => socket.off('getRooms');
    // }, [socket]);

    // useEffect(() => {  
    //     socket.on("response", (messages, myRooms, currRoom) => {
    //         if (messages.length > 0 && (roomSelectElement.current == undefined || messages[0].room == roomSelectElement.current.value)){
    //             let tempArr = messages.map(message=>{
    //                 if(message.replyTo!=null){
    //                     let replyToMsg = messages.find(msg => msg._id == message.replyTo);
    //                     return {...message, 
    //                                 replyMsgBody: replyToMsg.body, 
    //                                 replyMsgSender: replyToMsg.sendName, 
    //                                 replyMsgImage: replyToMsg.imageURL,
    //                                 replyMsgTime: replyToMsg.sendDate
    //                             }
    //                 } else {
    //                     return message;
    //                 };

    //             })
    //             setChatMessages(tempArr);                
    //             setRooms([...myRooms]);
    //             setScrollBtn(!scrollBtn)
    //         } else {
    //             setChatMessages([]);                
    //             setRooms([...myRooms]);
    //         }
    //     });
    //     // 
    //     return () => socket.off('response');
    // }, [socket]);

    // useEffect(() => {  
    //     socket.on("join_room", (messages, myRooms) => {
    //         let tempArr = messages.map(message=>{
    //             if(message.replyTo!=null){
    //                 let replyToMsg = messages.find(msg => msg._id == message.replyTo);
    //                 return {...message, 
    //                             replyMsgBody: replyToMsg.body, 
    //                             replyMsgSender: replyToMsg.sendName, 
    //                             replyMsgImage: replyToMsg.imageURL,
    //                             replyMsgTime: replyToMsg.sendDate
    //                         }
    //             } else {
    //                 return message;
    //             };

    //         })
    //         setChatMessages(tempArr);                
    //         setRooms([...myRooms]);
    //         setScrollBtn(!scrollBtn)
            
    //     });
    //     // 
    //     return () => socket.off('join_room');
    // }, [socket]);
    
    // useEffect(() => {
    //     socket.on("leave_room", (myRooms) => {
    //         setRooms(myRooms);
    //         roomSelect(myRooms[0]);
    //     }); 
    //     return () => socket.off('leave_room');
    // }, [socket]);

    // useEffect(() => {
    //     socket.on("leave_all_rooms", () => {
    //         setRooms([]);
    //         setChatMessages([]);                
    //     }); 
    //     return () => socket.off('leave_all_rooms');
    // }, [socket]);

    const onSubmit = (event) => {
        event.preventDefault();
        let message = {};
        if(messageBody=="" && msgImageURL==""){
            alert ("Message or Image URL are required")
        } else if (selectedRoom=="") {
            alert ("Need to join a room to send a message!")
        }else{
            let reply_id = replyCloneShow ? msgReplied._id : null ;
            if(privateChat){
                message = ({
                    sendName: currUser.username,
                    recvName: user.username,
                    room: selectedRoom,
                    sendDate: Date.now(),
                    body: messageBody,
                    imageURL: msgImageURL,
                    replyTo: reply_id
                });
            } else {
                message = ({
                    sendName: currUser.username,
                    recvName: "",
                    room: selectedRoom,
                    sendDate: Date.now(),
                    body: messageBody,
                    imageURL: msgImageURL,
                    replyTo: reply_id
                });
            }
            socket.emit("send_message", message, currUser.username, selectedRoom);
            setMessageBody("");
            setMsgImageURL("");
            setReplyCloneShow(false);
        }
    }
    const joinRoom = () => {
        if (chatRoom.replaceAll(/\s/g,'') != "") {
            setSelectedRoom(chatRoom)
            socket.emit("join_room", currUser.username, chatRoom)
            setChatRoom("");
        }
    }

    const roomSelect = (room) => {
        setSelectedRoom(room);
        socket.emit("roomSelect", currUser.username, room);
        setReplyCloneShow(false);
        setChatRoom("");
    }

    const onReply = (message) => {
        let messageDate = new Date(message.sendDate)
        setReplyClone(
            <div className="d-flex">
                <div id="cloneReplyCard">
                    <section className="d-flex flex-row">
                        <strong id="chatMessageSender" className="chatMessageLine">{message.sendName}</strong>
                        <p id="replyCloseBtn" title="Close" onClick={()=>{setReplyCloneShow(false)}}><strong>X</strong></p>
                    </section>
                    <p id="chatMessageBody" className="chatMessageLine">{message.body}</p>
                    <p id="chatMessageTime" className="chatMessageLine">{messageDate.getHours()+":"+
                        String(messageDate.getMinutes()).padStart(2, "0")}</p>
                </div>
                <img style={{ height: "3.75rem", margin: "1rem 0 -2rem 0", border: "2px solid rgb(80, 132, 120)", opacity: "70%"}} src={message.imageURL}/>
            </div>
        )
        setReplyCloneShow(true);
        setMsgReplied(message);
    }

    const leaveRoom = (room) => {
        if (room!="") {
            socket.emit("leaveRoom", room, currUser.username);
        }
    }

    const deleteRoom = (room) => {
        if (room!="") {
            socket.emit("deleteRoom", room, currUser.username);
        }
    }

    const leaveAllRooms = () => {
        socket.emit("leaveAllRooms")
    }
   
    const handleClose=()=>{
        if(privateChat){
            socket.emit("leaveRoom", selectedRoom, currUser.username);
        }
        Object.keys(socket).length>0?socket.disconnect():"";
    }

    const handleBodyClick=()=>{
        if(replyCloneShow){
            setReplyCloneShow(false);
            setMsgReplied({});
        }
    }

    return (
        <div>
            <Modal id="socketModal"
                {...props}
                size="lg"
                centered
                backdrop="static"
            >
                <div id="socketMsgModal"> 
                    <Modal.Header id="modalHeader" closeButton onHide={handleClose}>
                        { privateChat==false && 
                            <div>
                                <section id="roomSection">
                                    <input id="chatRoom" className="" type="text" name="chatroom" placeholder="Room name:" value={chatRoom} onChange={e=>{setChatRoom(e.target.value)}}></input>
                                    <button id="joinBtn" onClick={()=>{joinRoom(chatRoom)}}>Join</button>
                                    <button id="leaveAllBtn" onClick={leaveAllRooms}>Leave All</button>
                                </section>
                                <Modal.Title id="modalTitle">
                                    <section>                               
                                        {rooms.length>0 && 
                                            <section className="d-flex flex-row">
                                                <p className="d-flex flex-row socketTitle">Show room:</p>
                                                
                                                <select id="roomSelect" value={selectedRoom} ref={roomSelectElement} onChange={(e)=>{roomSelect(e.target.value)}}>
                                                    {
                                                        rooms.map((room, index)=>{
                                                            return <option key={index} value={room}>{room}</option>
                                                        })
                                                    }
                                                </select>
                                                
                                                <button id="leaveBtn" onClick={()=>{leaveRoom(selectedRoom)}}>Leave</button>
                                                <button id="deleteBtn" onClick={()=>{deleteRoom(selectedRoom)}}>Delete</button>
                                            </section>
                                        }               
                                        <button onClick={()=>{setScrollBtn(!scrollBtn)}} id="SocketscrlDownBtn" title='Scroll down messages'><i><FontAwesomeIcon icon={faArrowsDownToLine}/></i></button>
                                    </section> 
                                </Modal.Title>
                            </div>
                        }
                        { privateChat && 
                            <div>
                                <Modal.Title id="modalTitle">
                                    <section>                               
                                        <section className="d-flex flex-column">
                                            <h3>Private Chat with: </h3>
                                            <h3>{user.fname} {user.lname}</h3>
                                        </section>
                                        <button onClick={()=>{setScrollBtn(!scrollBtn)}} id="SocketscrlDownBtn" title='Scroll down messages'><i><FontAwesomeIcon icon={faArrowsDownToLine}/></i></button>
                                    </section> 
                                </Modal.Title>
                            </div>
                        }
                    </Modal.Header>
                    
                    <Modal.Body id="socketMsgContainer" onClick={handleBodyClick} ref={messagesColumnRef}>
                        {chatMessages.length > 0 && 
                            chatMessages.sort((a, b)=>{new Date(a.sendDate) - new Date(b.sendDate)}).map((message, index) => {
                                if (new Date(message.sendDate).getDate()!=new Date(messageDate).getDate() ||
                                    new Date(message.sendDate).getMonth()!=new Date(messageDate).getMonth()){
                                    messageDate = message.sendDate;
                                    return <div key={index}>
                                        <h5 id="dateSep" style={{justifySelf: 'center', margin: '10px 0px 10px 0px', color: 'rgb(228, 235, 131)'}}>
                                        {new Date(messageDate).toLocaleDateString("he-IL", {dateStyle:"full"})}</h5>
                                        <SocketMsgComp message={message} onReply={onReply}/>
                                    </div>
                                } else {
                                    messageDate = message.sendDate;
                                    return <SocketMsgComp message={message} onReply={onReply} key={index}/>;
                                }
                            })
                        }
                        <div onLoad={()=>{setScrollBtn(!scrollBtn)}}></div>;
                    </Modal.Body>
                    <form onSubmit={ onSubmit }>
                        <div id="chatSendMsgDiv" className="d-flex flex-column">
                            {replyCloneShow && <div>{replyClone}</div>} 
                            <textarea type="text" id="chatSendMsgBody" name="chatSendMsgBody" value={messageBody} placeholder="New Message" 
                                onChange={e=>{setMessageBody(e.target.value)}}/>
                            <input id="chatImageUrlInput" type="text" name="chatImageUrlInput" value={msgImageURL} placeholder='Image URL here:' onChange={e=>{setMsgImageURL(e.target.value)}}></input>
                        </div>
                        <button type="submit" title="Send Message" id="chatSendMsgBtn"><i><FontAwesomeIcon icon={faPaperPlane} id="chatSendBtnIcon"/></i></button>\
                    </form>
                    
                </div> 
            </Modal>
        </div>
    );
}