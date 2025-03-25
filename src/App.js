import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import img1 from './김예빈1.png';
import img2 from './김예빈2.png';
import axios from 'axios';


const floatUp = keyframes`
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-50px) scale(1.5); }
`;
const crazyShake = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(10deg) scale(1.1); }
  50% { transform: rotate(-10deg) scale(1.2); }
  75% { transform: rotate(10deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
`;
const shake = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  20% { transform: translate(-5px, 0) rotate(-5deg); }
  40% { transform: translate(5px, 0) rotate(5deg); }
  60% { transform: translate(-5px, 0) rotate(-5deg); }
  80% { transform: translate(5px, 0) rotate(5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;
const flash = keyframes`
  0% { background: rgba(255, 0, 0, 0.8); }
  20% { background: rgba(255, 255, 0, 0.8); }
  40% { background: rgba(0, 255, 255, 0.8); }
  60% { background: rgba(0, 0, 255, 0.8); }
  80% { background: rgba(255, 0, 255, 0.8); }
  100% { background: rgba(255, 0, 0, 0.8); }
`;



const ComboFlash = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  animation: ${flash} 0.2s infinite;
  mix-blend-mode: difference;
`;

const Container = styled.div`
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 80px;
  position: relative;
  cursor: url('/images/김태현3.svg'), auto;
`;

const ComboText = styled.div`
  font-size: 3rem;
  color: #ff0;
  font-weight: bold;
  animation: ${crazyShake} 0.2s infinite;
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
`;

const CountText = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const WinnerText = styled.h2`
  font-size: 1.3rem;
  color: #007bff;
  margin-bottom: 1rem;
`;

const MyClassText = styled.div`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #555;
`;

const ClickableImage = styled.img`
  width: 300px;
  height: auto;
  cursor: url('/images/김태현3.svg'), auto;
  transition: 0.2s;
  &.shaking {
    animation: ${shake} 0.5s ease;
  }
`;

const Heart = styled.div`
  position: absolute;
  pointer-events: none;
  font-size: 2rem;
  animation: ${floatUp} 1s ease forwards;
  user-select: none;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  transform: translate(-50%, -50%);
  z-index: 100;
`;

const FixedBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  border-top: 1px solid #ddd;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  transition: background 0.3s;

  &:hover {
    background: #f0f0f0;
  }
`;

const SlideUpRanking = styled.div`
  position: fixed;
  bottom: ${props => (props.$visible ? '0' : '-100%')};
  left: 0;
  width: 100%;
  max-height: 70vh;
  background: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  padding: 2rem 1rem;
  transition: bottom 0.4s ease;
  z-index: 20;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;

const ClassBox = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  font-weight: bold;
`;

const BackgroundFlash = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  background: repeating-linear-gradient(
    45deg,
    rgba(255,0,0,0.3),
    rgba(255,0,0,0.3) 10px,
    rgba(255,255,255,0.1) 10px,
    rgba(255,255,255,0.1) 20px
  );
  animation: ${flash} 0.4s infinite;
  pointer-events: none;
`;

const ComboBarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: #ddd;
  z-index: 200;
`;
const ComboBar = styled.div`
  height: 100%;
  background: ${props => (props.$active ? '#ff5252' : '#4caf50')};
  width: ${props => props.progress}%;
  transition: width 0.2s ease;
`;

function App() {
  const [userGrade, setUserGrade] = useState(null);
  const [userClass, setUserClass] = useState(null);
  const [tempGrade, setTempGrade] = useState('');
  const [tempClass, setTempClass] = useState('');
  console.log(import.meta.env);
  const [isSecondImage, setIsSecondImage] = useState(false);
  const [timer, setTimer] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [classCounts, setClassCounts] = useState(Array(3).fill(null).map(() => Array(4).fill(0)));
  const [isShaking, setIsShaking] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [clickStreak, setClickStreak] = useState(0);
  const [comboActive, setComboActive] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(Date.now());


  const gradeMap = {
    1: 'firstGrade',
    2: 'secondGrade',
    3: 'thirdGrade'
  };
  
  const classMap = {
    1: 'firstClass',
    2: 'secondClass',
    3: 'thiredClass', // 백엔드 오타 반영
    4: 'fourthClass'
  };
// 처음 렌더 시점에 localStorage에서 읽어오기
useEffect(() => {
  const saved = localStorage.getItem('myTotalClickCount');
  if (saved !== null) {
    setTotalCount(parseInt(saved));
  }
}, []);

// totalCount가 바뀔 때마다 localStorage에 쓰기
useEffect(() => {
  localStorage.setItem('myTotalClickCount', totalCount.toString());
}, [totalCount]);

const baseURL = process.env.REACT_APP_API_URL;

 useEffect(() => {
  axios
    .get(`${baseURL}/all`)
    .then(res => {
      const data = res.data;

      const counts = Array(3).fill(null).map(() => Array(4).fill(0));

      const gradeIndex = {
        firstGrade: 0,
        secondGrade: 1,
        thirdGrade: 2,
      };
      const classIndex = {
        firstClass: 0,
        secondClass: 1,
        thiredClass: 2,
        fourthClass: 3,
      };

      data.forEach(({ grade, ban, clickCount }) => {
        const g = gradeIndex[grade];
        const c = classIndex[ban];
        if (g !== undefined && c !== undefined) {
          counts[g][c] = clickCount;
        }
      });

      setClassCounts(counts);
    })
    .catch(err => console.error('전체 데이터 실패:', err));
}, []);


  // 유저 저장된 학년/반 불러오기
  useEffect(() => {
    const savedGrade = localStorage.getItem('userGrade');
    const savedClass = localStorage.getItem('userClass');
    if (savedGrade && savedClass) {
      setUserGrade(parseInt(savedGrade));
      setUserClass(parseInt(savedClass));
    }
  }, []);

  useEffect(() => {
    if (userGrade && userClass) {
      const gradeKey = gradeMap[userGrade];
      const classKey = classMap[userClass];
      
      axios.get(`${baseURL}/${gradeKey}/${classKey}`)
        .then(res => {
          const count = res.data.clickCount;
          setClassCounts(prev => {
            const updated = prev.map(row => [...row]);
            updated[userGrade - 1][userClass - 1] = count;
            return updated;
          });
        })
        .catch(err => console.error('내 반 데이터 실패:', err));
    }
  }, [userGrade, userClass]);
  

  // 콤보 게이지 감소
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (!comboActive && now - lastClickTime > 3000 && clickStreak > 0) {
        setClickStreak(prev => Math.max(prev - 10, 0));
      } else if (comboActive) {
        setClickStreak(prev => {
          const next = Math.max(prev - 20, 0);
          if (next <= 0) setComboActive(false);
          return next;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [comboActive, clickStreak, lastClickTime]);


const handleClick = (e) => {
  if (userGrade === null || userClass === null) return;

  const now = Date.now();
  if (!comboActive) setLastClickTime(now);

  setClickStreak(prev => {
    if (comboActive) return prev;
    const next = prev + 1;
    if (next >= 100) {
      setComboActive(true);
      return 100;
    }
    return next;
  });

  const increment = comboActive ? 2 : 1;

  setTotalCount(prev => prev + increment);

    const gradeKey = gradeMap[userGrade];
    const classKey = classMap[userClass];
    
    axios.post(`${baseURL}/${gradeKey}/${classKey}`, {
      clickCount: increment
    }).catch(err => console.error('POST 실패:', err));
    
    setIsSecondImage(true);
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => setIsSecondImage(false), 3000));

    setClassCounts(prev => {
      const updated = prev.map(row => [...row]);
      updated[userGrade - 1][userClass - 1] += increment;
      return updated;
    });

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    const heartCount = comboActive ? 5 : 1;
    const newHearts = Array.from({ length: heartCount }).map((_, i) => ({
      id: Date.now() + i,
      x: e.clientX + Math.random() * 40 - 20,
      y: e.clientY + Math.random() * 40 - 20
    }));
    setHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.some(nh => nh.id === h.id)));
    }, 1000);
  };

  const handleSaveUserInfo = () => {
    if (tempGrade && tempClass) {
      localStorage.setItem('userGrade', tempGrade);
      localStorage.setItem('userClass', tempClass);
      setUserGrade(parseInt(tempGrade));
      setUserClass(parseInt(tempClass));
    }
  };

  const findTopClass = () => {
    let max = 0;
    let top = { grade: 1, classNum: 1 };
    classCounts.forEach((gradeRow, gIdx) => {
      if (!Array.isArray(gradeRow)) return; // 배열이 아닐 경우 건너뜀
      gradeRow.forEach((count, cIdx) => {
        if (count > max) {
          max = count;
          top = { grade: gIdx + 1, classNum: cIdx + 1 };
        }
      });
    });
    return `${top.grade}학년 ${top.classNum}반`;
  };
  const comboProgress = Math.min((clickStreak / 100) * 100, 100);

  if (userGrade === null || userClass === null) {
    return (
      <Container>
        <TopSection>
          <h2>당신의 학년과 반을 입력해주세요</h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <select value={tempGrade} onChange={e => setTempGrade(e.target.value)}>
              <option value="">학년 선택</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
            </select>
            <select value={tempClass} onChange={e => setTempClass(e.target.value)}>
              <option value="">반 선택</option>
              <option value="1">1반</option>
              <option value="2">2반</option>
              <option value="3">3반</option>
              <option value="4">4반</option>
            </select>
          </div>
          <button
            onClick={handleSaveUserInfo}
            style={{ marginTop: '1.5rem', padding: '0.5rem 1rem' }}
          >
            시작하기
          </button>
        </TopSection>
      </Container>
    );
  }

  return (
    <Container onClick={handleClick}>
      {comboActive && <ComboFlash />}
      {comboActive && <ComboText>🔥콤보!!🔥</ComboText>}
      {comboActive && <BackgroundFlash />}
      <ComboBarWrapper>
      <ComboBar progress={comboProgress} $active={comboActive} />
      </ComboBarWrapper>
      <TopSection>
        <CountText>총 클릭 수: {totalCount}</CountText>
        <WinnerText>🔥 현재 1등: {findTopClass()}</WinnerText>
        <MyClassText>
          🎯 내 반: {userGrade}학년 {userClass}반 ({classCounts[userGrade - 1][userClass - 1]}회)
        </MyClassText>
        <ClickableImage
          className={isShaking ? 'shaking' : ''}
          src={isSecondImage ? img2 : img1}
          alt="클릭 이미지"
        />
      </TopSection>
      {hearts.map((h) => (
        <Heart key={h.id} x={h.x} y={h.y}>❤️</Heart>
      ))}
      <FixedBar onClick={() => setShowRanking(true)}>📊 전체 반 순위 보기</FixedBar>
      <SlideUpRanking $visible={showRanking}>
        <h2 style={{ textAlign: 'center' }}>전체 반 클릭 순위</h2>
        <Grid>
  {classCounts.map((grade, gIdx) => {
    if (!Array.isArray(grade)) return null;

    return grade.map((cnt, cIdx) => (
      <ClassBox key={`${gIdx}-${cIdx}`}>
        {gIdx + 1}학년 {cIdx + 1}반<br />
        {cnt}회
      </ClassBox>
    ));
  })}
</Grid>


        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={() => setShowRanking(false)}>닫기</button>
        </div>
      </SlideUpRanking>
    </Container>
  );
}

export default App;
