import { useNavigate } from "react-router-dom";

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <button type="button"
      onClick={() => navigate(-1)}
      className="mb-4 px-4 py-2 bg-gray-200 border border-gray-400 rounded hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
    >
      ⬅️ Go Back
    </button>
  );
};

export default GoBackButton;
