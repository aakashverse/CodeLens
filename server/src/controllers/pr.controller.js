const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { PromptTemplate } = require("@langchain/core/prompts");
const { getVectorStore } = require("../utils/vectorStore"); 

async function analyzePR(req, res) {
    const { prUrl } = req.body;

    if (!prUrl) {
        return res.status(400).json({ error: "Pull Request URL is required." });
    }

    const match = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    if (!match) {
        return res.status(400).json({ error: "Invalid GitHub PR URL. Format: https://github.com/owner/repo/pull/123" });
    }

    const [, owner, repo, prNumber] = match;
    const repoName = repo; // For MongoDB preFiltering

    try {
        // 2. Fetch the raw diff from GitHub API
        const githubResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
            headers: {
                'Accept': 'application/vnd.github.v3.diff',
            }
        });

        if (!githubResponse.ok) {
            throw new Error(`GitHub API error: ${githubResponse.statusText}`);
        }

        const diffText = await githubResponse.text();

        if (diffText.length > 50000) {
            return res.status(400).json({ error: "This PR is too large to analyze automatically." });
        }

        const changedFiles = [...new Set(
            (diffText.match(/(?<=^\+\+\+ b\/).*$/gm) || [])
        )];

        const prompt = PromptTemplate.fromTemplate(`
            You are CodeLens AI, an expert engineering manager. 
            Review this Git Diff and the surrounding codebase context in concise manner. 
            
            Focus on the "Blast Radius": Determine if the changes in the Diff will break or affect other parts of the system provided in the Context.

            CRITICAL INSTRUCTIONS: Respond ONLY with a valid JSON object.

            Expected JSON Schema:
            {{
              "tldr": "1-2 sentence high-level summary of the PR.",
              "keyChanges": ["Array of 3-4 strings explaining functional changes."],
              "blastRadius": ["Array of strings highlighting files or systems from the context that might break or need updating because of this PR. E.g., 'Modifying auth.js affects the login route.'"],
              "localTesting": "A string of bash commands a reviewer can copy-paste to test this PR locally."
            }}

            Changed Files: {changedFiles}
            
            Codebase Context (How these files are used):
            {context}

            Git Diff (The proposed changes):
            {diff}
        `);

        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey: process.env.GOOGLE_API_KEY,
            temperature: 0.1,
            modelKwargs: { 
                responseMimeType: "application/json" 
            }
        });

        // Connect to vector store for the RAG Blast Radius Context
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            model: "gemini-embedding-001",
        });

        const vectorStore = await getVectorStore(embeddings);
        const combineDocsChain = await createStuffDocumentsChain({ llm: model, prompt }); 

        const retriever = vectorStore.asRetriever({
            k: 3,
            filter: {
                preFilter:{ 
                    "repoName": { $eq: repoName } 
                }
            }
        });

        const query = changedFiles.join(" ");
        const retrievedDocs = await retriever.invoke(String(query));

        const chainInput = {
            input: String(query),
            context: retrievedDocs,
            changedFiles: changedFiles.join(", "),
            diff: diffText
        };

        const response = await combineDocsChain.invoke(chainInput);

        let parsedData;
        try {
            parsedData = JSON.parse(response);
        } catch (e) {
            throw new Error("AI returned invalid JSON.");
        }

        return res.status(200).json({
            answer: parsedData 
        })

    } catch (error) {
        console.error("PR Analysis Error:", error);
        return res.status(500).json({ error: error.message || "Failed to analyze Pull Request." });
    }
}

module.exports = {
    analyzePR
};