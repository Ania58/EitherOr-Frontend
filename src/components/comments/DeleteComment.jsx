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
        <div className="mt-2 space-y-2">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <p className="text-sm text-gray-600">Are you sure you want to delete your comment?</p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={deleteComment} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">✅ Yes, delete</button>{" "}
                <button onClick={() => setConfirming(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">❌ Cancel</button>
              </div>
            </>
           )}
        </div>
      ) : (
        <button onClick={() => setConfirming(true)} className="text-red-500 hover:underline text-sm cursor-pointer">🗑 Delete</button>
      );
};

export default DeleteComment;