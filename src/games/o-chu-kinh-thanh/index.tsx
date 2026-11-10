import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Lightbulb, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import GuestSaveScorePopup from '@/components/GuestSaveScorePopup';
import { CROSSWORD_LEVELS } from '@/data/crosswordData';
import type { CrosswordClue, CrosswordLevel } from '@/data/crosswordData';
import confetti from 'canvas-confetti';

import { validateCrossword } from '@/utils/crosswordValidator';
import { sounds } from '@/utils/soundEffects';

interface CellData {
  row: number;
  col: number;
  isBlock: boolean;
  correctChar: string;
  number?: number;
  clues: CrosswordClue[];
}

export default function CrosswordGame() {
  const navigate = useNavigate();
  const { currentUser, saveUserScore } = useAuth();
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const level = CROSSWORD_LEVELS[currentLevelIndex];

  // Game State
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [selectedCol, setSelectedCol] = useState<number>(0);
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across');
  const [solvedClueIds, setSolvedClueIds] = useState<Set<number>>(new Set());
  const [wrongClueId, setWrongClueId] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(level?.timeLimit || 120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [hints, setHints] = useState(3);

  const timerRef = useRef<any>(null);

  // Audio setup (using existing memory sounds if they exist, or fallback)
  const winAudio = useRef(new Audio('/sounds/lat-hinh/win.mp3'));

  // Initialize Grid based on current level
  const baseGrid = useMemo(() => {
    if (!level) return [];
    const grid: CellData[][] = Array(level.gridRows).fill(null).map((_, r) =>
      Array(level.gridCols).fill(null).map((_, c) => ({
        row: r, col: c, isBlock: true, correctChar: '', clues: []
      }))
    );

    level.clues.forEach(clue => {
      // Find starting cell to assign number
      if (grid[clue.row] && grid[clue.row][clue.col]) {
         if (!grid[clue.row][clue.col].number) {
           grid[clue.row][clue.col].number = clue.number;
         }
      }
      for (let i = 0; i < clue.answer.length; i++) {
        let r = clue.direction === 'down' ? clue.row + i : clue.row;
        let c = clue.direction === 'across' ? clue.col + i : clue.col;
        if (r < level.gridRows && c < level.gridCols) {
          grid[r][c].isBlock = false;
          grid[r][c].correctChar = clue.answer[i];
          if (!grid[r][c].clues.find(c => c.id === clue.id)) {
             grid[r][c].clues.push(clue);
          }
        }
      }
    });
    return grid;
  }, [level]);

  useEffect(() => {
    if (level) {
      startLevel(level);
    }
  }, [level]);

  const startLevel = (lvl: CrosswordLevel) => {
    const validation = validateCrossword(lvl.clues);
    if (!validation.isValid) {
      console.error(`[LỖI Ô CHỮ] Màn ${lvl.id}:`, validation.errors);
    }

    const emptyUserGrid = Array(lvl.gridRows).fill(null).map(() => Array(lvl.gridCols).fill(''));
    setUserGrid(emptyUserGrid);
    setSolvedClueIds(new Set());
    setWrongClueId(null);
    setTimeLeft(lvl.timeLimit);
    setShowWinModal(false);
    setIsPlaying(true);
    setHints(3);
    
    // Find first available cell to select
    let firstClue = lvl.clues[0];
    if (firstClue) {
      setSelectedRow(firstClue.row);
      setSelectedCol(firstClue.col);
      setSelectedDirection(firstClue.direction);
    }
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0 && !showWinModal) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            alert("Hết giờ! Cố gắng nhanh hơn vào lần sau nhé.");
            // Reset level
            if (level) startLevel(level);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, timeLeft, showWinModal, level]);

  // Derived state: Active Clue based on selection
  const activeClue = useMemo(() => {
    if (!baseGrid[selectedRow]?.[selectedCol]) return null;
    const cellClues = baseGrid[selectedRow][selectedCol].clues;
    if (cellClues.length === 0) return null;
    
    // Try to match selected direction
    const matchDir = cellClues.find(c => c.direction === selectedDirection);
    if (matchDir) return matchDir;
    // Fallback to first clue
    return cellClues[0];
  }, [baseGrid, selectedRow, selectedCol, selectedDirection]);

  // Auto-switch direction if we click a cell that only belongs to the OTHER direction
  useEffect(() => {
    if (baseGrid[selectedRow]?.[selectedCol]) {
      const cellClues = baseGrid[selectedRow][selectedCol].clues;
      if (cellClues.length > 0 && !cellClues.find(c => c.direction === selectedDirection)) {
        setSelectedDirection(cellClues[0].direction);
      }
    }
  }, [selectedRow, selectedCol, baseGrid, selectedDirection]);

  // Removed checkWordCompletion

  const handleCharInput = (char: string) => {
    if (!isPlaying || showWinModal) return;
    if (baseGrid[selectedRow][selectedCol].isBlock) return;
    if (!activeClue) return;

    if (solvedClueIds.has(activeClue.id)) return; // Khóa từ đúng

    // Check if current cell belongs to *another* already solved clue
    const cellClues = baseGrid[selectedRow][selectedCol].clues;
    const isLockedByAnother = cellClues.some(c => c.id !== activeClue.id && solvedClueIds.has(c.id));
    
    const newGrid = [...userGrid];
    if (!isLockedByAnother) {
      newGrid[selectedRow] = [...newGrid[selectedRow]];
      newGrid[selectedRow][selectedCol] = char.toUpperCase();
      setUserGrid(newGrid);
    }

    // Check if ALL cells in activeClue are filled
    let allFilled = true;
    let userWord = '';
    for (let i = 0; i < activeClue.answer.length; i++) {
      let r = activeClue.direction === 'down' ? activeClue.row + i : activeClue.row;
      let c = activeClue.direction === 'across' ? activeClue.col + i : activeClue.col;
      const cellChar = newGrid[r][c];
      if (!cellChar) {
        allFilled = false;
        break;
      }
      userWord += cellChar;
    }

    if (!allFilled) {
      // Move to next empty cell
      moveCursor('forward', activeClue);
    } else {
      // Check correctness
      if (userWord === activeClue.answer.toUpperCase()) {
        sounds.playCorrect();
        const newSolved = new Set(solvedClueIds);
        newSolved.add(activeClue.id);
        setSolvedClueIds(newSolved);

        // Check Win Condition
        if (newSolved.size === level.clues.length) {
          handleWin(timeLeft);
        } else {
          // Auto jump to next unsolved clue after 300ms
          setTimeout(() => {
            const nextUnsolved = level.clues.find(c => !newSolved.has(c.id));
            if (nextUnsolved) {
              setSelectedRow(nextUnsolved.row);
              setSelectedCol(nextUnsolved.col);
              setSelectedDirection(nextUnsolved.direction);
            }
          }, 300);
        }
      } else {
        sounds.playWrong();
        setWrongClueId(activeClue.id);
        
        // After 500ms, clear wrong cells and remove red outline
        setTimeout(() => {
          setWrongClueId(null);
          setUserGrid(prevGrid => {
            const cleared = [...prevGrid];
            for (let i = 0; i < activeClue.answer.length; i++) {
              let r = activeClue.direction === 'down' ? activeClue.row + i : activeClue.row;
              let c = activeClue.direction === 'across' ? activeClue.col + i : activeClue.col;
              // Only clear if it's not locked by another correct word
              const clu = baseGrid[r][c].clues;
              const isLocked = clu.some(c => c.id !== activeClue.id && solvedClueIds.has(c.id));
              if (!isLocked) {
                cleared[r] = [...cleared[r]];
                cleared[r][c] = '';
              }
            }
            return cleared;
          });
          // Reset cursor to start of word
          setSelectedRow(activeClue.row);
          setSelectedCol(activeClue.col);
        }, 500);
      }
    }
  };

  const moveCursor = (dir: 'forward' | 'backward', contextClue: CrosswordClue | null) => {
    if (!contextClue) return;
    
    let r = selectedRow;
    let c = selectedCol;
    
    if (dir === 'forward') {
      if (contextClue.direction === 'across') c++;
      else r++;
    } else {
      if (contextClue.direction === 'across') c--;
      else r--;
    }

    // Check bounds and block
    if (r >= 0 && r < level.gridRows && c >= 0 && c < level.gridCols) {
      if (!baseGrid[r][c].isBlock) {
        setSelectedRow(r);
        setSelectedCol(c);
      }
    }
  };

  const handleBackspace = () => {
    if (!isPlaying || showWinModal) return;
    if (!activeClue) return;
    if (solvedClueIds.has(activeClue.id)) return;
    
    const cellClues = baseGrid[selectedRow][selectedCol].clues;
    const isLockedByAnother = cellClues.some(c => c.id !== activeClue.id && solvedClueIds.has(c.id));
    
    const newGrid = [...userGrid];
    if (newGrid[selectedRow][selectedCol] !== '' && !isLockedByAnother) {
      newGrid[selectedRow] = [...newGrid[selectedRow]];
      newGrid[selectedRow][selectedCol] = '';
      setUserGrid(newGrid);
      moveCursor('backward', activeClue);
    } else {
      // Move back and delete
      moveCursor('backward', activeClue);
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (baseGrid[r][c].isBlock) return;
    if (selectedRow === r && selectedCol === c) {
      // Toggle direction if clicking same cell and it has intersecting clues
      const cellClues = baseGrid[r][c].clues;
      if (cellClues.length > 1) {
        setSelectedDirection(prev => prev === 'across' ? 'down' : 'across');
      }
    } else {
      setSelectedRow(r);
      setSelectedCol(c);
    }
  };

  const handleWin = (timeRemaining: number) => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
    
    // Calculate score
    const baseScore = 100 + (level.tier * 10);
    const timeBonus = Math.min(50, Math.floor(timeRemaining / 2));
    const totalScore = baseScore + timeBonus;
    setFinalScore(totalScore);

    winAudio.current.play().catch(()=>{});
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setShowWinModal(true);

    if (currentUser) {
      saveUserScore('o-chu-cong-giao', 'Ô Chữ Công Giáo', totalScore);
    }
  };

  const nextLevel = () => {
    if (!currentUser) {
      setShowGuestPopup(true);
    } else {
      if (currentLevelIndex < CROSSWORD_LEVELS.length - 1) {
        setCurrentLevelIndex(prev => prev + 1);
      } else {
        alert("Chúc mừng bạn đã hoàn thành tất cả các màn chơi hiện tại!");
        navigate('/');
      }
    }
  };

  const onGuestPopupClose = () => {
    setShowGuestPopup(false);
    if (currentLevelIndex < CROSSWORD_LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      alert("Chúc mừng bạn đã hoàn thành tất cả các màn chơi hiện tại!");
      navigate('/');
    }
  };

  const prevClue = () => {
    if (!activeClue) return;
    const idx = level.clues.findIndex(c => c.id === activeClue.id);
    const newIdx = idx > 0 ? idx - 1 : level.clues.length - 1;
    const newClue = level.clues[newIdx];
    setSelectedRow(newClue.row);
    setSelectedCol(newClue.col);
    setSelectedDirection(newClue.direction);
  };

  const nextClue = () => {
    if (!activeClue) return;
    const idx = level.clues.findIndex(c => c.id === activeClue.id);
    const newIdx = idx < level.clues.length - 1 ? idx + 1 : 0;
    const newClue = level.clues[newIdx];
    setSelectedRow(newClue.row);
    setSelectedCol(newClue.col);
    setSelectedDirection(newClue.direction);
  };

  const useHint = () => {
    if (hints > 0 && activeClue) {
      setHints(h => h - 1);
      // Reveal the current selected cell's correct character
      const correct = baseGrid[selectedRow][selectedCol].correctChar;
      handleCharInput(correct);
    }
  };

  // Listen to physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key.match(/^[a-zA-Z]$/)) {
        handleCharInput(e.key);
      } else if (e.key === 'ArrowUp') {
        setSelectedRow(r => Math.max(0, r - 1));
      } else if (e.key === 'ArrowDown') {
        setSelectedRow(r => Math.min(level.gridRows - 1, r + 1));
      } else if (e.key === 'ArrowLeft') {
        setSelectedCol(c => Math.max(0, c - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedCol(c => Math.min(level.gridCols - 1, c + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRow, selectedCol, activeClue, isPlaying, showWinModal]);

  const KEYBOARD_ROWS = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M','⌫']
  ];

  if (!level) return <div className="text-white text-center p-10">Đang tải...</div>;

  return (
    <div className="min-h-screen h-[100dvh] w-full pt-16 sm:pt-20 flex flex-col justify-between overflow-hidden p-2 select-none relative z-0">
      {/* Nền Gradient tươi sáng & các đốm cực quang mềm */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0f274a] via-[#103a6c] to-[#0a1e38]" />
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-cyan-400/20 blur-[90px] pointer-events-none -z-10" />
      <div className="absolute bottom-[25%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-[100px] pointer-events-none -z-10" />

      {/* TẦNG 1: THANH ĐIỀU KHIỂN GAME (ĐƯA VỀ LẠI VỊ TRÍ NÀY) */}
      <div className="shrink-0 w-full max-w-md mx-auto pt-1 pb-1 z-10">
        <header className="flex justify-between items-center bg-slate-900/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-lg">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft className="text-white" size={20} />
          </button>
          
          <div className="text-center flex-1">
            <div className="text-xs text-amber-400 font-black uppercase tracking-wider">Cấp độ {level.tier} Sao</div>
            <h1 className="text-sm font-bold text-white leading-tight">{level.title}</h1>
          </div>
          
          <div className="flex gap-2 items-center">
            <div className="bg-white/10 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-cyan-300 border border-cyan-500/30">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <button onClick={useHint} className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center hover:bg-amber-500/30 transition-colors border border-amber-500/30 relative">
              <Lightbulb size={18} />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{hints}</span>
            </button>
          </div>
        </header>
      </div>

      {/* TẦNG 2: BÀN CỜ TRUNG TÂM (Tự động co giãn theo khoảng trống còn lại) */}
      <div className="flex-1 w-full min-h-0 flex items-center justify-center p-2 overflow-hidden z-10">
        <div 
          className="w-full max-w-[min(88vw,calc(100dvh-320px),360px)] aspect-square mx-auto grid gap-1.5 p-2 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl transition-transform duration-300 ease-out"
          style={{
            gridTemplateColumns: `repeat(${level.gridCols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${level.gridRows}, minmax(0, 1fr))`
          }}
        >
          {baseGrid.map((row, r) => (
            row.map((cell, c) => {
              if (cell.isBlock) {
                return <div key={`${r}-${c}`} className="w-full h-full invisible pointer-events-none select-none" aria-hidden="true"></div>;
              }

                const isSelected = r === selectedRow && c === selectedCol;
                
                // Highlight words that are part of the active clue
                const isHighlightedWord = activeClue && cell.clues.find(cl => cl.id === activeClue.id);
                
                // Check if all clues passing through this cell are completed
                const isCellCompleted = cell.clues.length > 0 && cell.clues.every(cl => solvedClueIds.has(cl.id));

                const isWordWrong = cell.clues.some(cl => cl.id === wrongClueId);

              let bgClass = "bg-white/95";
              let textClass = "text-slate-900 font-extrabold";
              let borderClass = "border border-slate-300 shadow-xs hover:bg-white";

              if (isWordWrong) {
                bgClass = "bg-rose-200 text-rose-800";
                borderClass = "border-2 border-rose-500 animate-crossword-shake";
                textClass = "text-rose-800 font-black";
              } else if (isSelected) {
                bgClass = "bg-amber-300";
                borderClass = "border-2 border-amber-500 ring-2 ring-amber-400 shadow-md scale-105 z-20";
                textClass = "text-slate-950 font-black";
              } else if (isHighlightedWord) {
                bgClass = "bg-sky-200";
                borderClass = "border-2 border-sky-400 z-10";
                textClass = "text-blue-950 font-black";
              } else if (isCellCompleted) {
                bgClass = "bg-emerald-100";
                borderClass = "border-2 border-emerald-400";
                textClass = "text-emerald-900 font-black cursor-default";
              }

              return (
                <div 
                  key={`${r}-${c}`} 
                  onClick={() => handleCellClick(r, c)}
                  className={`w-full h-full relative rounded-sm sm:rounded-md flex items-center justify-center text-sm sm:text-base md:text-xl cursor-pointer transition-all duration-150 ${bgClass} ${textClass} ${borderClass}`}
                >
                    {cell.number && (
                      <span className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 text-[8px] sm:text-[10px] leading-none text-slate-600 font-black pointer-events-none select-none">
                        {cell.number}
                      </span>
                    )}
                    <span className="leading-none uppercase mt-1 sm:mt-0">
                      {userGrid[r]?.[c]}
                    </span>
                  </div>
                );
              })
            ))}
          </div>
        </div>

      {/* TẦNG 3: THANH CÂU ĐỐ & BÀN PHÍM ẢO (Chiều cao cố định ở đáy) */}
      <div className="shrink-0 w-full max-w-md mx-auto flex flex-col gap-1.5 pb-2 z-10">
          
          {/* CLUE STRIP (LIQUID GLASS) */}
          <div className="bg-blue-900/80 backdrop-blur-xl border border-white/20 p-2.5 rounded-2xl flex items-center justify-between shadow-xl text-white">
            <button onClick={prevClue} className="w-10 h-10 flex shrink-0 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all">
              <ChevronLeft size={24} />
            </button>
            <div className="flex-1 px-3 text-center">
              <div className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-0.5">
                {activeClue?.number} {activeClue?.direction === 'across' ? 'NGANG' : 'DỌC'}
              </div>
              <div className="text-sm font-bold leading-snug line-clamp-2">
                {activeClue?.clue || "Chọn một ô chữ"}
              </div>
            </div>
            <button onClick={nextClue} className="w-10 h-10 flex shrink-0 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* CUSTOM KEYBOARD */}
          <div className="flex flex-col gap-1.5 pb-2">
            {KEYBOARD_ROWS.map((row, i) => (
              <div key={i} className="flex justify-center gap-1.5 w-full">
                {row.map((key, j) => {
                  const isBackspace = key === '⌫';
                  return (
                    <button
                      key={j}
                      onClick={() => isBackspace ? handleBackspace() : handleCharInput(key)}
                      className={`
                        h-12 flex items-center justify-center rounded-xl font-bold text-lg md:text-xl
                        bg-slate-700/80 text-white shadow-[0_4px_0_rgb(51,65,85)] 
                        active:shadow-none active:translate-y-1 transition-all
                        border border-white/10
                        ${isBackspace ? 'flex-1 max-w-[80px] bg-rose-900/80 shadow-[0_4px_0_rgb(136,19,55)] border-rose-500/30' : 'flex-1 max-w-[45px]'}
                      `}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

        </div>

      {/* WIN MODAL GLASSMORPHISM */}
      {showWinModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-6 shadow-2xl flex flex-col items-center text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center border-4 border-amber-400 mb-4 shadow-[0_0_30px_rgba(251,191,36,0.4)]">
              <CheckCircle2 className="text-amber-400" size={40} />
            </div>
            
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 mb-2 uppercase">
              HOÀN THÀNH!
            </h2>
            
            <div className="text-slate-300 mb-6">
              Bạn nhận được <strong className="text-amber-400 text-xl">{finalScore}</strong> điểm.
            </div>

            <div className="w-full bg-slate-800/80 rounded-2xl p-4 mb-6 border border-white/10">
              <div className="text-xs text-amber-500 font-bold uppercase mb-1">Từ Khóa:</div>
              <div className="text-2xl font-black text-white tracking-widest mb-3">{level.keyword}</div>
              {level.holyQuote && (
                <div className="text-sm text-slate-300 italic px-2">
                  {level.holyQuote}
                </div>
              )}
            </div>

            <button 
              onClick={nextLevel}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-xl shadow-[0_8px_30px_rgba(16,185,129,0.3)] text-lg uppercase transition-transform hover:scale-105"
            >
              MÀN TIẾP THEO
            </button>
          </div>
        </div>
      )}

      {showGuestPopup && (
        <GuestSaveScorePopup
          score={finalScore}
          gameId="o-chu-cong-giao"
          gameName="Ô Chữ Công Giáo"
          onClose={onGuestPopupClose}
        />
      )}
      
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}
