import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Volume2, Shuffle, GraduationCap, PlayCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const VOCAB_DATA = [
  { en: "oxygen", vn: "khí ô-xi", hint: "💨" },
  { en: "roots", vn: "rễ cây", hint: "🌱" },
  { en: "stem", vn: "thân cây", hint: "🌿" },
  { en: "leaves", vn: "lá cây", hint: "🍃" },
  { en: "flower", vn: "hoa", hint: "🌸" },
  { en: "planting", vn: "trồng cây", hint: "🪴" },
  { en: "watering", vn: "tưới nước", hint: "💧" },
  { en: "picking up", vn: "nhặt lên", hint: "🧺" },
  { en: "bin", vn: "thùng rác", hint: "🗑️" },
  { en: "recycle", vn: "tái chế", hint: "♻️" },
  { en: "trash", vn: "rác (Mỹ)", hint: "📦" },
  { en: "rubbish", vn: "rác (Anh)", hint: "🗑️" },
  { en: "garbage", vn: "rác", hint: "🚛" },
  { en: "litter", vn: "xả rác", hint: "🚯" },
  { en: "binoculars", vn: "ống nhòm", hint: "🔭" },
  { en: "straw", vn: "ống hút", hint: "🥤" }
];

const VocabGame = ({ onBackToHome }) => {
  const [mode, setMode] = useState('menu');
  const [words, setWords] = useState([...VOCAB_DATA]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardSide, setCardSide] = useState(0);

  // Practice State
  const [shuffledEN, setShuffledEN] = useState([]);
  const [shuffledVN, setShuffledVN] = useState([]);
  const [selections, setSelections] = useState({ en: null, vn: null });
  const [connections, setConnections] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);

  // Audio Context for synthesized sounds
  const audioCtx = useRef(null);

  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const playSuccessSound = () => {
    initAudio();
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, audioCtx.current.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.current.currentTime + 0.1); // A5
    
    gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.3);
  };

  const playErrorSound = () => {
    initAudio();
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.current.currentTime);
    osc.frequency.linearRampToValueAtTime(50, audioCtx.current.currentTime + 0.2); // Low "pẹt" sound
    
    gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.2);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const shuffleWords = () => {
    const newWords = [...words].sort(() => Math.random() - 0.5);
    setWords(newWords);
    setCurrentIndex(0);
    setCardSide(0);
  };

  const startPractice = () => {
    const subSet = [...VOCAB_DATA].sort(() => Math.random() - 0.5).slice(0, 6);
    setShuffledEN(subSet.map((w, i) => ({ ...w, id: i })).sort(() => Math.random() - 0.5));
    setShuffledVN(subSet.map((w, i) => ({ ...w, id: i })).sort(() => Math.random() - 0.5));
    setConnections([]);
    setSelections({ en: null, vn: null });
    setGameFinished(false);
    setMode('practice');
  };

  const handleSelect = (type, item) => {
    if (gameFinished) return;
    initAudio();

    // Phát âm khi chọn từ tiếng Anh
    if (type === 'en') {
      speak(item.en);
    }
    
    if (connections.find(c => c.isCorrect && (type === 'en' ? c.enId === item.id : c.vnId === item.id))) return;

    const newSelections = { ...selections, [type]: item };
    setSelections(newSelections);

    if (newSelections.en && newSelections.vn) {
      const isCorrect = newSelections.en.id === newSelections.vn.id;
      const newConn = { enId: newSelections.en.id, vnId: newSelections.vn.id, isCorrect };
      
      setConnections(prev => [...prev, newConn]);
      
      if (isCorrect) {
        playSuccessSound();
      } else {
        playErrorSound();
        setTimeout(() => {
          setConnections(prev => prev.filter(c => c !== newConn));
        }, 1000);
      }

      setSelections({ en: null, vn: null });
    }
  };

  useEffect(() => {
    const correctCount = connections.filter(c => c.isCorrect).length;
    if (correctCount > 0 && correctCount === shuffledEN.length) {
      setGameFinished(true);
    }
  }, [connections, shuffledEN]);

  const MainMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-6">
      <div className="absolute top-6 left-6">
        <button 
          onClick={onBackToHome}
          className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
      </div>
      <h1 className="text-4xl font-bold text-orange-600 mb-8 text-center">Bé Học Tiếng Anh 🌟</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
        <button 
          onClick={() => { setMode('study'); shuffleWords(); }}
          className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg border-b-8 border-blue-200 hover:translate-y-1 transition-all"
        >
          <GraduationCap size={64} className="text-blue-500 mb-4" />
          <span className="text-xl font-bold text-blue-600">Học Tập</span>
        </button>
        <button 
          onClick={startPractice}
          className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg border-b-8 border-green-200 hover:translate-y-1 transition-all"
        >
          <PlayCircle size={64} className="text-green-500 mb-4" />
          <span className="text-xl font-bold text-green-600">Luyện Tập</span>
        </button>
      </div>
    </div>
  );

  const StudyMode = () => (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 p-4">
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <button onClick={() => setMode('menu')} className="p-2 bg-white rounded-full shadow"><ChevronLeft /></button>
        <div className="text-lg font-bold text-blue-800">Từ {currentIndex + 1} / {words.length}</div>
        <button onClick={shuffleWords} className="p-2 bg-white rounded-full shadow text-orange-500"><Shuffle size={20} /></button>
      </div>

      <div 
        onClick={() => setCardSide((prev) => (prev + 1) % 3)}
        className="w-full max-w-sm aspect-[3/4] bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 cursor-pointer transition-all active:scale-95 border-b-8 border-blue-100 relative overflow-hidden"
      >
        <div className="absolute top-4 right-4 text-xs font-bold text-gray-300 uppercase tracking-widest">
          {cardSide === 0 ? "English" : cardSide === 1 ? "Hint" : "Tiếng Việt"}
        </div>

        {cardSide === 0 && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-5xl font-black text-blue-600 mb-6 text-center">{words[currentIndex].en}</h2>
            <button 
              onClick={(e) => { e.stopPropagation(); speak(words[currentIndex].en); }}
              className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
            >
              <Volume2 size={32} />
            </button>
          </div>
        )}

        {cardSide === 1 && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <span className="text-[120px]">{words[currentIndex].hint}</span>
          </div>
        )}

        {cardSide === 2 && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-4xl font-bold text-green-600 text-center">{words[currentIndex].vn}</h2>
          </div>
        )}

        <div className="absolute bottom-8 text-gray-400 text-sm font-medium">Bấm để lật thẻ</div>
      </div>

      <div className="flex gap-4 mt-8 w-full max-w-sm">
        <button 
          disabled={currentIndex === 0}
          onClick={() => { setCurrentIndex(p => p - 1); setCardSide(0); }}
          className={`flex-1 p-4 rounded-2xl font-bold text-white transition-all shadow-lg ${currentIndex === 0 ? 'bg-gray-300' : 'bg-orange-400 hover:bg-orange-500'}`}
        >
          Trước đó
        </button>
        <button 
          onClick={() => { 
            if (currentIndex < words.length - 1) {
              setCurrentIndex(p => p + 1); setCardSide(0); 
            } else {
              setMode('menu');
            }
          }}
          className="flex-1 p-4 bg-green-500 hover:bg-green-600 rounded-2xl font-bold text-white shadow-lg transition-all"
        >
          {currentIndex < words.length - 1 ? "Tiếp theo" : "Xong rồi!"}
        </button>
      </div>
    </div>
  );

  const PracticeMode = () => (
    <div className="flex flex-col items-center min-h-screen bg-green-50 p-4 overflow-hidden">
      <div className="w-full max-w-2xl flex justify-between items-center mb-4">
        <button onClick={() => setMode('menu')} className="p-2 bg-white rounded-full shadow"><ChevronLeft /></button>
        <h2 className="text-xl font-bold text-green-800">Nối các từ đúng nhé!</h2>
        <button onClick={startPractice} className="p-2 bg-white rounded-full shadow text-green-500"><RefreshCw size={20} /></button>
      </div>

      {gameFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center shadow-2xl animate-in zoom-in duration-500 max-w-sm w-full border-b-8 border-green-200">
            <span className="text-8xl mb-4">🎉</span>
            <h3 className="text-3xl font-black text-orange-500 mb-2 text-center">XUẤT SẮC LUÔN!</h3>
            <p className="text-gray-600 text-center mb-6 font-medium">Bé đã hoàn thành thử thách cực giỏi! Thưởng cho bé một tràng pháo tay nào! 👏</p>
            <button 
              onClick={startPractice}
              className="w-full py-4 bg-green-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              Chơi Tiếp Nhé!
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 md:gap-16 w-full max-w-2xl relative mt-8">
        {/* EN Column */}
        <div className="flex flex-col gap-4">
          {shuffledEN.map((item) => {
            const isCorrect = connections.some(c => c.enId === item.id && c.isCorrect);
            const isSelected = selections.en?.id === item.id;
            const isError = connections.some(c => c.enId === item.id && !c.isCorrect);
            return (
              <button
                key={`en-${item.id}`}
                onClick={() => handleSelect('en', item)}
                className={`p-4 rounded-xl font-bold text-lg shadow-sm border-2 transition-all h-16
                  ${isCorrect ? 'bg-green-100 border-green-500 text-green-700' : 
                    isError ? 'bg-red-100 border-red-500 text-red-700 animate-shake' :
                    isSelected ? 'bg-blue-100 border-blue-500 text-blue-700 scale-105 ring-4 ring-blue-200' : 'bg-white border-gray-100 hover:border-blue-300'}`}
              >
                {item.en}
              </button>
            );
          })}
        </div>

        {/* VN Column */}
        <div className="flex flex-col gap-4">
          {shuffledVN.map((item) => {
            const isCorrect = connections.some(c => c.vnId === item.id && c.isCorrect);
            const isSelected = selections.vn?.id === item.id;
            const isError = connections.some(c => c.vnId === item.id && !c.isCorrect);
            return (
              <button
                key={`vn-${item.id}`}
                onClick={() => handleSelect('vn', item)}
                className={`p-4 rounded-xl font-bold text-lg shadow-sm border-2 transition-all h-16
                  ${isCorrect ? 'bg-green-100 border-green-500 text-green-700' : 
                    isError ? 'bg-red-100 border-red-500 text-red-700 animate-shake' :
                    isSelected ? 'bg-blue-100 border-blue-500 text-blue-700 scale-105 ring-4 ring-blue-200' : 'bg-white border-gray-100 hover:border-blue-300'}`}
              >
                {item.vn}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="mt-12 text-center text-gray-500 italic max-w-xs">
        {connections.some(c => !c.isCorrect) && <span className="text-red-500 font-bold animate-bounce block mb-2">Oops! Thử lại nào bé ơi! 🙊</span>}
        <p>Bấm chọn 1 từ tiếng Anh rồi chọn nghĩa tiếng Việt tương ứng nha!</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
      `}} />
    </div>
  );

  return (
    <div className="font-sans selection:bg-orange-200">
      {mode === 'menu' && <MainMenu />}
      {mode === 'study' && <StudyMode />}
      {mode === 'practice' && <PracticeMode />}
    </div>
  );
};

export default VocabGame;