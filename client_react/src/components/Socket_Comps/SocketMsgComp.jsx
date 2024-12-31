import { useEffect, useState, useRef } from 'react';
import { useSelector } from "react-redux"
import 'bootstrap/dist/css/bootstrap.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply } from '@fortawesome/free-solid-svg-icons'
import "../../styles/Socket.css"
import noImage from '../../data/noImage.png'; 


export const SocketMsgComp=({ message, chatMessages, onReply}) => {
    const currUser = useSelector(state => state.currUser);
    const [msgType, setMsgType] = useState({});
    const [replyBtnShow, setReplyBtnShow] = useState("none");
    const [msgSender, setMsgSender] = useState("");
    const [msgRepliedTo, setMsgRepliedTo] = useState({});
    const messageDate = new Date(message.sendDate)

    useEffect (() => {
        const getMsgType = () => {
            if (message.sendName==currUser.username){
                setMsgType ({
                    backgroundColor: 'rgb(17, 67, 32)',
                    border: '2px solid rgb(17, 67, 32)',
                    marginRight: '0 auto',
                    marginLeft: 0,
                    flexDirection: 'row',
                    left: '1rem',
                    replyColor: 'rgb(2, 34, 12)'
                  })
            } else {
                setMsgType ({
                    backgroundColor: 'rgb(70, 70, 70)',
                    border: '2px solid rgb(70, 70, 70)',
                    marginRight: 0,
                    marginLeft: '0 auto',
                    flexDirection: 'row-reverse',
                    right: '1rem',
                    replyColor: 'rgb(46, 45, 45)'
                  })
            }
            if(message.replyTo!=null){
                console.log(chatMessages);
                console.log(chatMessages.find(msg => msg._id == message.replyTo));
                setMsgRepliedTo(chatMessages.find(msg => msg._id == message.replyTo));
            };
            currUser.username==message.sendName?setMsgSender("Me"):setMsgSender(message.sendName);
        }
        getMsgType()
    }, []);

    return (
       <div id="chatContainer" onMouseOver={()=>setReplyBtnShow("block")} onMouseLeave={()=>setReplyBtnShow("none")}
            style={{display:'flex', flexDirection: msgType.flexDirection}}>
            {
            message != "" && 
                <div id="chatBody" style={{marginRight: msgType.marginRight, marginLeft: msgType.marginLeft}}>
                    {
                        message.replyTo!=null && 
                        <div id="replyChatCard" style={{border: msgType.border, backgroundColor: msgType.replyColor, marginBottom: "-0.2rem", width:'inherit'}}>
                            <p id="replyChatSender" className="messageLine">{msgRepliedTo.sendName==currUser.username?"Me":msgRepliedTo.sendName}</p>
                            <section id="replyChatBodySection">
                                <p id="replyChatBody">{msgRepliedTo.body}</p>
                                {/* {
                                    (msgRepliedTo.imageURL != undefined && msgRepliedTo.imageURL.replace(/ /g, '') != "") && 
                                        <div id="replyChatImageCard" style={{}}>
                                            <img src={msgRepliedTo.imageURL} style={{width:"1.5rem",borderRadius:"2px" }} onError={(e) => e.target.src = noImage} />
                                        </div>
                                } */}
                            </section>
                            <p id="replyChatTime" className="messageLine">{new Date(msgRepliedTo.sendDate).getHours()+":"+
                                String(new Date(msgRepliedTo.sendDate).getMinutes()).padStart(2, "0")}</p>
                        </div>
                    }
                    {
                        (message.imageURL != undefined && message.imageURL.replace(/ /g, '') != "") && 
                            <div id="chatImageCard" style={{border: msgType.border, maxWidth:"25rem", minWidth:"7rem" }}>
                                <img src={message.imageURL} style={{borderRadius:"2px", maxWidth:"inherit"}} onError={(e) => e.target.src = noImage} />
                            </div>
                    }

                    {
                            <div id="chatMsgCard" style={{backgroundColor: msgType.backgroundColor, border: msgType.border, width:'inherit'}}>
                                {
                                    message.sendName!=currUser.username &&
                                        <strong id="chatMessageSender" className="chatMessageLine">{msgSender}</strong>
                                }
                                <p id="chatMessageBody" className="chatMessageLine">{message.body}</p>
                                <p id="chatMessageTime" className="chatMessageLine">{messageDate.getHours()+":"+
                                    String(messageDate.getMinutes()).padStart(2, "0")}</p>
                            </div>
                    }
                </div>
            }
            <p id="chatReplyBtn" title="Reply" style={{display: replyBtnShow, left: msgType.left, right: msgType.right}} 
                onClick={()=>{onReply(message)}}><i><FontAwesomeIcon icon={faReply} id="chatReplyIcon"/></i></p>
        </div>
    )
}
