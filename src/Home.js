import React from 'react';
import { BookOpen, Puzzle, Star, Gamepad2, ArrowRight, Trophy } from 'lucide-react';

const Home = ({ onSelectGame }) => {
  const games = [
    {
      id: 'vocab',
      title: "Học Từ",
      description: "Học từ vựng với flashcard và nối từ",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverColor: "hover:from-blue-600 hover:to-cyan-600"
    },
    {
      id: 'sentence',
      title: "Ghép Chữ",
      description: "Ghép câu tiếng Anh với các từ",
      icon: Puzzle,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      hoverColor: "hover:from-purple-600 hover:to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-3xl shadow-lg">
            <Trophy size={48} className="text-white" />
          </div>
        </div>
        <h1 className="text-6xl font-black bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent mb-4">
          Bé Học Tiếng Anh
        </h1>
        <p className="text-xl text-gray-600 font-medium">Chọn trò chơi để bắt đầu học nhé! 🌟</p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {games.map((game, index) => {
          const IconComponent = game.icon;
          return (
            <div
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className={`
                relative overflow-hidden rounded-3xl p-8 cursor-pointer transform transition-all duration-300
                ${game.bgColor} ${game.borderColor} border-4
                hover:scale-105 hover:shadow-2xl hover:shadow-${game.color.split(' ')[0].split('-')[1]}-200
                active:scale-95
              `}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4">
                  <IconComponent size={120} className="text-gray-300" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`bg-gradient-to-r ${game.color} p-4 rounded-2xl shadow-lg`}>
                    <IconComponent size={32} className="text-white" />
                  </div>
                  <ArrowRight size={24} className="text-gray-400" />
                </div>

                <h3 className="text-3xl font-black text-gray-800 mb-3">
                  {game.title}
                </h3>
                
                <p className="text-gray-600 font-medium text-lg mb-6">
                  {game.description}
                </p>

                {/* Progress indicator */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${game.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.random() * 40 + 20}%` }}
                    />
                  </div>
                  <Star size={16} className="text-yellow-500" />
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${game.color} opacity-0 hover:opacity-10 transition-opacity duration-300`} />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Gamepad2 size={20} />
          <p className="font-medium">Nhiều trò chơi thú vị đang chờ bé!</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>

      <script>{`
        // Add animation classes dynamically
        document.querySelectorAll('[style*="animation-delay"]').forEach(el => {
          el.classList.add('animate-fade-in-up');
        });
      `}</script>
    </div>
  );
};

export default Home;