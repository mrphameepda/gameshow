import { ALTP_QUESTIONS } from './questions/ai-la-trieu-phu/questions';
import { CHIEC_NON_QUESTIONS } from './questions/chiec-non/questions';
import { SAP_XEP_QUESTIONS } from './questions/sap-xep/questions';
import { rcvDefaultSet } from './questions/rung-chuong-vang/default-set';
import { vuiHocData } from './questions/vui-hoc-giao-ly/questions';

export type QuestionCategory = 'phung-vu' | 'kinh-thanh-cuu-uoc' | 'kinh-thanh-tan-uoc' | 'giao-ly-can-ban' | 'gioi-tre-xa-hoi' | 'tong-hop';
export type QuestionLevel = 'easy' | 'medium' | 'hard';

export interface QuestionItem {
    id: string;
    question: string;
    category: QuestionCategory;
    level: QuestionLevel;
    options?: string[];        // Dành cho trắc nghiệm
    correctIndex?: number;     // Vị trí đáp án đúng
    answerText?: string;       // Từ khóa cho ô chữ/câu hoàn chỉnh
    citation?: string;         // Trích dẫn câu (nếu có)
}

// Transform all questions into a single universal array
export const UNIVERSAL_QUESTIONS: QuestionItem[] = [];

// 1. ALTP
['easy', 'medium', 'hard'].forEach((levelStr) => {
    const level = levelStr as QuestionLevel;
    ALTP_QUESTIONS[level].forEach((q: any, i: number) => {
        UNIVERSAL_QUESTIONS.push({
            id: `altp_${level}_${i}`,
            question: q.q,
            category: 'tong-hop',
            level: level,
            options: q.a,
            correctIndex: q.c
        });
    });
});

// 2. Chiec Non (Crossword / fill in blanks)
CHIEC_NON_QUESTIONS.forEach((q: any, i: number) => {
    UNIVERSAL_QUESTIONS.push({
        id: `cnkd_${i}`,
        question: q.q,
        category: 'tong-hop',
        level: 'medium',
        answerText: q.a
    });
});

// 3. Sap Xep Kinh Thanh
['easy', 'medium', 'hard'].forEach((levelStr) => {
    const level = levelStr as QuestionLevel;
    SAP_XEP_QUESTIONS[level].forEach((q: any, i: number) => {
        UNIVERSAL_QUESTIONS.push({
            id: `sxkt_${level}_${i}`,
            question: q.q,
            category: 'kinh-thanh-tan-uoc',
            level: level,
            answerText: q.q,
            citation: q.c
        });
    });
});

// 4. Rung Chuong Vang
rcvDefaultSet.forEach((q: any, i: number) => {
    let level: QuestionLevel = 'medium';
    if (q.category === 'easy' || q.category === 'rescue') level = 'easy';
    if (q.category === 'hard' || q.category === 'final' || q.category === 'sos') level = 'hard';

    UNIVERSAL_QUESTIONS.push({
        id: q.id || `rcv_${i}`,
        question: q.q,
        category: 'tong-hop',
        level: level,
        options: q.options,
        correctIndex: q.options.findIndex((opt: string) => opt === q.correct),
        answerText: q.correct
    });
});

// 5. Vui Hoc Giao Ly
Object.keys(vuiHocData).forEach((cat: string) => {
    vuiHocData[cat as keyof typeof vuiHocData].forEach((q: any, i: number) => {
        UNIVERSAL_QUESTIONS.push({
            id: `vhgl_${cat}_${i}`,
            question: q.q,
            category: 'giao-ly-can-ban',
            level: 'easy',
            options: q.o,
            correctIndex: q.o.findIndex((opt: string) => opt === q.c),
            answerText: q.c
        });
    });
});

// Re-export original references to keep backward compatibility
export { ALTP_QUESTIONS, CHIEC_NON_QUESTIONS, SAP_XEP_QUESTIONS, rcvDefaultSet as rcvData, vuiHocData };
