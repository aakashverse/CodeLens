import { useContext } from "react";
import { AnalyzePR } from "../api/pr";
import { PrAnalyzerContext } from "../context/pr.context";
import useToast from "./useToast";

export const usePr = () => {
    const context = useContext(PrAnalyzerContext);
    const {prUrl, setLoading, setAnalysis, setError} = context;
    const {showError} = useToast();

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!prUrl.trim()) return;

        setLoading(true);
        setError('');
        setAnalysis(null);

        try {
          const data = await AnalyzePR(prUrl);

          if(data.error) {
            throw new Error(data.error);
          }

          setAnalysis(data.answer);
        } catch (err) {
          console.error(err);
          setError(err.message);
          showError("Please check your API KEY Validity");
        } finally {
          setLoading(false);
        }
    }

    return {
      handleAnalyze
    }
}
