import { UNIVERSAL_QUESTIONS, ALTP_QUESTIONS, CHIEC_NON_QUESTIONS, SAP_XEP_QUESTIONS, rcvData } from '../data/questionBank';
import type { QuestionItem, QuestionCategory, QuestionLevel } from '../data/questionBank';

export interface PresetPack {
    id: string;
    title: string;
    description: string;
    filter: (q: QuestionItem) => boolean;
    count: number;
}

export const PRESET_PACKS: PresetPack[] = [
    {
        id: 'preset_phung_vu',
        title: 'Bộ Phụng Vụ Thánh Lễ & Bí Tích',
        description: 'Các câu hỏi chuyên sâu về Phụng Vụ, Thánh Lễ và 7 Bí Tích.',
        filter: (q) => q.question.toLowerCase().includes('thánh lễ') || q.question.toLowerCase().includes('bí tích') || q.question.toLowerCase().includes('phụng vụ'),
        count: 20
    },
    {
        id: 'preset_tan_uoc',
        title: 'Bộ Tân Ước & Cuộc Đời Chúa Giêsu',
        description: 'Tập trung vào cuộc đời, lời dạy và phép lạ của Chúa Giêsu.',
        filter: (q) => q.category === 'kinh-thanh-tan-uoc' || q.question.toLowerCase().includes('giêsu'),
        count: 20
    },
    {
        id: 'preset_cuu_uoc',
        title: 'Bộ Cựu Ước & Các Tiên Tri',
        description: 'Những nhân vật, sự kiện lớn trong thời Cựu Ước.',
        filter: (q) => q.category === 'kinh-thanh-cuu-uoc' || q.question.toLowerCase().includes('mô-sê') || q.question.toLowerCase().includes('áp-ra-ham'),
        count: 15
    },
    {
        id: 'preset_thi_dau_nhanh',
        title: 'Bộ 15 Câu Thi Đấu Nhanh',
        description: 'Cấu trúc chuẩn: 5 Dễ - 5 Vừa - 5 Khó từ nhiều chủ đề.',
        filter: () => true, // Phân loại logic trong hàm lấy
        count: 15
    },
    {
        id: 'preset_thieu_nhi',
        title: 'Bộ Sinh Hoạt Thiếu Nhi Vui Tươi',
        description: 'Câu hỏi cơ bản, dễ hiểu, phù hợp cho các em Thiếu Nhi.',
        filter: (q) => q.level === 'easy' && (q.category === 'giao-ly-can-ban' || q.category === 'tong-hop'),
        count: 20
    }
];

export const questionService = {
    getAllQuestions() {
        return UNIVERSAL_QUESTIONS;
    },

    getQuestionsByPreset(presetId: string): QuestionItem[] {
        const preset = PRESET_PACKS.find(p => p.id === presetId);
        if (!preset) return [];

        let filtered = UNIVERSAL_QUESTIONS.filter(preset.filter);
        // Xáo trộn
        filtered.sort(() => Math.random() - 0.5);

        if (presetId === 'preset_thi_dau_nhanh') {
            const easy = UNIVERSAL_QUESTIONS.filter(q => q.level === 'easy').sort(() => Math.random() - 0.5).slice(0, 5);
            const medium = UNIVERSAL_QUESTIONS.filter(q => q.level === 'medium').sort(() => Math.random() - 0.5).slice(0, 5);
            const hard = UNIVERSAL_QUESTIONS.filter(q => q.level === 'hard').sort(() => Math.random() - 0.5).slice(0, 5);
            return [...easy, ...medium, ...hard];
        }

        return filtered.slice(0, preset.count);
    },

    getQuestionsByFilter(filter: { category?: QuestionCategory | 'all', level?: QuestionLevel | 'all', limit: number }): QuestionItem[] {
        let pool = UNIVERSAL_QUESTIONS;
        if (filter.category && filter.category !== 'all') {
            pool = pool.filter(q => q.category === filter.category);
        }
        if (filter.level && filter.level !== 'all') {
            pool = pool.filter(q => q.level === filter.level);
        }
        pool.sort(() => Math.random() - 0.5);
        return pool.slice(0, filter.limit);
    },

    // Hàm chuyển đổi dữ liệu gốc phù hợp với format của mỗi Game.
    // Nếu customList undefined, trả về fallback của Game đó.
    getQuestionsForGame(gameId: string, customList?: QuestionItem[]): any {
        switch (gameId) {
            case 'ai-la-trieu-phu':
                if (!customList || customList.length === 0) {
                    return ALTP_QUESTIONS; // Fallback
                }
                const easy = customList.filter(q => q.level === 'easy').map(q => ({ q: q.question, a: q.options || [], c: q.correctIndex || 0 }));
                const medium = customList.filter(q => q.level === 'medium').map(q => ({ q: q.question, a: q.options || [], c: q.correctIndex || 0 }));
                const hard = customList.filter(q => q.level === 'hard').map(q => ({ q: q.question, a: q.options || [], c: q.correctIndex || 0 }));
                return { easy, medium, hard };

            case 'chiec-non-ky-dieu':
                if (!customList || customList.length === 0) {
                    return CHIEC_NON_QUESTIONS;
                }
                return customList.map(q => ({
                    q: q.question,
                    a: q.answerText || q.question.split(' ').slice(0, 2).join(' ') // Dummy answer if undefined
                }));

            case 'sap-xep-kinh-thanh':
                if (!customList || customList.length === 0) {
                    return SAP_XEP_QUESTIONS;
                }
                return {
                    easy: customList.filter(q=>q.level==='easy').map(q=>({ q: q.question, c: q.citation || '' })),
                    medium: customList.filter(q=>q.level==='medium').map(q=>({ q: q.question, c: q.citation || '' })),
                    hard: customList.filter(q=>q.level==='hard').map(q=>({ q: q.question, c: q.citation || '' })),
                };

            case 'rung-chuong-vang':
                if (!customList || customList.length === 0) {
                    return rcvData;
                }
                // Tách làm 3 vòng
                return [
                    { round: 1, title: 'Khởi Động', questions: customList.slice(0, Math.ceil(customList.length/3)).map(q=>({ q: q.question, o: q.options||[], c: (q.options && q.correctIndex !== undefined) ? q.options[q.correctIndex] : '' })) },
                    { round: 2, title: 'Tăng Tốc', questions: customList.slice(Math.ceil(customList.length/3), Math.ceil(customList.length*2/3)).map(q=>({ q: q.question, o: q.options||[], c: (q.options && q.correctIndex !== undefined) ? q.options[q.correctIndex] : '' })) },
                    { round: 3, title: 'Về Đích', questions: customList.slice(Math.ceil(customList.length*2/3)).map(q=>({ q: q.question, o: q.options||[], c: (q.options && q.correctIndex !== undefined) ? q.options[q.correctIndex] : '' })) },
                ];
                
            default:
                return customList || [];
        }
    }
};
