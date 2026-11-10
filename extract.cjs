const fs = require('fs');

const altpPath = 'f:/Gameshow/src/games/ai-la-trieu-phu/index.tsx';
const altpContent = fs.readFileSync(altpPath, 'utf8');
const altpMatch = altpContent.match(/const QUESTIONS = (\{[\s\S]*?\});\n\n/);
const altpQs = altpMatch ? altpMatch[1] : '{}';

const chiecNonPath = 'f:/Gameshow/src/games/chiec-non-ky-dieu/index.tsx';
const chiecNonContent = fs.readFileSync(chiecNonPath, 'utf8');
const chiecNonMatch = chiecNonContent.match(/const QUESTIONS = (\[[\s\S]*?\]);\n/);
const chiecNonQs = chiecNonMatch ? chiecNonMatch[1] : '[]';

const sapXepPath = 'f:/Gameshow/src/games/sap-xep-kinh-thanh/index.tsx';
const sapXepContent = fs.readFileSync(sapXepPath, 'utf8');
const sapXepMatch = sapXepContent.match(/const DATA = (\{[\s\S]*?\});\n/);
const sapXepQs = sapXepMatch ? sapXepMatch[1] : '{}';

const rcvPath = 'f:/Gameshow/src/data/questions/rung-chuong-vang/default-set.ts';
const rcvContent = fs.readFileSync(rcvPath, 'utf8');

const vuiHocPath = 'f:/Gameshow/src/data/questions/vui-hoc-giao-ly/questions.ts';
const vuiHocContent = fs.readFileSync(vuiHocPath, 'utf8');

let out = `export interface QuestionItem {
    id: string;
    question: string;
    category: 'phung-vu' | 'kinh-thanh-cuu-uoc' | 'kinh-thanh-tan-uoc' | 'giao-ly-can-ban' | 'gioi-tre-xa-hoi' | 'tong-hop';
    level: 'easy' | 'medium' | 'hard';
    options?: string[];        // Dành cho trắc nghiệm
    correctIndex?: number;     // Vị trí đáp án đúng
    answerText?: string;       // Từ khóa cho ô chữ/câu hoàn chỉnh
    citation?: string;         // Trích dẫn câu (nếu có)
}

// ---------------------------
// RAW DATA EXTRACTED
// ---------------------------
export const ALTP_QUESTIONS = ${altpQs};

export const CHIEC_NON_QUESTIONS = ${chiecNonQs};

export const SAP_XEP_QUESTIONS = ${sapXepQs};

`;

fs.writeFileSync('f:/Gameshow/src/data/questionBank.ts', out);
console.log('Done!');
