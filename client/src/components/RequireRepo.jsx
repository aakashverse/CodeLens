import { useNavigate } from "react-router";
import { useContext } from "react";
import { AiSessionContext } from "../context/ai-session.context";

export const RequireRepo = ({ children }) => {
  const { repoUrl } = useContext(AiSessionContext);
  const navigate = useNavigate();

  if (!repoUrl) {
    navigate("/github-connect")
  }

  return children;
};