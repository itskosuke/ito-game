import React, { useState, useEffect } from 'react';
import { Shuffle, ArrowRight, RotateCcw, Home, Check, X } from 'lucide-react';

const TOPICS = [
  { main: "コンビニの商品の人気", min: "人気ない", max: "人気ある" },
  { main: "おにぎりの具の人気", min: "人気ない", max: "人気ある" },
  { main: "ハネムーンで行きたい場所の人気", min: "人気ない", max: "人気ある" },
  { main: "居酒屋メニューの人気", min: "人気ない", max: "人気ある" },
  { main: "酒のつまみの人気", min: "人気ない", max: "人気ある" },
  { main: "旅行したい国や場所の人気", min: "人気ない", max: "人気ある" },
  { main: "旅行に持っていきたいもの", min: "いらない", max: "持っていきたい" },
  { main: "ゾンビと戦うときに持っていきたいもの", min: "いらない", max: "持っていたい" },
  { main: "無人島に持っていきたいもの", min: "いらない", max: "持っていきたい" },
  { main: "食べ物のカロリー", min: "低カロリー", max: "高カロリー" },
  { main: "雪山で遭難したときにもっていたいもの", min: "いらない", max: "持っていたい" },
  { main: "地球観光に来た宇宙人にあげたいお土産", min: "あげたくない", max: "あげたい" },
  { main: "テンションが上がるもの・こと", min: "上がらない", max: "上がる" },
  { main: "ほしい特殊能力", min: "いらない", max: "ほしい" },
  { main: "白米に合いそうなもの", min: "合わない", max: "合う" },
  { main: "桃太郎になって考えよう 頼りになる家来", min: "頼りにならない", max: "頼りになる" },
  { main: "動物園にいる動物の人気", min: "人気ない", max: "人気ある" },
  { main: "商店街のくじの景品でランクが高いもの", min: "低い", max: "高い" },
  { main: "「一生これしか食べられない」なら選びたい食べもの", min: "選びたくない", max: "選びたい" },
  { main: "コンビニで買える食べ物の人気", min: "人気ない", max: "人気ある" },
  { main: "公園の石をどかしたとき、あったらビックリするもの", min: "少しビックリ", max: "超ビックリ" },
  { main: "寿司ネタの人気", min: "人気ない", max: "人気ある" },
  { main: "冷蔵庫の中にあったらテンションが上がるもの", min: "上がらない", max: "上がる" },
  { main: "学校の先生に怒られそうなこと", min: "怒られない", max: "怒られる" },
  { main: "魔法使いになって考えよう 使ってみたい魔法", min: "使いたくない", max: "使ってみたい" },
  { main: "馬主になって考えよう 速そうな馬の名前", min: "速くなさそう", max: "速そう" },
  { main: "砂漠で遭難したときにほしいもの", min: "いらない", max: "ほしい" },
  { main: "おみやげにもらったら嬉しいもの", min: "嬉しくない", max: "嬉しい" },
  { main: "朝ごはんに食べたいもの", min: "食べたくない", max: "食べたい" },
  { main: "あったらおいしそうなアイスクリームの味", min: "おいしくなさそう", max: "おいしそう" },
  { main: "魔王になって考えよう こんな勇者はイヤだ", min: "余裕", max: "イヤだ" },
  { main: "武器にしたら強そうな日用品", min: "弱そう", max: "強そう" },
  { main: "メーカー（ブランド）の人気", min: "人気ない", max: "人気ある" },
  { main: "上に乗ってみたい動物", min: "乗りたくない", max: "乗りたい" },
  { main: "5歳児が言ったらビックリする言葉", min: "少しビックリ", max: "超ビックリ" },
  { main: "タイムマシンで行ってみたい時代と場所", min: "少し行きたい", max: "超行きたい" },
];

const ItoGame = () => {
  const [phase, setPhase] = useState('splash');
  const [playerCount, setPlayerCount] = useState(2);
  const [cardsPerPlayer, setCardsPerPlayer] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerNames, setPlayerNames] = useState([]);
  const [topic, setTopic] = useState(null);
  const [customTopic, setCustomTopic] = useState('');
  const [isRandomTopic, setIsRandomTopic] = useState(true);
  const [numbers, setNumbers] = useState([]);
  const [usedNumbers, setUsedNumbers] = useState([]);
  const [currentDistributeIndex, setCurrentDistributeIndex] = useState(0);
  const [showNumber, setShowNumber] = useState(false);
  const [showNumberConfirm, setShowNumberConfirm] = useState(false);
  const [expressionOrder, setExpressionOrder] = useState([]);
  const [expressions, setExpressions] = useState([]);
  const [currentExpression, setCurrentExpression] = useState('');
  const [arrangedCards, setArrangedCards] = useState([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [movedCardIndices, setMovedCardIndices] = useState([]);
  const [cardRevealEffect, setCardRevealEffect] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [showMyNumber, setShowMyNumber] = useState(false);

  const selectRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * TOPICS.length);
    setTopic(TOPICS[randomIndex]);
  };

  useEffect(() => {
    if (isRandomTopic && !topic) {
      selectRandomTopic();
    }
  }, []);

  useEffect(() => {
    if (phase === 'reveal' && revealedCount === 0) {
      setTimeout(() => {
        const containers = document.querySelectorAll('[data-scroll-container]');
        containers.forEach(container => {
          container.scrollTop = container.scrollHeight;
        });
      }, 100);
    }
  }, [phase, revealedCount]);

  const startGame = () => {
    const finalNames = Array.from({ length: playerCount }).map((_, idx) => {
      const name = playerNames[idx];
      return (name && name.trim()) ? name.trim() : `プレイヤー${idx + 1}`;
    });
    
    const uniqueNames = new Set(finalNames.map(name => name.toLowerCase()));
    if (uniqueNames.size !== finalNames.length) {
      setConfirmDialog({
        message: '同じプレイヤー名は登録できません。',
        onConfirm: () => setConfirmDialog(null),
        onCancel: null
      });
      return;
    }
    
    if (!isRandomTopic && !customTopic.trim()) {
      setConfirmDialog({
        message: 'お題を入力してください。',
        onConfirm: () => setConfirmDialog(null),
        onCancel: null
      });
      return;
    }

    setPlayerNames(finalNames);
    if (!isRandomTopic) {
      setTopic({ main: customTopic, min: "1", max: "100" });
    }

    // 先に順番を決める
    const indices = Array.from({ length: playerCount }, (_, i) => i);
    const shuffledOrder = indices.sort(() => Math.random() - 0.5);
    setExpressionOrder(shuffledOrder);
    setExpressions([]);
    setCurrentRound(1);
    setUsedNumbers([]); // usedNumbersをリセット
    
    setPhase('orderDecided');
  };

  const startDistribution = () => {
    // 順番に従って数字を配布（既に使用した数字を除外）
    const allNumbers = Array.from({ length: 100 }, (_, i) => i + 1);
    const availableNumbers = allNumbers.filter(n => !usedNumbers.includes(n));
    const shuffled = availableNumbers.sort(() => Math.random() - 0.5);
    const selectedNumbers = shuffled.slice(0, playerCount);
    
    setNumbers(selectedNumbers);
    setUsedNumbers([...usedNumbers, ...selectedNumbers]);
    setPhase('distribute');
    setCurrentDistributeIndex(0);
  };

  const submitExpression = () => {
    if (!currentExpression.trim()) {
      setConfirmDialog({
        message: '例えを入力してください。',
        onConfirm: () => setConfirmDialog(null),
        onCancel: null
      });
      return;
    }

    const isDuplicate = expressions.some(exp => 
      exp.expression.trim().toLowerCase() === currentExpression.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      setConfirmDialog({
        message: '同じ例えが登録されています。',
        onConfirm: () => setConfirmDialog(null),
        onCancel: null
      });
      return;
    }

    const playerIndex = expressionOrder[currentDistributeIndex];
    const newExpressions = [...expressions, {
      playerIndex,
      playerName: playerNames[playerIndex],
      expression: currentExpression,
      number: numbers[playerIndex],
      round: currentRound
    }];
    setExpressions(newExpressions);
    
    setCurrentExpression('');
    
    // 次のプレイヤーへ
    if (currentDistributeIndex < playerCount - 1) {
      // まだ全員が終わってない場合：次のプレイヤーのdistributeフェーズへ
      setCurrentDistributeIndex(currentDistributeIndex + 1);
      setPhase('distribute');
    } else {
      // 全員が終わった場合
      if (cardsPerPlayer >= 2 && currentRound < cardsPerPlayer) {
        // 複数枚モードで次のラウンドへ（新しい数字を配布）
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        
        // 既に使用した数字を除外して新しい数字を配布
        const allNumbers = Array.from({ length: 100 }, (_, i) => i + 1);
        const availableNumbers = allNumbers.filter(n => !usedNumbers.includes(n));
        const shuffled = availableNumbers.sort(() => Math.random() - 0.5);
        const selectedNumbers = shuffled.slice(0, playerCount);
        
        setNumbers(selectedNumbers);
        setUsedNumbers([...usedNumbers, ...selectedNumbers]);
        setCurrentDistributeIndex(0);
        setPhase('distribute');
      } else {
        // カード並び替えフェーズへ
        setArrangedCards(newExpressions);
        setPhase('arrange');
      }
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    
    const newCards = [...arrangedCards];
    const draggedCard = newCards[draggedIndex];
    newCards.splice(draggedIndex, 1);
    newCards.splice(targetIndex, 0, draggedCard);
    
    setArrangedCards(newCards);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const moveCard = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === arrangedCards.length - 1) return;
    
    const newCards = [...arrangedCards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newCards[index], newCards[targetIndex]] = [newCards[targetIndex], newCards[index]];
    setArrangedCards(newCards);
    
    // 入れ替わった両方のカードを一時的にハイライト
    setMovedCardIndices([index, targetIndex]);
    setTimeout(() => setMovedCardIndices([]), 500);
  };

  const movePlayerOrder = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === expressionOrder.length - 1) return;
    
    const newOrder = [...expressionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setExpressionOrder(newOrder);
    
    // 入れ替わった両方の順番を一時的にハイライト
    setMovedCardIndices([index, targetIndex]);
    setTimeout(() => setMovedCardIndices([]), 500);
  };

  const confirmArrangement = () => {
    setConfirmDialog({
      message: 'この順番で良いですか？',
      onConfirm: () => {
        setConfirmDialog(null);
        setPhase('reveal');
        setRevealedCount(0);
        setGameResult(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const playSound = (isSuccess) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (isSuccess) {
      // 成功音：明るい3音のメロディ（ピロリン♪）
      oscillator.frequency.value = 659.25; // E5
      oscillator.type = 'sine';
      gainNode.gain.value = 0.2;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
      
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 783.99; // G5
        osc2.type = 'sine';
        gain2.gain.value = 0.2;
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.1);
      }, 100);
      
      setTimeout(() => {
        const osc3 = audioContext.createOscillator();
        const gain3 = audioContext.createGain();
        osc3.connect(gain3);
        gain3.connect(audioContext.destination);
        osc3.frequency.value = 1046.50; // C6
        osc3.type = 'sine';
        gain3.gain.value = 0.2;
        osc3.start();
        osc3.stop(audioContext.currentTime + 0.15);
      }, 200);
    } else {
      // 失敗音：ブザー音
      oscillator.frequency.value = 100;
      oscillator.type = 'sawtooth';
      gainNode.gain.value = 0.3;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  };

  const playFinalSound = (isSuccess) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (isSuccess) {
      // 明るいファンファーレ風メロディ（ドミソド）
      const notes = [
        { freq: 523.25, time: 0 },      // C5
        { freq: 659.25, time: 0.15 },   // E5
        { freq: 783.99, time: 0.3 },    // G5
        { freq: 1046.50, time: 0.45 }   // C6
      ];
      
      notes.forEach(note => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = note.freq;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
        }, note.time * 1000);
      });
    } else {
      // えーんという泣き声（下降する音）
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // 2回目の泣き声
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(650, audioContext.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.5);
        
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.5);
      }, 300);
    }
  };

  const revealCard = () => {
    if (revealedCount < arrangedCards.length) {
      const currentIndex = revealedCount;
      setRevealedCount(revealedCount + 1);
      
      // 1枚目以外は成功/失敗判定をしてエフェクトと音を出す
      if (currentIndex > 0) {
        const currentCard = arrangedCards[currentIndex];
        const previousCard = arrangedCards[currentIndex - 1];
        const isSuccess = currentCard.number >= previousCard.number;
        
        // 音を再生
        setTimeout(() => {
          playSound(isSuccess);
        }, 100);
        
        // エフェクトを表示
        setTimeout(() => {
          setCardRevealEffect({ index: currentIndex, isSuccess });
          setTimeout(() => setCardRevealEffect(null), 800);
        }, 100);
      }
      
      // 次にめくるカードを画面中心にスクロール
      setTimeout(() => {
        const nextCardIndex = revealedCount + 1;
        if (nextCardIndex < arrangedCards.length) {
          const container = document.querySelector('[data-scroll-container]');
          const cards = container?.querySelectorAll('[data-card]');
          if (cards && cards[nextCardIndex]) {
            const card = cards[nextCardIndex];
            const containerRect = container.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const scrollLeft = card.offsetLeft - (containerRect.width / 2) + (cardRect.width / 2);
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          }
        }
      }, 100);
      
      if (revealedCount === arrangedCards.length - 1) {
        // 最後のカードの場合、2秒後に結果を表示
        setTimeout(() => {
          let isSuccess = true;
          for (let i = 1; i < arrangedCards.length; i++) {
            if (arrangedCards[i].number < arrangedCards[i - 1].number) {
              isSuccess = false;
              break;
            }
          }
          setGameResult(isSuccess ? 'success' : 'fail');
          // 最終結果の音を再生
          playFinalSound(isSuccess);
        }, 2000);
      }
    }
  };

  const nextRound = () => {
    setPhase('topicSelect');
    setTopic(null);
    setCustomTopic('');
    setIsRandomTopic(true);
    setCurrentDistributeIndex(0);
    setShowNumber(false);
    setShowNumberConfirm(false);
    setUsedNumbers([]);
    setCurrentRound(1);
    selectRandomTopic();
  };

  const quitGame = () => {
    setConfirmDialog({
      message: 'ゲームをやめてセットアップに戻りますか？',
      onConfirm: () => {
        setPhase('setup');
        setPlayerCount(2);
        setCardsPerPlayer(1);
        setPlayerNames([]);
        setCustomTopic('');
        setIsRandomTopic(true);
        setNumbers([]);
        setUsedNumbers([]);
        setCurrentDistributeIndex(0);
        setShowNumber(false);
        setShowNumberConfirm(false);
        setExpressionOrder([]);
        setExpressions([]);
        setCurrentExpression('');
        setArrangedCards([]);
        setRevealedCount(0);
        setGameResult(null);
        setCurrentRound(1);
        selectRandomTopic();
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const resetToTopic = () => {
    setConfirmDialog({
      message: 'お題を選び直しますか？',
      onConfirm: () => {
        setPhase('topicSelect');
        setTopic(null);
        setCustomTopic('');
        setIsRandomTopic(true);
        setUsedNumbers([]);
        setCurrentRound(1);
        selectRandomTopic();
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const ConfirmDialog = () => {
    if (!confirmDialog) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <p className="text-xl font-bold text-gray-800 mb-6 text-center">
            {confirmDialog.message}
          </p>
          <div className={`flex gap-4 ${confirmDialog.onCancel ? '' : 'justify-center'}`}>
            {confirmDialog.onCancel && (
              <button
                onClick={confirmDialog.onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-400 transition-all"
              >
                キャンセル
              </button>
            )}
            <button
              onClick={confirmDialog.onConfirm}
              className={`${confirmDialog.onCancel ? 'flex-1' : 'px-12'} bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Confetti = () => {
    return (
      <div className="fixed inset-0 pointer-events-none z-40">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          </div>
        ))}
        <style>{`
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
          .animate-fall {
            animation: fall linear forwards;
          }
        `}</style>
      </div>
    );
  };

  const CardRevealEffect = ({ isSuccess }) => {
    return (
      <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
        {isSuccess ? (
          <div className="animate-ping-once">
            <div className="text-8xl">✨</div>
          </div>
        ) : (
          <div className="animate-shake">
            <div className="text-8xl">💥</div>
          </div>
        )}
        <style>{`
          @keyframes ping-once {
            0% {
              transform: scale(0.5);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          .animate-ping-once {
            animation: ping-once 0.6s ease-out;
          }
          .animate-shake {
            animation: shake 0.4s ease-in-out;
          }
        `}</style>
      </div>
    );
  };

  if (phase === 'topicSelect') {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-end mb-4">
              <button onClick={quitGame} className="flex items-center gap-2 text-red-600 hover:text-red-800 font-bold">
                <Home size={20} />やめる
              </button>
            </div>
            <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">お題を選ぶ</h1>
            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setIsRandomTopic(true)}
                  className={`flex-1 py-3 rounded-2xl font-bold transition-all ${isRandomTopic ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700'}`}
                >
                  ランダム
                </button>
                <button
                  onClick={() => setIsRandomTopic(false)}
                  className={`flex-1 py-3 rounded-2xl font-bold transition-all ${!isRandomTopic ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700'}`}
                >
                  任意入力
                </button>
              </div>
              {isRandomTopic ? (
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">今回のお題</p>
                    <p className="text-2xl font-bold text-purple-700 mb-2">{topic?.main}</p>
                    <p className="text-lg text-gray-700">
                      <span className="font-bold text-blue-600">1</span> = {topic?.min} / <span className="font-bold text-red-600">100</span> = {topic?.max}
                    </p>
                  </div>
                  <button
                    onClick={selectRandomTopic}
                    className="mt-4 w-full bg-white text-purple-600 py-3 rounded-xl font-bold hover:bg-purple-50 flex items-center justify-center gap-2"
                  >
                    <Shuffle size={20} />
                    別のお題にする
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="例: 好きな食べ物"
                  className="w-full p-4 border-2 border-purple-300 rounded-2xl focus:border-purple-500 focus:outline-none text-lg"
                />
              )}
              <button
                onClick={() => {
                  if (!isRandomTopic && !customTopic.trim()) {
                    setConfirmDialog({
                      message: 'お題を入力してください。',
                      onConfirm: () => setConfirmDialog(null),
                      onCancel: null
                    });
                    return;
                  }
                  const finalNames = Array.from({ length: playerCount }).map((_, idx) => {
                    const name = playerNames[idx];
                    return (name && name.trim()) ? name.trim() : `プレイヤー${idx + 1}`;
                  });
                  setPlayerNames(finalNames);
                  if (!isRandomTopic) {
                    setTopic({ main: customTopic, min: "1", max: "100" });
                  }
                  
                  // 先に順番を決める
                  const indices = Array.from({ length: playerCount }, (_, i) => i);
                  const shuffledOrder = indices.sort(() => Math.random() - 0.5);
                  setExpressionOrder(shuffledOrder);
                  if (currentRound === 1) {
                    setExpressions([]);
                  }
                  setCurrentRound(1);
                  setUsedNumbers([]); // usedNumbersをリセット
                  setPhase('orderDecided');
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-xl hover:shadow-lg"
              >
                ゲーム開始
              </button>
            </div>
          </div>
        </div>
        <ConfirmDialog />
      </>
    );
  }

  if (phase === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-8 animate-bounce">
            <div className="inline-block bg-white rounded-3xl p-8 shadow-2xl">
              <h1 className="text-8xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">ito</h1>
            </div>
          </div>
          <p className="text-white text-2xl font-bold mb-8">協力型カードゲーム</p>
          <button
            onClick={() => {
              setTimeout(() => setPhase('setup'), 300);
            }}
            className="bg-white text-purple-600 px-12 py-4 rounded-full font-bold text-xl hover:scale-110 transition-transform shadow-lg"
          >
            スタート
          </button>
          <style>{`
            @keyframes bounce {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-20px);
              }
            }
            .animate-bounce {
              animation: bounce 2s ease-in-out infinite;
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (phase === 'setup') {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
            <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">ito</h1>
            <div className="text-center mb-8">
              <button
                onClick={() => setShowRules(true)}
                className="text-purple-600 hover:text-purple-800 font-bold underline"
              >
                ルール説明を見る
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-3 text-lg">プレイ人数</label>
                <select
                  value={playerCount}
                  onChange={(e) => {
                    const count = parseInt(e.target.value);
                    const newNames = Array(count).fill('').map((_, idx) => playerNames[idx] || '');
                    setPlayerCount(count);
                    setPlayerNames(newNames);
                  }}
                  className="w-full p-4 border-2 border-purple-300 rounded-2xl focus:border-purple-500 focus:outline-none text-lg"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}人</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-3 text-lg">カード配布枚数</label>
                <select
                  value={cardsPerPlayer}
                  onChange={(e) => setCardsPerPlayer(parseInt(e.target.value))}
                  className="w-full p-4 border-2 border-purple-300 rounded-2xl focus:border-purple-500 focus:outline-none text-lg"
                >
                  <option value={1}>1枚</option>
                  <option value={2}>2枚</option>
                  <option value={3}>3枚</option>
                </select>
                <p className="text-sm text-gray-600 mt-2">※2枚以上を選択すると、各プレイヤーが複数回数字を配られて複数回例えを入力します</p>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-3 text-lg">プレイヤー名（空欄の場合は自動設定されます）</label>
                <div className="space-y-3">
                  {Array.from({ length: playerCount }).map((_, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={playerNames[idx] || ''}
                      onChange={(e) => {
                        const newNames = [...playerNames];
                        newNames[idx] = e.target.value;
                        setPlayerNames(newNames);
                      }}
                      placeholder={`プレイヤー${idx + 1}`}
                      className="w-full p-4 border-2 border-purple-300 rounded-2xl focus:border-purple-500 focus:outline-none placeholder-gray-400"
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-3 text-lg">お題</label>
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setIsRandomTopic(true)}
                    className={`flex-1 py-3 rounded-2xl font-bold transition-all ${isRandomTopic ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700'}`}
                  >
                    ランダム
                  </button>
                  <button
                    onClick={() => setIsRandomTopic(false)}
                    className={`flex-1 py-3 rounded-2xl font-bold transition-all ${!isRandomTopic ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700'}`}
                  >
                    任意入力
                  </button>
                </div>
                {isRandomTopic ? (
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">今回のお題</p>
                      <p className="text-2xl font-bold text-purple-700 mb-2">{topic?.main}</p>
                      <p className="text-lg text-gray-700">
                        <span className="font-bold text-blue-600">1</span> = {topic?.min} / <span className="font-bold text-red-600">100</span> = {topic?.max}
                      </p>
                    </div>
                    <button
                      onClick={selectRandomTopic}
                      className="mt-4 w-full bg-white text-purple-600 py-3 rounded-xl font-bold hover:bg-purple-50 flex items-center justify-center gap-2"
                    >
                      <Shuffle size={20} />
                      別のお題にする
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="例: 好きな食べ物"
                    className="w-full p-4 border-2 border-purple-300 rounded-2xl focus:border-purple-500 focus:outline-none text-lg"
                  />
                )}
              </div>
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-5 rounded-2xl font-bold text-xl hover:shadow-lg flex items-center justify-center gap-2"
              >
                ゲーム開始
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
        <ConfirmDialog />
        {showRules && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 w-full shadow-2xl" style={{ maxWidth: '42rem', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
              <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">itoのルール</h2>
              <div style={{ flex: '1 1 0', overflowY: 'auto', paddingRight: '8px', minHeight: '200px' }}>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="text-xl font-bold text-purple-600 mb-2">ゲームの目的</h3>
                    <p>各プレイヤーに配られた1〜100の数字を、お題に沿った「例え」で表現し、全員で協力して数字の小さい順に並べることを目指します。</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-600 mb-2">ゲームの流れ</h3>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li><strong>数字の配布：</strong>各プレイヤーに1〜100の数字がランダムに配られます。</li>
                      <li><strong>例えの発表：</strong>ランダムに決まった順番で、自分の数字をお題に沿った「例え」で表現します。</li>
                      <li><strong>カードの並べ替え：</strong>全員の例えが出揃ったら、協力して数字が小さい順になるようにカードを並べます。</li>
                      <li><strong>答え合わせ：</strong>下から順番にカードをめくって、正しい順番になっているか確認します。</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-600 mb-2">成功条件</h3>
                    <p>全てのカードが数字の小さい順に並んでいれば成功です！</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-600 mb-2">コツ</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>前の人の例えをよく聞いて、自分の数字との相対的な位置を考えましょう</li>
                      <li>具体的でわかりやすい例えを心がけましょう</li>
                      <li>カードを並べるときは、みんなで相談しながら決めましょう</li>
                    </ul>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowRules(false)}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold hover:shadow-lg flex-shrink-0"
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (phase === 'distribute') {
    const isLastPlayer = currentDistributeIndex === playerCount - 1;
    const playerIndex = expressionOrder[currentDistributeIndex]; // 順番に従ってプレイヤーを選択
    const currentPlayerName = playerNames[playerIndex];
    const currentNumber = numbers[playerIndex];

    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-400 to-blue-400 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <button onClick={resetToTopic} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-bold">
                <RotateCcw size={20} />最初に戻る
              </button>
              <button onClick={quitGame} className="flex items-center gap-2 text-red-600 hover:text-red-800 font-bold">
                <Home size={20} />やめる
              </button>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-teal-600 mb-4">
                数字を配布中...{cardsPerPlayer >= 2 ? `（${currentRound}/${cardsPerPlayer}回目）` : ''}
              </h2>
              <p className="text-gray-600">{currentDistributeIndex + 1} / {playerCount}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl mb-8">
              <p className="text-sm text-gray-600 mb-2 text-center">今回のお題</p>
              <p className="text-xl font-bold text-purple-700 mb-2 text-center">{topic?.main}</p>
              <p className="text-base text-gray-700 text-center">
                <span className="font-bold text-blue-600">1</span> = {topic?.min} / <span className="font-bold text-red-600">100</span> = {topic?.max}
              </p>
            </div>
            <div className="bg-yellow-100 border-4 border-yellow-400 rounded-2xl p-6 mb-6">
              <p className="text-center text-xl font-bold text-yellow-800 mb-4">次は {currentPlayerName} さんが見てください</p>
              <p className="text-center text-gray-600 text-sm">⚠️ 他の人は見ないでください</p>
            </div>
            {!showNumberConfirm && !showNumber && (
              <button
                onClick={() => setShowNumberConfirm(true)}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-6 rounded-2xl font-bold text-xl hover:shadow-lg"
              >
                数字を見る
              </button>
            )}
            {showNumberConfirm && !showNumber && (
              <div className="bg-white border-4 border-orange-400 rounded-2xl p-6">
                <p className="text-center text-xl font-bold text-gray-800 mb-6">数字を表示します。よろしいですか？</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowNumberConfirm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-400"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => {
                      setShowNumberConfirm(false);
                      setShowNumber(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 text-white py-4 rounded-xl font-bold hover:shadow-lg"
                  >
                    はい
                  </button>
                </div>
              </div>
            )}
            {showNumber && (
              <>
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-center mb-4">
                  <p className="text-white text-sm mb-2">あなたの数字</p>
                  <p className="text-white text-7xl font-bold">{currentNumber}</p>
                </div>
                <button
                  onClick={() => {
                    setShowNumber(false);
                    setShowNumberConfirm(false);
                    // 数字を見た後、すぐに例え入力画面へ
                    setPhase('express');
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 rounded-2xl font-bold text-xl hover:shadow-lg"
                >
                  数字を消して例えを入力する
                </button>
              </>
            )}
          </div>
        </div>
        <ConfirmDialog />
      </>
    );
  }

  if (phase === 'orderDecided') {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <button onClick={resetToTopic} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-bold">
                <RotateCcw size={20} />最初に戻る
              </button>
              <button onClick={quitGame} className="flex items-center gap-2 text-red-600 hover:text-red-800 font-bold">
                <Home size={20} />やめる
              </button>
            </div>
            <h2 className="text-4xl font-bold text-center mb-4 text-orange-600">
              {cardsPerPlayer >= 2 && currentRound > 1 ? `${currentRound}/${cardsPerPlayer}回目 - ` : ''}例えを発表する順番
            </h2>
            <div className="text-center mb-6">
              <button
                onClick={() => {
                  const indices = Array.from({ length: playerCount }, (_, i) => i);
                  const shuffledOrder = indices.sort(() => Math.random() - 0.5);
                  setExpressionOrder(shuffledOrder);
                }}
                className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto border-2 border-orange-500"
              >
                <Shuffle size={20} />順番をシャッフルし直す
              </button>
            </div>
            <p className="text-center text-gray-600 mb-6 text-sm">矢印ボタン（↑↓）で順番を手動で入れ替えることもできます</p>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl mb-8">
              <p className="text-sm text-gray-600 mb-2 text-center">今回のお題</p>
              <p className="text-xl font-bold text-purple-700 mb-2 text-center">{topic?.main}</p>
              <p className="text-base text-gray-700 text-center">
                <span className="font-bold text-blue-600">1</span> = {topic?.min} / <span className="font-bold text-red-600">100</span> = {topic?.max}
              </p>
            </div>
            <div className="space-y-4 mb-8">
              {expressionOrder.map((playerIndex, idx) => (
                <div 
                  key={idx} 
                  className={`rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${movedCardIndices.includes(idx) ? 'scale-105 shadow-2xl' : ''}`}
                  style={{
                    background: movedCardIndices.includes(idx) ? 'linear-gradient(to right, #fef3c7, #fde68a)' : 'linear-gradient(to right, #fed7aa, #fca5a5)',
                    border: movedCardIndices.includes(idx) ? '3px solid #f59e0b' : '2px solid transparent'
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => movePlayerOrder(idx, 'up')}
                      disabled={idx === 0}
                      className={`w-10 h-10 rounded-lg font-bold text-lg flex items-center justify-center transition-all shadow-sm ${idx === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 active:scale-95'}`}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => movePlayerOrder(idx, 'down')}
                      disabled={idx === expressionOrder.length - 1}
                      className={`w-10 h-10 rounded-lg font-bold text-lg flex items-center justify-center transition-all shadow-sm ${idx === expressionOrder.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 active:scale-95'}`}
                    >
                      ↓
                    </button>
                  </div>
                  <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">{idx + 1}</div>
                  <p className="text-xl font-bold text-gray-800">{playerNames[playerIndex]}</p>
                </div>
              ))}
            </div>
            <button
              onClick={startDistribution}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-5 rounded-2xl font-bold text-xl hover:shadow-lg"
            >
              数字を配布する
            </button>
          </div>
        </div>
        <ConfirmDialog />
      </>
    );
  }

  if (phase === 'express') {
    const currentPlayerIndex = expressionOrder[currentDistributeIndex];
    const currentPlayerName = playerNames[currentPlayerIndex];
    const isFirstPlayer = currentDistributeIndex === 0 && currentRound === 1;
    const previousExpression = expressions.length > 0 ? expressions[expressions.length - 1] : null;

    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <button onClick={resetToTopic} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-bold">
                <RotateCcw size={20} />最初に戻る
              </button>
              <button onClick={quitGame} className="flex items-center gap-2 text-red-600 hover:text-red-800 font-bold">
                <Home size={20} />やめる
              </button>
            </div>
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">
                {cardsPerPlayer >= 2 ? `${currentRound}/${cardsPerPlayer}回目 - ` : ''}
                順番 {currentDistributeIndex + 1} / {playerCount}
              </p>
              <h2 className="text-3xl font-bold text-purple-600">{currentPlayerName} さん</h2>
              <button
                onClick={() => setShowMyNumber(true)}
                className="mt-3 text-sm text-purple-600 hover:text-purple-800 font-bold underline"
              >
                自分の数字を確認する
              </button>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl mb-6">
              <p className="text-sm text-gray-600 mb-2 text-center">今回のお題</p>
              <p className="text-xl font-bold text-purple-700 mb-2 text-center">{topic?.main}</p>
              <p className="text-base text-gray-700 text-center">
                <span className="font-bold text-blue-600">1</span> = {topic?.min} / <span className="font-bold text-red-600">100</span> = {topic?.max}
              </p>
            </div>
            {isFirstPlayer ? (
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 mb-6">
                <p className="text-center text-gray-700 font-bold">前の人の例え：なし（あなたが最初です）</p>
              </div>
            ) : (
              <div className="bg-blue-100 border-2 border-blue-400 rounded-2xl p-4 mb-6">
                <p className="text-center text-gray-600 text-sm mb-2">前の人の例え</p>
                <p className="text-center text-xl font-bold text-blue-700">『{previousExpression.expression}』</p>
                <p className="text-center text-gray-600 text-sm mt-1">({previousExpression.playerName})</p>
              </div>
            )}
            {expressions.length > 0 && (
              <div className="mb-6">
                <p className="text-gray-700 font-bold mb-3">これまでの例え一覧</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {expressions.map((exp, idx) => (
                    <div key={idx} className="bg-gray-100 p-3 rounded-xl">
                      <p className="text-sm text-gray-600">{exp.playerName}</p>
                      <p className="text-gray-800 font-bold">『{exp.expression}』</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">例えを入力</label>
              <input
                type="text"
                value={currentExpression}
                onChange={(e) => setCurrentExpression(e.target.value)}
                placeholder="例: オオカミ"
                className="w-full p-4 border-2 border-purple-300 rounded-2xl focus:border-purple-500 focus:outline-none text-lg"
                onKeyPress={(e) => e.key === 'Enter' && submitExpression()}
              />
            </div>
            <button
              onClick={submitExpression}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-5 rounded-2xl font-bold text-xl hover:shadow-lg"
            >
              送信
            </button>
          </div>
        </div>
        <ConfirmDialog />
        {showMyNumber && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="bg-yellow-100 border-4 border-yellow-400 rounded-2xl p-6 mb-6">
                <p className="text-center text-xl font-bold text-yellow-800 mb-4">⚠️ 注意</p>
                <p className="text-center text-gray-700">他の人には見せないでください！</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-center mb-6">
                <p className="text-white text-sm mb-2">あなたの数字</p>
                <p className="text-white text-7xl font-bold">{numbers[expressionOrder[currentDistributeIndex]]}</p>
              </div>
              <button
                onClick={() => setShowMyNumber(false)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold hover:shadow-lg"
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (phase === 'arrange') {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="flex justify-between items-center mb-6">
              <button onClick={resetToTopic} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-bold">
                <RotateCcw size={20} />最初に戻る
              </button>
              <button onClick={quitGame} className="flex items-center gap-2 text-red-600 hover:text-red-800 font-bold">
                <Home size={20} />やめる
              </button>
            </div>
            <h2 className="text-4xl font-bold text-center mb-6 text-indigo-600">カードを並べる</h2>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-2xl mb-4">
              <p className="text-sm text-gray-600 mb-1 text-center">今回のお題</p>
              <p className="text-lg font-bold text-purple-700 mb-1 text-center">{topic?.main}</p>
              <p className="text-sm text-gray-700 text-center">
                <span className="font-bold text-blue-600">1</span> = {topic?.min} / <span className="font-bold text-red-600">100</span> = {topic?.max}
              </p>
            </div>
            <p className="text-center text-gray-600 mb-4">左右の矢印ボタンで並べ替えてください<br/>（左が小さい数字→右が大きい数字）</p>
            <div data-scroll-container style={{ flex: '1 1 0', overflowX: 'auto', overflowY: 'hidden', minHeight: '280px', paddingBottom: '16px' }}>
              <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
                {arrangedCards.map((card, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-xl p-3 transform transition-all duration-300 ${movedCardIndices.includes(idx) ? 'scale-110 shadow-2xl' : ''}`}
                    style={{
                      width: '200px',
                      flexShrink: 0,
                      background: movedCardIndices.includes(idx) ? 'linear-gradient(145deg, #fef3c7 0%, #fde68a 100%)' : 'linear-gradient(145deg, #ffffff 0%, #f0f4ff 100%)',
                      boxShadow: movedCardIndices.includes(idx) ? '0 20px 40px rgba(245, 158, 11, 0.4)' : '0 6px 15px rgba(79, 70, 229, 0.12), 0 3px 8px rgba(0,0,0,0.06)',
                      border: movedCardIndices.includes(idx) ? '3px solid #f59e0b' : '2px solid #818cf8'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveCard(idx, 'up'); }}
                        disabled={idx === 0}
                        className={`w-10 h-10 rounded-lg font-bold text-lg flex items-center justify-center transition-all shadow-sm ${idx === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:scale-95'}`}
                      >
                        ←
                      </button>
                      <div className="text-center text-2xl font-bold text-indigo-600">{idx + 1}</div>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveCard(idx, 'down'); }}
                        disabled={idx === arrangedCards.length - 1}
                        className={`w-10 h-10 rounded-lg font-bold text-lg flex items-center justify-center transition-all shadow-sm ${idx === arrangedCards.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:scale-95'}`}
                      >
                        →
                      </button>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg px-2 py-1 mb-2 text-center border border-indigo-200">
                      <p className="text-indigo-700 font-bold text-xs truncate">{card.playerName}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800 mb-3 text-center line-clamp-2" style={{ minHeight: '40px' }}>
                      『{card.expression}』
                    </p>
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-2 text-center border border-gray-300">
                      <p className="text-4xl font-black text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>??</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={confirmArrangement}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-5 rounded-2xl font-bold text-xl hover:shadow-lg"
            >
              並べ終わり
            </button>
          </div>
        </div>
        <ConfirmDialog />
      </>
    );
  }

  if (phase === 'reveal') {
    return (
      <>
        {gameResult === 'success' && <Confetti />}
        {cardRevealEffect && <CardRevealEffect isSuccess={cardRevealEffect.isSuccess} />}
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <h2 className="text-4xl font-bold text-center mb-8 text-orange-600">答え合わせ</h2>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-2xl mb-6">
              <p className="text-sm text-gray-600 mb-1 text-center">今回のお題</p>
              <p className="text-lg font-bold text-purple-700 mb-1 text-center">{topic?.main}</p>
              <p className="text-sm text-gray-700 text-center">
                <span className="font-bold text-blue-600">1</span> = {topic?.min} / <span className="font-bold text-red-600">100</span> = {topic?.max}
              </p>
            </div>
            
            {revealedCount >= arrangedCards.length && gameResult && (
              <div className={`rounded-2xl p-8 mb-4 text-center relative overflow-hidden min-h-[100px] flex items-center justify-center ${gameResult === 'success' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-red-400 to-pink-400'}`}>
                {gameResult === 'success' ? (
                  <>
                    <div className="absolute inset-0 pointer-events-none">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute animate-sparkle"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 1}s`,
                            fontSize: '1.5rem'
                          }}
                        >
                          ⭐
                        </div>
                      ))}
                    </div>
                    <p className="text-5xl font-bold text-white relative z-10">成功！</p>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 pointer-events-none">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute animate-cry-fall"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `-20px`,
                            animationDelay: `${Math.random() * 1}s`,
                            animationDuration: `${2 + Math.random() * 1}s`,
                            fontSize: '1.5rem'
                          }}
                        >
                          😢
                        </div>
                      ))}
                    </div>
                    <p className="text-5xl font-bold text-white relative z-10">失敗...</p>
                  </>
                )}
                <style>{`
                  @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0); }
                    50% { opacity: 1; transform: scale(1); }
                  }
                  @keyframes cry-fall {
                    0% {
                      transform: translateY(0) rotate(0deg);
                      opacity: 1;
                    }
                    100% {
                      transform: translateY(400px) rotate(180deg);
                      opacity: 0;
                    }
                  }
                  .animate-sparkle {
                    animation: sparkle 1.5s ease-in-out infinite;
                  }
                  .animate-cry-fall {
                    animation: cry-fall linear forwards;
                  }
                `}</style>
              </div>
            )}
            
            <div data-scroll-container style={{ flex: '1 1 0', overflowX: 'auto', overflowY: 'hidden', minHeight: '280px', paddingBottom: '16px' }}>
              <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
                {arrangedCards.map((card, idx) => {
                  const revealIndex = idx; // 左から右にめくる
                  const isRevealed = revealIndex < revealedCount;
                  const isNextToReveal = revealIndex === revealedCount;
                  
                  // 最初のカード（idx=0）は判定なし、それ以外は前のカードとの比較
                  let isSuccess = true;
                  let showJudgement = false;
                  if (isRevealed && idx > 0 && arrangedCards[idx - 1]) {
                    showJudgement = true;
                    isSuccess = card.number >= arrangedCards[idx - 1].number;
                  }

                  return (
                    <div
                      key={idx}
                      data-card
                      className={`rounded-xl p-3 transform transition-all ${isNextToReveal ? 'bg-gradient-to-r from-yellow-200 to-orange-200 border-4 border-orange-500 shadow-lg' : isRevealed ? showJudgement ? isSuccess ? 'bg-gradient-to-r from-green-200 to-emerald-200 border-2 border-green-400' : 'bg-gradient-to-r from-red-200 to-pink-200 border-2 border-red-400' : 'bg-gradient-to-r from-blue-200 to-indigo-200 border-2 border-blue-400' : 'bg-gradient-to-r from-gray-200 to-gray-300 border-2 border-gray-400'}`}
                      style={{
                        width: '200px',
                        flexShrink: 0
                      }}
                    >
                      <div className="text-center text-2xl font-bold text-indigo-600 mb-3">{idx + 1}</div>
                      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg px-2 py-1 mb-2 text-center border border-indigo-200">
                        <p className="text-indigo-700 font-bold text-xs truncate">{card.playerName}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-800 mb-3 text-center line-clamp-2" style={{ minHeight: '40px' }}>
                        『{card.expression}』
                      </p>
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-3 text-center border border-gray-300">
                        {isRevealed ? (
                          <div>
                            <p className="text-4xl font-bold text-gray-800 mb-1">{card.number}</p>
                            {showJudgement && (
                              <div className="flex justify-center">
                                {isSuccess ? <Check size={28} className="text-green-600 animate-bounce" /> : <X size={28} className="text-red-600 animate-pulse" />}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-4xl font-black text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>??</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {revealedCount < arrangedCards.length ? (
              <button
                onClick={revealCard}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 rounded-2xl font-bold text-xl hover:shadow-lg"
              >
                カードをめくる ({revealedCount + 1} / {arrangedCards.length})
              </button>
            ) : (
              <div>
                <div className="bg-gray-100 rounded-2xl p-4 mb-4 max-h-48 overflow-y-auto">
                  <p className="text-center font-bold text-gray-700 mb-3">最終結果</p>
                  <div className="space-y-2">
                    {arrangedCards.map((card, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg">
                        <span className="text-sm font-bold text-gray-700">{card.playerName}</span>
                        <span className="text-sm text-gray-600">『{card.expression}』</span>
                        <span className="text-lg font-bold text-purple-700">{card.number}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={nextRound}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-6 rounded-2xl font-bold text-xl hover:shadow-lg"
                >
                  次のラウンドへ
                </button>
              </div>
            )}
          </div>
        </div>
        <ConfirmDialog />
      </>
    );
  }

  return null;
};

export default ItoGame;
