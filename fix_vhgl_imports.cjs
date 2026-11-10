const fs = require('fs');
const file = 'f:/Gameshow/src/games/vui-hoc-giao-ly/index.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace("import { useState, useEffect, useRef } from 'react'\nimport { useState, useEffect, useRef } from 'react'", "import { useState, useEffect, useRef } from 'react'");
fs.writeFileSync(file, content);
