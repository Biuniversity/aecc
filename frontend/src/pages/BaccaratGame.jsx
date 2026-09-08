import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Gamepad2, Timer, Coins, RefreshCw, Sparkles, Heart } from 'lucide-react';

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const getCardValue = (rank) => {
  if (['10', 'J', 'Q', 'K'].includes(rank)) return 0;
  if (rank === 'A') return 1;
  return parseInt(rank);
};

const getRandomCard = () => {
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
  const isRed = suit === '♥' || suit === '♦';
  return { rank, suit, isRed, value: getCardValue(rank) };
};

export const BaccaratGame = () => {
  const [balance, setBalance] = useState(10000);
  const [timer, setTimer] = useState(15);
  const [gameState, setGameState] = useState('betting'); // 'betting', 'dealing', 'result'
  
  const [selectedBet, setSelectedBet] = useState(null);
  const [chipAmount, setChipAmount] = useState(500);

  const [playerHand, setPlayerHand] = useState([]);
  const [bankerHand, setBankerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [bankerScore, setBankerScore] = useState(0);
  const [resultMessage, setResultMessage] = useState('');
  const [winningChoice, setWinningChoice] = useState(null);
  const [history, setHistory] = useState([]);

  // Dealer Speech & Pose State
  const [dealerDialogue, setDealerDialogue] = useState('Xin chào! Tôi là Dealer Scarlet. Hãy chọn cửa cược trong 15s nhé! ✨');
  const [dealerAction, setDealerAction] = useState('idle'); // 'idle', 'dealing', 'win', 'lose'

  const timerRef = useRef(null);

  useEffect(() => {
    if (gameState === 'betting') {
      setDealerAction('idle');
      setDealerDialogue('Mời bạn chọn cửa Cái (Banker), Con (Player) hoặc Hòa (Tie) nha! ✨');
      
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleStartDeal();
            return 0;
          }
          if (prev === 6) {
            setDealerDialogue('Sắp hết 15 giây rồi kìa! Nhanh tay chọn cửa nhé~ ⏳');
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const handleStartDeal = () => {
    setGameState('dealing');
    setDealerAction('dealing');
    setDealerDialogue('Đang chia và lật bài... Hãy cùng chờ xem kết quả nhé! 🎴✨');

    const p1 = getRandomCard();
    const p2 = getRandomCard();
    const b1 = getRandomCard();
    const b2 = getRandomCard();

    let pHand = [p1, p2];
    let bHand = [b1, b2];

    let pScore = (p1.value + p2.value) % 10;
    let bScore = (b1.value + b2.value) % 10;

    if (pScore < 8 && bScore < 8) {
      let p3 = null;
      if (pScore <= 5) {
        p3 = getRandomCard();
        pHand.push(p3);
        pScore = (pScore + p3.value) % 10;
      }

      if (!p3) {
        if (bScore <= 5) {
          const b3 = getRandomCard();
          bHand.push(b3);
          bScore = (bScore + b3.value) % 10;
        }
      } else {
        const val3 = p3.value;
        let bankerDraws = false;
        if (bScore <= 2) bankerDraws = true;
        else if (bScore === 3 && val3 !== 8) bankerDraws = true;
        else if (bScore === 4 && [2, 3, 4, 5, 6, 7].includes(val3)) bankerDraws = true;
        else if (bScore === 5 && [4, 5, 6, 7].includes(val3)) bankerDraws = true;
        else if (bScore === 6 && [6, 7].includes(val3)) bankerDraws = true;

        if (bankerDraws) {
          const b3 = getRandomCard();
          bHand.push(b3);
          bScore = (bScore + b3.value) % 10;
        }
      }
    }

    setPlayerHand(pHand);
    setBankerHand(bHand);
    setPlayerScore(pScore);
    setBankerScore(bScore);

    setTimeout(() => {
      let winner = 'tie';
      if (pScore > bScore) winner = 'player';
      else if (bScore > pScore) winner = 'banker';

      setWinningChoice(winner);
      setGameState('result');
      setHistory((prev) => [winner, ...prev.slice(0, 9)]);

      let msg = '';
      if (selectedBet === winner) {
        let winAmount = 0;
        if (winner === 'player') winAmount = chipAmount * 2;
        else if (winner === 'banker') winAmount = Math.floor(chipAmount * 1.95);
        else if (winner === 'tie') winAmount = chipAmount * 9;

        setBalance((prev) => prev + (winAmount - chipAmount));
        setDealerAction('win');
        setDealerDialogue(`Woahhh! Chúc mừng bạn đã đoán đúng và thắng +${(winAmount - chipAmount).toLocaleString()} xu! 🎉💖`);
        msg = `🎉 BẠN THẮNG +${(winAmount - chipAmount).toLocaleString()} XU!`;

        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      } else if (selectedBet) {
        setBalance((prev) => Math.max(0, prev - chipAmount));
        setDealerAction('lose');
        setDealerDialogue(`Tiếc quá nè! Vòng này kết quả ra ${winner === 'player' ? 'Cửa Con' : winner === 'banker' ? 'Cửa Cái' : 'Cửa Hòa'}. Đừng nản nhé! 💖`);
        msg = `💸 RẤT TIẾC! BẠN ĐÃ THUA ${chipAmount.toLocaleString()} XU.`;
      } else {
        setDealerAction('idle');
        setDealerDialogue(`Vòng này bạn chưa kịp đặt cược. Kết quả ra: ${winner === 'player' ? 'Cửa Con' : winner === 'banker' ? 'Cửa Cái' : 'Cửa Hòa'}. ✨`);
        msg = 'BẠN KHÔNG ĐẶT CƯỢC TRONG VÒNG NÀY.';
      }

      setResultMessage(msg);

      setTimeout(() => {
        setGameState('betting');
        setTimer(15);
        setSelectedBet(null);
        setPlayerHand([]);
        setBankerHand([]);
        setResultMessage('');
      }, 5000);
    }, 1800);
  };

  const handleBetChoice = (choice) => {
    if (gameState !== 'betting') return;
    setSelectedBet(choice);
    setDealerDialogue(`Bạn đã chọn đặt ${choice === 'player' ? 'Cửa Con' : choice === 'banker' ? 'Cửa Cái' : 'Cửa Hòa'} với ${chipAmount.toLocaleString()} xu! Chúc bạn may mắn ❤️`);
  };

  const handleDealerClick = () => {
    const quotes = [
      "Hôm nay bạn trông thật may mắn đó! ✨",
      "Hãy nhớ giải trí vui vẻ và giữ tinh thần thoải mái nhé! 💖",
      "Dealer Scarlet luôn đồng hành cùng các nhân viên chăm chỉ! 🔥",
      "Thử vận may với cửa Cái hoặc Con ngay nào~"
    ];
    const rand = quotes[Math.floor(Math.random() * quotes.length)];
    setDealerDialogue(rand);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Game Title Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.25) 0%, rgba(15, 15, 20, 0.95) 100%)',
        border: '1px solid rgba(225, 29, 72, 0.4)',
        borderRadius: '24px',
        padding: '24px 32px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#e11d48', padding: '14px', borderRadius: '16px', color: '#fff', boxShadow: '0 0 20px rgba(225, 29, 72, 0.6)' }}>
            <Gamepad2 size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
              Baccarat Live Dealer Scarlet
            </h2>
            <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
              Trò chơi giải trí Baccarat live với Dealer xinh đẹp. 15 giây suy nghĩ & đặt cược miễn phí.
            </p>
          </div>
        </div>

        {/* User Balance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#13131a', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 18px', borderRadius: '14px', textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
              <Coins size={14} color="#34d399" /> XU MIỄN PHÍ
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
              {balance.toLocaleString()}
            </div>
          </div>

          <button onClick={() => setBalance(10000)} title="Nạp lại 10.000 xu" style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid #333', color: '#fff', padding: '12px', borderRadius: '12px', cursor: 'pointer'
          }}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Main Game Arena Felt Table */}
      <div style={{
        background: 'radial-gradient(circle, #1a0f12 0%, #0b0a0e 100%)',
        border: '3px solid rgba(225, 29, 72, 0.4)',
        borderRadius: '28px',
        padding: '32px 24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 60px rgba(225, 29, 72, 0.15)',
        position: 'relative'
      }}>
        {/* BEAUTIFUL FEMALE DEALER SECTION */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '24px',
          position: 'relative'
        }}>
          {/* Dealer Dialogue Speech Bubble */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 42, 85, 0.95), rgba(153, 27, 27, 0.95))',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '20px',
            fontSize: '0.95rem',
            fontWeight: 700,
            boxShadow: '0 8px 25px rgba(225, 29, 72, 0.5)',
            marginBottom: '14px',
            maxWidth: '520px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: dealerAction === 'dealing' ? 'pulse 1s infinite' : 'none'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Heart size={16} fill="#ffffff" color="#ffffff" />
              {dealerDialogue}
            </span>
          </div>

          {/* Animated Dealer Avatar Image */}
          <div
            onClick={handleDealerClick}
            style={{
              position: 'relative',
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              padding: '4px',
              background: 'linear-gradient(135deg, #ff2a55, #991b1b)',
              boxShadow: '0 0 35px rgba(255, 42, 85, 0.6)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: dealerAction === 'dealing' ? 'scale(1.08) rotate(-3deg)' : 'scale(1)'
            }}
          >
            <img
              src="/dealer.png"
              alt="Dealer Scarlet"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            {dealerAction === 'dealing' && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: '#ff2a55',
                color: '#fff',
                borderRadius: '50%',
                padding: '6px',
                boxShadow: '0 0 15px #ff2a55'
              }}>
                <Sparkles size={20} />
              </div>
            )}
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ff2a55', marginTop: '6px', letterSpacing: '1px' }}>
            DEALER SCARLET
          </div>
        </div>

        {/* Timer Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '28px'
        }}>
          <div style={{
            background: timer <= 5 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(225, 29, 72, 0.15)',
            border: `2px solid ${timer <= 5 ? '#ef4444' : '#e11d48'}`,
            padding: '8px 20px',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 0 20px rgba(225, 29, 72, 0.3)'
          }}>
            <Timer size={20} color={timer <= 5 ? '#ef4444' : '#ff2a55'} />
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              {gameState === 'betting' ? `SUY NGHĨ & ĐẶT CƯỢC: ${timer}s` : gameState === 'dealing' ? 'DEALER ĐANG XÓC & MỞ BÀI...' : 'KẾT QUẢ VÒNG DỰ ĐOÁN'}
            </span>
          </div>
        </div>

        {/* Cards Table Layout (Con - Player vs Cái - Banker) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* CON (PLAYER) SECTION */}
          <div style={{
            background: 'rgba(30, 40, 60, 0.4)',
            border: `2px solid ${winningChoice === 'player' ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)'}`,
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
            transition: 'all 0.3s',
            boxShadow: winningChoice === 'player' ? '0 0 30px rgba(59, 130, 246, 0.6)' : 'none'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#60a5fa', marginBottom: '16px' }}>
              CON (PLAYER) - SCORE: {gameState !== 'betting' ? playerScore : '?'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', minHeight: '120px', alignItems: 'center' }}>
              {playerHand.length > 0 ? (
                playerHand.map((card, idx) => (
                  <div key={idx} style={{
                    width: '72px',
                    height: '104px',
                    background: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '8px',
                    color: card.isRed ? '#dc2626' : '#111827',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    transform: 'rotateY(0deg)',
                    transition: 'all 0.5s ease-in-out'
                  }}>
                    <div>{card.rank}{card.suit}</div>
                    <div style={{ fontSize: '1.8rem', textAlign: 'center' }}>{card.suit}</div>
                    <div style={{ textAlign: 'right' }}>{card.rank}</div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Dealer đang giữ bài...</div>
              )}
            </div>
          </div>

          {/* CÁI (BANKER) SECTION */}
          <div style={{
            background: 'rgba(60, 20, 30, 0.4)',
            border: `2px solid ${winningChoice === 'banker' ? '#ef4444' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
            transition: 'all 0.3s',
            boxShadow: winningChoice === 'banker' ? '0 0 30px rgba(239, 68, 68, 0.6)' : 'none'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f87171', marginBottom: '16px' }}>
              CÁI (BANKER) - SCORE: {gameState !== 'betting' ? bankerScore : '?'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', minHeight: '120px', alignItems: 'center' }}>
              {bankerHand.length > 0 ? (
                bankerHand.map((card, idx) => (
                  <div key={idx} style={{
                    width: '72px',
                    height: '104px',
                    background: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '8px',
                    color: card.isRed ? '#dc2626' : '#111827',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    transform: 'rotateY(0deg)',
                    transition: 'all 0.5s ease-in-out'
                  }}>
                    <div>{card.rank}{card.suit}</div>
                    <div style={{ fontSize: '1.8rem', textAlign: 'center' }}>{card.suit}</div>
                    <div style={{ textAlign: 'right' }}>{card.rank}</div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Dealer đang giữ bài...</div>
              )}
            </div>
          </div>
        </div>

        {/* Result Announcement */}
        {resultMessage && (
          <div style={{
            textAlign: 'center',
            padding: '14px',
            background: winningChoice === selectedBet ? 'rgba(16, 185, 129, 0.2)' : 'rgba(225, 29, 72, 0.2)',
            border: `1px solid ${winningChoice === selectedBet ? '#10b981' : '#e11d48'}`,
            borderRadius: '16px',
            marginBottom: '24px',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: '#ffffff'
          }}>
            {resultMessage}
          </div>
        )}

        {/* Chip Selector */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700 }}>
            CHỌN MỆNH GIÁ CHIP CƯỢC
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {[100, 500, 1000, 5000].map((amt) => (
              <button
                key={amt}
                onClick={() => setChipAmount(amt)}
                style={{
                  background: chipAmount === amt ? '#e11d48' : '#13131a',
                  border: `2px solid ${chipAmount === amt ? '#ff2a55' : 'rgba(255,255,255,0.1)'}`,
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: chipAmount === amt ? '0 0 15px rgba(225, 29, 72, 0.6)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {amt.toLocaleString()} XU
              </button>
            ))}
          </div>
        </div>

        {/* Betting Placement Buttons (CON / HÒA / CÁI) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <button
            disabled={gameState !== 'betting'}
            onClick={() => handleBetChoice('player')}
            style={{
              background: selectedBet === 'player' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'rgba(30, 40, 60, 0.6)',
              border: `2px solid ${selectedBet === 'player' ? '#60a5fa' : 'rgba(59, 130, 246, 0.4)'}`,
              borderRadius: '16px',
              padding: '20px 16px',
              color: '#ffffff',
              cursor: gameState === 'betting' ? 'pointer' : 'not-allowed',
              textAlign: 'center',
              boxShadow: selectedBet === 'player' ? '0 0 25px rgba(59, 130, 246, 0.6)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#93c5fd' }}>CỬA CON (PLAYER)</div>
            <div style={{ fontSize: '0.8rem', color: '#dbeafe', margin: '4px 0' }}>Tỷ lệ ăn 1 : 1</div>
            {selectedBet === 'player' && (
              <div className="badge-green" style={{ display: 'inline-block', marginTop: '6px' }}>
                Đã cược: {chipAmount.toLocaleString()} Xu
              </div>
            )}
          </button>

          <button
            disabled={gameState !== 'betting'}
            onClick={() => handleBetChoice('tie')}
            style={{
              background: selectedBet === 'tie' ? 'linear-gradient(135deg, #059669, #047857)' : 'rgba(20, 40, 30, 0.6)',
              border: `2px solid ${selectedBet === 'tie' ? '#34d399' : 'rgba(16, 185, 129, 0.4)'}`,
              borderRadius: '16px',
              padding: '20px 16px',
              color: '#ffffff',
              cursor: gameState === 'betting' ? 'pointer' : 'not-allowed',
              textAlign: 'center',
              boxShadow: selectedBet === 'tie' ? '0 0 25px rgba(16, 185, 129, 0.6)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6ee7b7' }}>CỬA HÒA (TIE)</div>
            <div style={{ fontSize: '0.8rem', color: '#d1fae5', margin: '4px 0' }}>Tỷ lệ ăn 1 : 8</div>
            {selectedBet === 'tie' && (
              <div className="badge-green" style={{ display: 'inline-block', marginTop: '6px' }}>
                Đã cược: {chipAmount.toLocaleString()} Xu
              </div>
            )}
          </button>

          <button
            disabled={gameState !== 'betting'}
            onClick={() => handleBetChoice('banker')}
            style={{
              background: selectedBet === 'banker' ? 'linear-gradient(135deg, #dc2626, #991b1b)' : 'rgba(60, 20, 30, 0.6)',
              border: `2px solid ${selectedBet === 'banker' ? '#f87171' : 'rgba(239, 68, 68, 0.4)'}`,
              borderRadius: '16px',
              padding: '20px 16px',
              color: '#ffffff',
              cursor: gameState === 'betting' ? 'pointer' : 'not-allowed',
              textAlign: 'center',
              boxShadow: selectedBet === 'banker' ? '0 0 25px rgba(239, 68, 68, 0.6)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fca5a5' }}>CỬA CÁI (BANKER)</div>
            <div style={{ fontSize: '0.8rem', color: '#fee2e2', margin: '4px 0' }}>Tỷ lệ ăn 1 : 0.95</div>
            {selectedBet === 'banker' && (
              <div className="badge-green" style={{ display: 'inline-block', marginTop: '6px' }}>
                Đã cược: {chipAmount.toLocaleString()} Xu
              </div>
            )}
          </button>
        </div>

        {/* History Roadmap */}
        {history.length > 0 && (
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 700 }}>LỊCH SỬ VÒNG:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {history.map((h, idx) => (
                <div key={idx} style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: h === 'player' ? '#2563eb' : h === 'banker' ? '#dc2626' : '#059669',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {h === 'player' ? 'P' : h === 'banker' ? 'B' : 'T'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaccaratGame;
