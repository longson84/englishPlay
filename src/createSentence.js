import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, XCircle, Volume2, Trash2, 
  Star, Sparkles, Languages, X, HelpCircle, Shuffle, GripVertical, Music
} from 'lucide-react';

const subjects = [
  { id: 'i', en: "I", vi: "Con", be: "am", icon: "👶", type: 'subject' },
  { id: 'he', en: "He", vi: "Cậu ấy", be: "is", icon: "👦", type: 'subject' },
  { id: 'she', en: "She", vi: "Cô ấy", be: "is", icon: "👧", type: 'subject' },
  { id: 'you', en: "You", vi: "Bạn", be: "are", icon: "🧒", type: 'subject' },
  { id: 'they', en: "They", vi: "Các bạn", be: "are", icon: "👫", type: 'subject' },
];

const beVerbs = [
  { en: "am", type: 'be' },
  { en: "is", type: 'be' },
  { en: "are", type: 'be' }
];

const actions = [
  { en: "reading", vi: "đang đọc", emoji: "📖", type: 'action' },
  { en: "walking", vi: "đang đi bộ", emoji: "🚶", type: 'action' },
  { en: "writing", vi: "đang viết", emoji: "✍️", type: 'action' },
  { en: "playing", vi: "đang chơi", emoji: "⚽", type: 'action' },
  { en: "eating", vi: "đang ăn", emoji: "🍎", type: 'action' },
  { en: "planting", vi: "đang trồng", emoji: "🌱", type: 'action' },
  { en: "watering", vi: "đang tưới", emoji: "💧", type: 'action' },
  { en: "picking up", vi: "đang nhặt", emoji: "🖐️", type: 'action' },
  { en: "drawing", vi: "đang vẽ", emoji: "🎨", type: 'action' },
  { en: "singing", vi: "đang hát", emoji: "🎤", type: 'action' },
];

const nouns = [
  { en: "a book", vi: "quyển sách", emoji: "📚", type: 'noun' },
  { en: "a song", vi: "bài hát", emoji: "🎵", type: 'noun' },
  { en: "the tree", vi: "cái cây", emoji: "🌳", type: 'noun' },
  { en: "flowers", vi: "hoa", emoji: "🌸", type: 'noun' },
  { en: "trash", vi: "rác", emoji: "🗑️", type: 'noun' },
  { en: "a picture", vi: "bức tranh", emoji: "🖼️", type: 'noun' },
  { en: "an apple", vi: "quả táo", emoji: "🍎", type: 'noun' },
  { en: "football", vi: "đá bóng", emoji: "⚽", type: 'noun' },
];

const punctuations = [
  { en: ".", type: 'punc' },
  { en: "?", type: 'punc' }
];

// Thành phần hiệu ứng pháo hoa
const FireworksOverlay = ({ active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#ee82ee', '#ffffff', '#38bdf8', '#fb7185'];

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.opacity = 1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.05; // trọng lực
        this.opacity -= 0.01;
      }
      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const createFirework = (x, y) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    let timer = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (timer % 20 === 0) {
        createFirework(Math.random() * canvas.width, Math.random() * (canvas.height * 0.6));
      }
      timer++;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].opacity <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [active]);

  if (!active) return null;
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[100]" 
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

const App = ({ onBackToHome }) => {
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [columnOrder, setColumnOrder] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showFireworks, setShowFireworks] = useState(false);

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const categories = [
    { id: 'sub', title: "Ai thế nhỉ?", color: "border-yellow-400 bg-yellow-50", items: subjects, type: 'subject' },
    { id: 'be', title: "Cây cầu nào?", color: "border-pink-400 bg-pink-50", items: beVerbs, type: 'be' },
    { id: 'not', title: "Có KHÔNG?", color: "border-rose-400 bg-rose-50", items: [{ en: 'not', type: 'not' }], type: 'not' },
    { id: 'act', title: "Làm gì?", color: "border-blue-400 bg-blue-50", items: actions, type: 'action', isScroll: true },
    { id: 'noun', title: "Cái gì?", color: "border-orange-400 bg-orange-50", items: nouns, type: 'noun', isScroll: true },
    { id: 'punc', title: "Dấu câu", color: "border-emerald-400 bg-emerald-50", items: punctuations, type: 'punc' }
  ];

  useEffect(() => {
    setColumnOrder(shuffleArray(categories));
  }, []);

  const playSound = (type) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'success') {
      const notes = [
        { freq: 261.63, time: 0 },   // C4
        { freq: 329.63, time: 0.15 }, // E4
        { freq: 392.00, time: 0.3 },  // G4
        { freq: 523.25, time: 0.45 }, // C5
        { freq: 659.25, time: 0.60 }, // E5
        { freq: 783.99, time: 0.75 }, // G5
        { freq: 1046.50, time: 0.90 }, // C6
      ];

      notes.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
        gain.gain.setValueAtTime(0, ctx.currentTime + note.time);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + note.time + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + note.time + 0.3);
        osc.start(ctx.currentTime + note.time);
        osc.stop(ctx.currentTime + note.time + 0.35);
      });
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  };

  const addToken = (token) => {
    setSelectedTokens([...selectedTokens, { ...token, instanceId: Math.random() }]);
    setFeedback(null);
    setShowFireworks(false);
  };

  const removeToken = (instanceId) => {
    setSelectedTokens(selectedTokens.filter(t => t.instanceId !== instanceId));
    setFeedback(null);
    setShowFireworks(false);
  };

  const handleDragStart = (index) => setDraggedIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newTokens = [...selectedTokens];
    const draggedItem = newTokens[draggedIndex];
    newTokens.splice(draggedIndex, 1);
    newTokens.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setSelectedTokens(newTokens);
  };

  const handleDragEnd = () => setDraggedIndex(null);

  const reset = () => {
    setSelectedTokens([]);
    setFeedback(null);
    setShowFireworks(false);
    setColumnOrder(shuffleArray(categories));
  };

  const checkSentence = () => {
    if (selectedTokens.length === 0) return;

    const lastToken = selectedTokens[selectedTokens.length - 1];
    if (lastToken.type !== 'punc') {
      playSound('fail');
      setFeedback({ status: 'error', message: "Bé ơi, cuối câu phải có dấu chấm '.' hoặc dấu hỏi '?' nhé!" });
      return;
    }

    const isQuestion = lastToken.en === "?";
    const sub = selectedTokens.find(t => t.type === 'subject');
    const be = selectedTokens.find(t => t.type === 'be');
    const act = selectedTokens.find(t => t.type === 'action');
    const not = selectedTokens.find(t => t.type === 'not');
    const noun = selectedTokens.find(t => t.type === 'noun');

    if (!sub || !be || !act) {
      playSound('fail');
      setFeedback({ status: 'error', message: "Bé cần chọn đủ: Nhân vật, Cây cầu và Hành động nhé!" });
      return;
    }

    if (sub.be !== be.en.toLowerCase()) {
      playSound('fail');
      setFeedback({ status: 'error', message: `Nhầm rồi! ${sub.en} phải đi với cầu "${sub.be}" cơ!` });
      return;
    }

    if (!isQuestion && lastToken.en !== ".") {
        playSound('fail');
        setFeedback({ status: 'error', message: "Câu này bé đang kể mà, hãy dùng dấu chấm '.' nhé!" });
        return;
    }

    if (isQuestion) {
      if (selectedTokens[0].type !== 'be') {
        playSound('fail');
        setFeedback({ status: 'error', message: "Câu hỏi thì Cây cầu (Am/Is/Are) phải đứng đầu tiên!" });
        return;
      }
    } else {
      if (selectedTokens[0].type !== 'subject') {
        playSound('fail');
        setFeedback({ status: 'error', message: "Bé hãy đưa Nhân vật lên đầu câu nhé!" });
        return;
      }
    }

    if (noun) {
        const nounIdx = selectedTokens.findIndex(t => t.instanceId === noun.instanceId);
        const actIdx = selectedTokens.findIndex(t => t.type === 'action');
        if (nounIdx < actIdx) {
            playSound('fail');
            setFeedback({ status: 'error', message: 'Hành động phải đứng trước Đồ vật nhé!' });
            return;
        }
    }

    playSound('success');
    setShowFireworks(true);
    setFeedback({ status: 'success', message: "Tuyệt đỉnh! Bé ghép câu quá siêu luôn!" });
    
    const fullText = selectedTokens.map(t => t.en).join(' ').replace(/\s([.?])/g, '$1');
    setTimeout(() => {
      speak(fullText);
    }, 500);

    // Tắt pháo hoa sau 5 giây
    setTimeout(() => {
      setShowFireworks(false);
    }, 6000);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 font-sans text-slate-800 select-none overflow-x-hidden">
      
      {/* Hiệu ứng pháo hoa */}
      <FireworksOverlay active={showFireworks} />

      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 bg-white p-4 rounded-3xl shadow-sm border-2 border-indigo-100 relative z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBackToHome} className="p-2 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
          </button>
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
            <Music size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-indigo-600 italic uppercase tracking-tight">Siêu Nhân Ghép Chữ 🚀</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kéo các thẻ màu để sắp xếp thứ tự câu nhé!</p>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-6 py-2 bg-rose-50 text-rose-500 rounded-xl font-black hover:bg-rose-100 transition-all border border-rose-100">
          <Trash2 size={20} /> LÀM LẠI
        </button>
      </div>

      {/* 6 CỘT TỪ VỰNG */}
      <div className="w-full max-w-7xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8 relative z-10">
        {columnOrder.map((col) => (
          <div key={col.id} className={`p-3 rounded-2xl border-2 bg-white shadow-sm flex flex-col gap-2 ${col.color} transition-all duration-700`}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase text-center mb-1">{col.title}</h4>
            <div className={col.isScroll ? "h-40 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-2" : "flex flex-col gap-2"}>
              {col.items.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => addToken(item)}
                  className="w-full py-2 px-2 rounded-xl border-2 border-slate-100 bg-white font-black text-xs transition-all flex items-center justify-center gap-2 active:scale-90 hover:border-indigo-300 shadow-sm"
                >
                  {(item.icon || item.emoji) && <span className="text-sm">{item.icon || item.emoji}</span>}
                  {item.en}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* VÙNG LẮP GHÉP */}
      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-[60px] p-10 shadow-2xl border-4 border-dashed border-indigo-200 relative min-h-[320px] flex flex-col items-center justify-between">
          <h3 className="absolute -top-4 left-10 bg-indigo-600 text-white px-6 py-1 rounded-full text-xs font-black shadow-lg uppercase tracking-wider">Hành lang lắp ghép</h3>
          
          <div className="flex flex-wrap justify-center items-center gap-3 w-full py-8">
            {selectedTokens.length === 0 ? (
              <div className="text-slate-300 flex flex-col items-center gap-4 opacity-50">
                <HelpCircle size={64} strokeWidth={1} />
                <p className="font-bold italic text-lg text-center">Bé hãy bấm các mảnh ghép ở trên<br/>để xây dựng câu nhé!</p>
              </div>
            ) : (
              selectedTokens.map((token, index) => (
                <div 
                  key={token.instanceId} 
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    group relative flex items-center gap-2 px-5 py-3 rounded-2xl border-b-8 font-black text-xl shadow-lg cursor-grab active:cursor-grabbing transition-all
                    ${draggedIndex === index ? 'opacity-20 scale-90' : 'opacity-100'}
                    ${token.type === 'subject' ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : ''}
                    ${token.type === 'be' ? 'bg-pink-100 border-pink-400 text-pink-800' : ''}
                    ${token.type === 'action' ? 'bg-blue-100 border-blue-400 text-blue-800' : ''}
                    ${token.type === 'noun' ? 'bg-orange-100 border-orange-400 text-orange-800' : ''}
                    ${token.type === 'not' ? 'bg-rose-100 border-rose-400 text-rose-800' : ''}
                    ${token.type === 'punc' ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : ''}
                  `}
                >
                  <GripVertical size={16} className="text-black/10 group-hover:text-black/40" />
                  {(token.icon || token.emoji) && <span>{token.icon || token.emoji}</span>}
                  {token.en}
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeToken(token.instanceId); }}
                    className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={14} strokeWidth={4} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="w-full flex flex-col items-center gap-6 mt-4">
            <button 
              onClick={checkSentence}
              disabled={selectedTokens.length === 0}
              className={`
                px-20 py-6 rounded-full font-black text-2xl flex items-center gap-3 transition-all
                ${selectedTokens.length === 0 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white shadow-[0_10px_0_0_rgba(49,46,129,1)] hover:translate-y-1 hover:shadow-[0_6px_0_0_rgba(49,46,129,1)] active:translate-y-2 active:shadow-none'}
              `}
            >
              <CheckCircle size={28} /> KIỂM TRA NGAY!
            </button>

            {feedback && (
              <div className={`w-full max-w-2xl p-6 rounded-[32px] border-4 animate-in bounce-in duration-500 flex items-center gap-6 ${feedback.status === 'success' ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xl shadow-emerald-200' : 'bg-rose-50 border-rose-400 text-rose-900 shadow-xl shadow-rose-200'}`}>
                <div className="flex-shrink-0">
                    {feedback.status === 'success' 
                        ? <div className="text-6xl animate-bounce">🎉</div> 
                        : <div className="text-6xl animate-pulse">🙊</div>}
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-black leading-tight mb-2">{feedback.message}</p>
                  {feedback.status === 'success' && (
                    <div className="flex items-center gap-2 bg-white/60 p-3 rounded-2xl border border-emerald-200">
                      <Languages className="text-emerald-600" size={20} />
                      <p className="font-bold text-lg italic tracking-tight">
                        Dịch là: {selectedTokens.map(t => t.vi || "").filter(v => v).join(" ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-in.bounce-in { animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default App;