import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";


const EditComments = ({onCommentUpdated}) => {
    const { id } = useParams();
    const [ commentId, setCommentId ] = useState("");
    const [ updateComment, setUpdateComment ] = useState("");

    useEffect(() => {
        if (!localStorage.getItem("voterId")) {
            const newId = crypto.randomUUID(); 
            localStorage.setItem("voterId", newId);
        }
    }, []);

    const CommentorId = localStorage.getItem("voterId");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(`/questions/${id}/comments`);
                const myComment = response.data.find(
                    (c) => c.user === CommentorId
                  );
          
                  if (myComment) {
                    setCommentId(myComment._id);
                    setUpdateComment(myComment.text);
                  }
            } catch (error) {
                console.error("Error fetching comments", error);  
            }
        }
        fetchComments();
    },[id, CommentorId]);

    const handleChange = (e) => {
        setUpdateComment(e.target.value)
    };

    const editComment = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/questions/${id}/comments`, {
                commentId, 
                text: updateComment, 
                user: CommentorId
            });
            setUpdateComment("");
            if (onCommentUpdated) {
                onCommentUpdated(response.data.comments); 
              };
        } catch (error) {
            console.error("Error updating comment", error);
        }
    };

    return (
        <form onSubmit={editComment}>
            <h3>Edit your comment</h3>
            <input type="text" value={updateComment} onChange={handleChange} />
            <button type="submit">Edit</button>
        </form>
    );

};

export default EditComments;