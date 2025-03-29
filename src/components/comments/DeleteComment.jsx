import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

const DeleteComment = ({onCommentDeleted}) => {
    const { id } = useParams();
    const [ commentId, setCommentId ] = useState("");

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
                }
            } catch (error) {
                    console.error("Error fetching comments", error);  
            }
        }
            fetchComments();
    },[id, CommentorId]);

    const deleteComment = async (e) => {
        e.preventDefault();
        try {
           const response = await api.delete(`/questions/${id}/comments`, {
            data: {
                commentId,
                user: CommentorId
            }
           });
           if (onCommentDeleted) {
            onCommentDeleted(response.data.comments); 
          }; 
        } catch (error) {
            console.error("Error deleting comment");
        }
    };
     return (
        <form onSubmit={deleteComment}>
            <h3>Are you sure you want to delete your comment?</h3>
            <button type="submit">Yes, delete</button>
        </form>
     );
};

export default DeleteComment;