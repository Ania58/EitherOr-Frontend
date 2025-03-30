import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { UserContext } from "../contexts/UserContext";


const CreateComment = ({onCommentAdded}) => {
    const { id } = useParams();
    const [ commentText, setCommentText ] = useState("");
    const { user } = useContext(UserContext); 

     useEffect(() => {
            if (!localStorage.getItem("voterId")) {
              const newId = crypto.randomUUID(); 
              localStorage.setItem("voterId", newId);
            }
          }, []);

    const handleChange = (e) => {
        setCommentText(e.target.value);
    };

    const addComment = async (e) => {
        e.preventDefault();
        const commentorId = user?.uid || localStorage.getItem("voterId");
       
        try {
            const response = await api.post(`/questions/${id}/comments`,
                {
                    user: commentorId, 
                    name: user?.displayName || user?.email?.split("@")[0] || "Anonymous",
                    text: commentText
                },
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    }
                }   
            );
            setCommentText("");
            if (onCommentAdded) {
                onCommentAdded(response.data); 
              }
        } catch (error) {
            console.error("Error adding comment", error);
        }
    };

    return (
        <form onSubmit={addComment}>
            <h3>Write Your Comment</h3>
            <input type="text" value={commentText} onChange={handleChange}/>
            <button type="submit">Post Your Comment</button>
        </form>
    );
};

export default CreateComment;