const fs = require('fs');

function extractAndReplace(filePath, varRegex, newFile, exportName) {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(varRegex);
    if (!match) {
        console.log("Not found in " + filePath);
        return;
    }
    const dataBlock = match[0]; // Full const DATA = {...};
    
    // Create new file
    const newContent = `export const ${exportName} = ${match[1]};\n`;
    fs.mkdirSync(newFile.substring(0, newFile.lastIndexOf('/')), {recursive: true});
    fs.writeFileSync(newFile, newContent);
    
    // Replace in old file
    // Wait, the match might not include the final semicolon if it's missing.
    // Let's replace the EXACT match[0] with an import statement.
    // Wait, since we are moving it to questionBank, we don't need to replace with import if we are using the new file.
    // Let's just import it at the top and remove the block.
    
    let updatedContent = content.replace(dataBlock, '');
    
    // Insert import at the top (after other imports)
    const importStmt = `import { ${exportName} } from '../../data/questionBank';\n`;
    // Find last import
    const lastImportIndex = updatedContent.lastIndexOf('import ');
    const endOfLastImport = updatedContent.indexOf('\n', lastImportIndex) + 1;
    
    updatedContent = updatedContent.slice(0, endOfLastImport) + importStmt + updatedContent.slice(endOfLastImport);
    // Replace references to the old variable name with the new exportName
    const oldVarName = dataBlock.match(/const\s+(\w+)/)[1];
    if (oldVarName !== exportName) {
        // Regex replace all whole word instances
        const regex = new RegExp(`\\b${oldVarName}\\b`, 'g');
        updatedContent = updatedContent.replace(regex, exportName);
    }
    
    fs.writeFileSync(filePath, updatedContent);
    console.log("Processed " + filePath);
}

// ALTP
extractAndReplace(
    'f:/Gameshow/src/games/ai-la-trieu-phu/index.tsx',
    /const QUESTIONS = (\{[\s\S]*?\n\});/,
    'f:/Gameshow/src/data/questions/ai-la-trieu-phu/questions.ts',
    'ALTP_QUESTIONS'
);

// Chiec Non
extractAndReplace(
    'f:/Gameshow/src/games/chiec-non-ky-dieu/index.tsx',
    /const QUESTIONS = (\[[\s\S]*?\n\]);?/,
    'f:/Gameshow/src/data/questions/chiec-non/questions.ts',
    'CHIEC_NON_QUESTIONS'
);

// Sap Xep
extractAndReplace(
    'f:/Gameshow/src/games/sap-xep-kinh-thanh/index.tsx',
    /const DATA = (\{[\s\S]*?\n\});?/,
    'f:/Gameshow/src/data/questions/sap-xep/questions.ts',
    'SAP_XEP_QUESTIONS'
);

console.log("Done");
