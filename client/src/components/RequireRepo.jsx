import GithubConnectForm from "./GithubConnectForm";
import { useContext } from "react";
import { WorkspaceContext } from "../context/workspace.context";

export const RequireRepo = ({ children }) => {
  const { repoUrl } = useContext(WorkspaceContext);

  if (!repoUrl) {
    return <GithubConnectForm />;
  }

  return children;
};