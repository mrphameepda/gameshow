export interface CrosswordClue {
  id: number;
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
  row: number;
  col: number;
}

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
}

export function validateCrossword(clues: CrosswordClue[]): ValidationReport {
  const grid: { [key: string]: { char: string; clueId: number } } = {};
  const errors: string[] = [];

  // 1. Kiểm tra từng từ và các điểm giao nhau
  for (const clue of clues) {
    const word = clue.answer.trim().toUpperCase();
    for (let i = 0; i < word.length; i++) {
      const r = clue.direction === 'across' ? clue.row : clue.row + i;
      const c = clue.direction === 'across' ? clue.col + i : clue.col;
      const key = `${r},${c}`;
      const char = word[i];

      if (grid[key]) {
        if (grid[key].char !== char) {
          errors.push(
            `Xung đột ký tự tại (${r}, ${c}): Từ #${grid[key].clueId} có '${grid[key].char}', nhưng từ #${clue.id} ("${word}") có '${char}'!`
          );
        }
      } else {
        grid[key] = { char, clueId: clue.id };
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
