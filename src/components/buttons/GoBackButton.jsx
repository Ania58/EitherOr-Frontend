import { useNavigate } from "react-router-dom";

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <button type="button"
      onClick={() => navigate(-1)}
      style={{
        marginBottom: "1rem",
        padding: "0.5rem 1rem",
        backgroundColor: "#eee",
        border: "1px solid #ccc",
        cursor: "pointer",
      }}
    >
      ⬅️ Go Back
    </button>
  );
};

export default GoBackButton;
