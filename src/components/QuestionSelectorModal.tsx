import { useState } from 'react';
import { PRESET_PACKS, questionService } from '../services/questionService';
import type { QuestionItem, QuestionCategory, QuestionLevel } from '../data/questionBank';
import { BookOpen, Filter, CheckCircle, XCircle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onApply: (questions: QuestionItem[]) => void;
}

export default function QuestionSelectorModal({ isOpen, onClose, onApply }: Props) {
    const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
    const [selectedPresetId, setSelectedPresetId] = useState<string>('');
    
    // Custom state
    const [catFilter, setCatFilter] = useState<QuestionCategory | 'all'>('all');
    const [levelFilter, setLevelFilter] = useState<QuestionLevel | 'all'>('all');
    const [limit, setLimit] = useState<number>(15);

    if (!isOpen) return null;

    const handleApplyPreset = () => {
        if (!selectedPresetId) return;
        const qList = questionService.getQuestionsByPreset(selectedPresetId);
        onApply(qList);
        onClose();
    };

    const handleApplyCustom = () => {
        const qList = questionService.getQuestionsByFilter({
            category: catFilter,
            level: levelFilter,
            limit: limit
        });
        onApply(qList);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
                
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase flex items-center gap-2">
                        <BookOpen size={24} className="text-amber-400" />
                        Chọn Bộ Câu Hỏi
                    </h2>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-rose-500/80 rounded-full transition-colors text-slate-300 hover:text-white">
                        <XCircle size={24} />
                    </button>
                </div>

                {/* TABS */}
                <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl mb-6 shrink-0">
                    <button 
                        onClick={() => setActiveTab('preset')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'preset' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                    >
                        <BookOpen size={16} /> Bộ Có Sẵn
                    </button>
                    <button 
                        onClick={() => setActiveTab('custom')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'custom' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                    >
                        <Filter size={16} /> Lọc Tùy Chọn
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {activeTab === 'preset' ? (
                        <div className="space-y-3">
                            {PRESET_PACKS.map((pack: any) => (
                                <div 
                                    key={pack.id}
                                    onClick={() => setSelectedPresetId(pack.id)}
                                    className={`p-4 rounded-2xl cursor-pointer border transition-all ${selectedPresetId === pack.id ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-amber-300 text-lg">{pack.title}</div>
                                            <div className="text-sm text-slate-300 mt-1">{pack.description}</div>
                                        </div>
                                        <div className="bg-slate-950/50 text-amber-400 text-xs font-black px-3 py-1 rounded-full border border-amber-500/30">
                                            {pack.count} CÂU
                                        </div>
                                    </div>
                                    {selectedPresetId === pack.id && (
                                        <div className="mt-4 flex justify-end">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleApplyPreset(); }}
                                                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2 rounded-xl shadow-[0_5px_15px_rgba(245,158,11,0.3)] flex items-center gap-2"
                                            >
                                                <CheckCircle size={18} /> ÁP DỤNG NGAY
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Chủ Đề</label>
                                <select 
                                    value={catFilter} 
                                    onChange={(e) => setCatFilter(e.target.value as any)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-slate-200 outline-none focus:border-amber-500"
                                >
                                    <option value="all">Tất cả chủ đề</option>
                                    <option value="phung-vu">Phụng Vụ & Bí Tích</option>
                                    <option value="kinh-thanh-cuu-uoc">Kinh Thánh Cựu Ước</option>
                                    <option value="kinh-thanh-tan-uoc">Kinh Thánh Tân Ước</option>
                                    <option value="giao-ly-can-ban">Giáo Lý Căn Bản</option>
                                    <option value="gioi-tre-xa-hoi">Giới Trẻ & Xã Hội</option>
                                    <option value="tong-hop">Tổng Hợp</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Độ Khó</label>
                                <div className="flex gap-2">
                                    {['all', 'easy', 'medium', 'hard'].map(lvl => (
                                        <button
                                            key={lvl}
                                            onClick={() => setLevelFilter(lvl as any)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${levelFilter === lvl ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'}`}
                                        >
                                            {lvl === 'all' ? 'Tất Cả' : (lvl === 'easy' ? 'Dễ' : (lvl === 'medium' ? 'Vừa' : 'Khó'))}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Số lượng câu ({limit})</label>
                                <input 
                                    type="range" min="5" max="50" step="5"
                                    value={limit} onChange={(e) => setLimit(parseInt(e.target.value))}
                                    className="w-full accent-amber-500"
                                />
                            </div>

                            <button 
                                onClick={handleApplyCustom}
                                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl shadow-[0_5px_15px_rgba(245,158,11,0.3)] mt-4 flex justify-center items-center gap-2 uppercase"
                            >
                                <CheckCircle size={18} /> Chọn Lọc {limit} Câu
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
