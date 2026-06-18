import {createContext, useState} from "react";

export const ReadmeContext = createContext();

export const ReadmeProvider = ({children}) => {
    // const [readme, setReadme] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedMarkdown, setGeneratedMarkdown] = useState('');
    const [logs, setLogs] = useState([]);

    return (
        <ReadmeContext.Provider value = {{isGenerating, setIsGenerating, generatedMarkdown, setGeneratedMarkdown, logs, setLogs}}>
            {children}
        </ReadmeContext.Provider>
    )
};