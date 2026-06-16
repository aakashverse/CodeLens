const simpleGit = require('simple-git');
const fs = require('fs').promises;
const path = require('path');

// ignore before sending to llm
const IGNORED_DIRS = ['.git', 'node_modules', 'dist', 'build', '.next', 'public'];
const IGNORED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.mp4', '.pdf', '.zip'];

async function getFilteredFiles(dir) {
    let results = [];
    const list = await fs.readdir(dir, { withFileTypes: true });

    for (const file of list) {
        const fullPath = path.resolve(dir, file.name);
        
        if (file.isDirectory()) {
            if (!IGNORED_DIRS.includes(file.name)) {
                results = results.concat(await getFilteredFiles(fullPath));
            }
        } else {
            const ext = path.extname(file.name).toLowerCase();
            if (!IGNORED_EXTENSIONS.includes(ext)) {
                results.push(fullPath);
            }
        }
    }
    return results;
}

async function cloneAndExtract(repoUrl, repoName) {
    const targetDir = path.join(__dirname, '../temp_repos', repoName);

    try {
        // 1. Shallow clone (depth 1) is much faster and saves disk space
        console.log(`Cloning ${repoUrl}...`);
        await simpleGit().clone(repoUrl, targetDir, ['--depth', '1']);

        // 2. Walk the directory and get valid files
        console.log(`Extracting files...`);
        const filePaths = await getFilteredFiles(targetDir);

        return { targetDir, filePaths };

    } catch (error) {
        console.error("Error fetching repo:", error);
        throw error;
    }
}

module.exports = { cloneAndExtract };