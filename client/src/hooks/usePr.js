import { useContext } from "react";
import { AnalyzePR } from "../services/pr";
import { PrAnalyzerContext } from "../context/pr.context";

export const usePr = () => {
    const context = useContext(PrAnalyzerContext);
    const {prUrl, setLoading, setAnalysis, setError} = context;

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
        } finally {
          setLoading(false);
        }
    }

    return {
      handleAnalyze
    }
}
