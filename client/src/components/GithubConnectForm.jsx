import { useContext } from 'react';
import { useNavigate } from 'react-router';
import {useAiSession  } from '../hooks/useAi-session';
import { AiSessionContext } from '../context/ai-session.context';
import { checkRepoStatus } from "../services/ai-session.api";
import useToast from '../hooks/useToast';

const GithubConnectForm = () => {
  const { isLoading, setIsLoading, handleConnect } = useAiSession();
  const { repoUrl, setRepoUrl } = useContext(AiSessionContext);
  const {showSuccess, showError} = useToast();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!repoUrl?.trim()) return;
    setIsLoading(true);

    try {
      const res = await checkRepoStatus(repoUrl);

      const isIndexed = res?.isIndexed;
      const lastIndexed = res?.lastIndexed;

      console.log(isIndexed, lastIndexed);

      if (isIndexed) {
        setIsLoading(false);

        let dateStr = "unknown";

        if (isIndexed && !isNaN(new Date(lastIndexed).getTime())) {
          dateStr = new Date(lastIndexed).toLocaleString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        const wantsToReindex = window.confirm(
          `This repository was already indexed on ${dateStr}.\n\nClick OK to re-index or Cancel to use existing data.`
        );

        if (!wantsToReindex) {
          navigate("/dashboard", { replace: true });
          return;
        }

        setIsLoading(true);
      }

      await handleConnect(repoUrl);
      showSuccess("Repo Connected successfully")

      // replace avoids history stacking
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("Connection error:", err);
      showError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl bg-[#11151D] border border-gray-800/60 rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 w-full" />

        <div className="p-8">

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={isLoading}
              placeholder="https://github.com/username/repo"
              className="w-full bg-[#0A0D14] border border-gray-700 rounded-xl py-3.5 px-4 text-white"
              required
            />

            <button
              type="submit"
              disabled={isLoading || !repoUrl}
              className="w-full bg-blue-600 text-white py-3 rounded-xl"
            >
              {isLoading ? "Processing..." : "Connect & Analyze"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default GithubConnectForm;