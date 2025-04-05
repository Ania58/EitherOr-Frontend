import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { UserContext } from "../contexts/UserContext";
import Spinner from "../common/Spinner";


const CreateComment = ({onCommentAdded}) => {
    const { id } = useParams();
    const [ commentText, setCommentText ] = useState("");
    const [loading, setLoading] = useState(false);
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
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={addComment} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Write Your Comment</label>
                <input  
                    id="comment" 
                    type="text" 
                    value={commentText} 
                    onChange={handleChange} 
                    placeholder="Type something fun or deep..."
                    className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                />
                <button type="submit" disabled={loading || commentText.trim() === ""} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition">
                    {loading ? <Spinner /> :"Post Your Comment"}
                </button>
            </div>
        </form>
    );
};

export default CreateComment;