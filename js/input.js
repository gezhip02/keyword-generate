// Default data
const defaultTopics = [
    { topic: "qr code", meaning: "二维码" },
    { topic: "name", meaning: "名字" },
    { topic: "logo", meaning: "标志" },
    { topic: "picture", meaning: "图片" },
    { topic: "video", meaning: "视频" }
];

const defaultRoots = [
    { root: "generator", meaning: "生成器" },
    { root: "creator", meaning: "创建器" },
    { root: "editor", meaning: "编辑器" },
    { root: "tool", meaning: "工具" },
    { root: "maker", meaning: "制作器" }
];

let currentTopics = [...defaultTopics];
let currentRoots = [...defaultRoots];

// Initialize tables
let topicsTable, rootsTable;

$(document).ready(function() {
    initializeTables();
    loadDefaultData();
    setupEventListeners();
});

function initializeTables() {
    const topicsColumns = [
        { data: 'topic' },
        { data: 'meaning' }
    ];

    const rootsColumns = [
        { data: 'root' },
        { data: 'meaning' }
    ];

    topicsTable = initializeDataTable('topicsTable', addNumberColumn(topicsColumns));
    rootsTable = initializeDataTable('rootsTable', addNumberColumn(rootsColumns));
}

function loadDefaultData() {
    // Try to load from storage first
    const storedTopics = loadFromStorage(STORAGE_KEYS.TOPICS);
    const storedRoots = loadFromStorage(STORAGE_KEYS.ROOTS);

    currentTopics = storedTopics || defaultTopics;
    currentRoots = storedRoots || defaultRoots;

    topicsTable.clear().rows.add(currentTopics).draw();
    rootsTable.clear().rows.add(currentRoots).draw();
}

function setupEventListeners() {
    // File input handler
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        // Update current data
        currentTopics = jsonData
            .filter(row => row.topic)
            .map(row => ({
                topic: row.topic.toString().trim(),
                meaning: row['主题词中文释义'] || ''
            }));

        currentRoots = jsonData
            .filter(row => row.roots)
            .map(row => ({
                root: row.roots.toString().trim(),
                meaning: row['词根中文释义'] || ''
            }));

        // Save to storage
        saveToStorage(STORAGE_KEYS.TOPICS, currentTopics);
        saveToStorage(STORAGE_KEYS.ROOTS, currentRoots);

        // Update tables
        topicsTable.clear().rows.add(currentTopics).draw();
        rootsTable.clear().rows.add(currentRoots).draw();
    };
    reader.readAsArrayBuffer(file);
}

function isValidCombination(topic, root) {
    if (topic.toLowerCase().includes(root.toLowerCase()) || 
        root.toLowerCase().includes(topic.toLowerCase())) {
        return false;
    }

    if (/[^a-zA-Z\s]/.test(topic + root)) {
        return false;
    }

    const commonRoots = ['generator', 'creator', 'editor', 'tool', 'maker'];
    if (commonRoots.includes(root.toLowerCase())) {
        return true;
    }

    return true;
}

function generateKeywords() {
    const topics = currentTopics.map(t => ({ word: t.topic, meaning: t.meaning }));
    const roots = currentRoots.map(r => ({ word: r.root, meaning: r.meaning }));
    
    generatedKeywords = [];
    for (const topic of topics) {
        for (const root of roots) {
            if (isValidCombination(topic.word, root.word)) {
                generatedKeywords.push({ 
                    keyword: `${topic.word} ${root.word}`.trim(),
                    translation: topic.meaning && root.meaning ? 
                        `${topic.meaning}${root.meaning}` : ''
                });
            }
        }
    }

    // Save generated keywords to storage
    saveToStorage(STORAGE_KEYS.KEYWORDS, generatedKeywords);

    // Redirect to keywords page
    window.location.href = 'keywords.html';
} 