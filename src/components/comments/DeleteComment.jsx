import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { UserContext } from "../contexts/UserContext";
import Spinner from "../common/Spinner";

const DeleteComment = ({commentId, onCommentDeleted, onNotifyDelete}) => {
    const { id } = useParams();
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!localStorage.getItem("voterId")) {
            const newId = crypto.randomUUID(); 
            localStorage.setItem("voterId", newId);
        }
        }, []);
    
        const commentorId = user?.uid || localStorage.getItem("voterId");

    const deleteComment = async (e) => {
        e.preventDefault();
        try {
          setLoading(true);
           const response = await api.delete(`/questions/${id}/comments`, {
            data: {
                commentId,
                user: commentorId
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
        } finally {
          setLoading(false);
        }
    };
    return confirming ? (
        <div>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <p>Are you sure you want to delete your comment?</p>
              <button onClick={deleteComment}>✅ Yes, delete</button>{" "}
              <button onClick={() => setConfirming(false)}>❌ Cancel</button>
            </>
           )}
        </div>
      ) : (
        <button onClick={() => setConfirming(true)}>🗑 Delete</button>
      );
};

export default DeleteComment;