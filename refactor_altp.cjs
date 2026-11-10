const fs = require('fs');

const filePath = 'f:/Gameshow/src/games/ai-la-trieu-phu/index.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const match = content.match(/const QUESTIONS = (\{[\s\S]*?\]\n\});?\n/);
if (match) {
    const dataBlock = match[0];
    const exportName = 'ALTP_QUESTIONS';
    
    const newContent = `export const ${exportName} = ${match[1]};\n`;
    fs.mkdirSync('f:/Gameshow/src/data/questions/ai-la-trieu-phu', {recursive: true});
    fs.writeFileSync('f:/Gameshow/src/data/questions/ai-la-trieu-phu/questions.ts', newContent);
    
    let updatedContent = content.replace(dataBlock, '');
    const importStmt = `import { ${exportName} } from '../../data/questionBank';\n`;
    
    const lastImportIndex = updatedContent.lastIndexOf('import ');
    const endOfLastImport = updatedContent.indexOf('\n', lastImportIndex) + 1;
    updatedContent = updatedContent.slice(0, endOfLastImport) + importStmt + updatedContent.slice(endOfLastImport);
    
    const oldVarName = 'QUESTIONS';
    const regex = new RegExp(`\\b${oldVarName}\\b`, 'g');
    updatedContent = updatedContent.replace(regex, exportName);
    
    fs.writeFileSync(filePath, updatedContent);
    console.log("ALTP done");
} else {
    console.log("Still no match");
}
