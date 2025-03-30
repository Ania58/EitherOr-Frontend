import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

const DeleteComment = ({commentId, onCommentDeleted, onNotifyDelete}) => {
    const { id } = useParams();
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("voterId")) {
            const newId = crypto.randomUUID(); 
            localStorage.setItem("voterId", newId);
        }
        }, []);
    
        const CommentorId = localStorage.getItem("voterId");

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
          if (onNotifyDelete) {
            onNotifyDelete();
          }
          setConfirming(false);
        } catch (error) {
            console.error("Error deleting comment");
        }
    };
    return confirming ? (
        <div>
          <p>Are you sure you want to delete your comment?</p>
          <button onClick={deleteComment}>✅ Yes, delete</button>{" "}
          <button onClick={() => setConfirming(false)}>❌ Cancel</button>
        </div>
      ) : (
        <button onClick={() => setConfirming(true)}>🗑 Delete</button>
      );
};

export default DeleteComment;