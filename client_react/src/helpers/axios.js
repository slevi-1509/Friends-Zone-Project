import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"

export const replyPost = async (reply, postId) => {
    const currUser = useSelector(state => state.currUser);
    const refreshPosts = useSelector(state => state.refreshPosts);
    // debugger;
    if (reply.body==""){
        alert ("Reply is empty!")
    } else { 
        let newReply = {...reply, username: currUser.username, date: Date.now()}
        // console.log(e, newReply, props)
        try {
            await axios.put(serverURL+"/"+postId, newReply, params).then(({data:response}) => {
                if (response != "Post updated successfully!") {
                    alert(response);
                } 
            });
            dispatch({ type: "REFRESH_POSTS", payload: !refreshPosts });
            props.onHide();
        } catch (error) {
            alert (error.message);
        }
        
    }
    // dispatch({ type: "REPLY_FLAG", payload: !replyFlag });
    // dispatch({ type: "REFRESH_POSTS", payload: !refreshPosts });
};   