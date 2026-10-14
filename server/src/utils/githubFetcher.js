const simpleGit = require('simple-git');
const fs = require('fs').promises;
const path = require('path');

// Directories to ignore during indexing
const IGNORED_DIRS = [
    '.git', '.vscode', '.idea', '.github', 'node_modules', 'dist', 'build',
    '.next', 'public', 'vendor', 'coverage', '.cache', '__pycache__',
    'bin', 'obj', 'out', 'target', '.turbo', 'temp_repos'
];

// Specific files to ignore
const IGNORED_FILES = [
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'vite.config.js',
    'eslint.config.js', '.DS_Store', 'thumbs.db'
];

// File extensions to ignore (binaries, media, fonts, bundles, archives)
const IGNORED_EXTENSIONS = [
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.mp4', '.pdf', '.zip',
    '.tar', '.gz', '.7z', '.exe', '.dll', '.so', '.dylib', '.o', '.obj',
    '.a', '.lib', '.class', '.jar', '.pyc', '.wasm', '.min.js', '.min.css',
    '.map', '.woff', '.woff2', '.ttf', '.eot'
];

const MAX_FILE_SIZE = 250 * 1024; // 250 KB
const MAX_TOTAL_FILES = 300;

async function getFilteredFiles(dir) {
    let results = [];
    const list = await fs.readdir(dir, { withFileTypes: true });

    for (const file of list) {
        if (results.length >= MAX_TOTAL_FILES) break;

        const fullPath = path.resolve(dir, file.name);

        if (file.isDirectory()) {
            if (!IGNORED_DIRS.includes(file.name) && !file.name.startsWith('.')) {
                const subFiles = await getFilteredFiles(fullPath);
                results = results.concat(subFiles);
                if (results.length >= MAX_TOTAL_FILES) {
                    results = results.slice(0, MAX_TOTAL_FILES);
                    break;
                }
            }
        } else {
            const ext = path.extname(file.name).toLowerCase();
            if (!IGNORED_EXTENSIONS.includes(ext) && !IGNORED_FILES.includes(file.name)) {
                try {
                    const stat = await fs.stat(fullPath);
                    if (stat.size <= MAX_FILE_SIZE && stat.size > 0) {
                        results.push(fullPath);
                    }
                } catch (e) {
                    // skip unreadable file
                }
            }
        }
    }
    return results;
}

async function cloneAndExtract(repoUrl, repoName) {
    const targetDir = path.join(__dirname, '../temp_repos', repoName);

    try {
        // Clean up targetDir if it already exists from a previous run
        await fs.rm(targetDir, { recursive: true, force: true });

        // 1. Shallow clone (depth 1) is fast and saves disk space
        console.log(`Cloning ${repoUrl}...`);
        await simpleGit().clone(repoUrl, targetDir, ['--depth', '1']);

        // 2. Walk the directory and get valid code files
        console.log(`Extracting files...`);
        const filePaths = await getFilteredFiles(targetDir);

        return { targetDir, filePaths };

    } catch (error) {
        console.error("Error fetching repo:", error);
        throw error;
    }
}

module.exports = { cloneAndExtract };