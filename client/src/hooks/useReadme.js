import {useContext} from "react";
import { generateReadme } from "../services/readme.api";
import {ReadmeContext} from "../context/readme.context";
import { WorkspaceContext } from "../context/workspace.context";

export const useReadme = () => {
    const context = useContext(ReadmeContext);
    const {setIsGenerating, setGeneratedMarkdown, setLogs} = context;
    const { repoUrl } = useContext(WorkspaceContext);
    
    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedMarkdown('');
        setLogs(['> Initializing README generation sequence...', '> Analyzing repository structure...', '> Extracting core components and dependencies...']);

        try{
            const data = await generateReadme(repoUrl);
            setLogs(prev => [...prev, '> AI Drafting markdown...', '> Finalizing documentation...']);
            
            setGeneratedMarkdown(data.answer);
            // setReadme('readme');
        } catch(err){
            console.error(err);    
            setGeneratedMarkdown('### Error\nFailed to generate README. Make sure your repository is fully indexed.');
        } finally {
            setIsGenerating(false);
        }
    };

    
    return {
        handleGenerate
    }
};