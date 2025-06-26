import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const Bg = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f9fb 0%, #e6f0fa 100%);
  padding: 2rem 0;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 600px;
  margin: 0 auto 2rem auto;
`;

const Progress = styled.div`
  font-size: 1.1rem;
  color: #888;
`;

const SettingsBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: #888;
`;

const FlashcardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 320px;
`;

const Card = styled.div<{flipped: boolean}>`
  width: 380px;
  height: 220px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 500;
  position: relative;
  perspective: 1000px;
  cursor: pointer;
  transition: box-shadow 0.2s;
  user-select: none;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'none'};
`;

const CardFace = styled.div<{back?: boolean}>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: #fff;
  color: #222;
  font-size: 1.3rem;
  padding: 1.5rem;
  box-sizing: border-box;
  ${props => props.back && `transform: rotateY(180deg); background: #f7f9fb; color: #764ba2;`}
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ActionBtn = styled.button`
  background: #1abc9c;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  &:hover { background: #16a085; transform: translateY(-2px); }
`;

const NavBtn = styled(ActionBtn)`
  background: #b39ddb;
  &:hover { background: #9575cd; }
`;

const Flashcard = () => {
  const [words, setWords] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [review, setReview] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('vocabBank');
    if (stored) {
      setWords(JSON.parse(stored));
    }
  }, []);

  if (words.length === 0) {
    return <Bg><div style={{textAlign:'center',marginTop:'4rem'}}>No words in your vocab bank yet.</div></Bg>;
  }

  const word = words[idx];

  const handleFlip = () => setFlipped(f => !f);
  const handlePrev = () => { setIdx(i => Math.max(0, i-1)); setFlipped(false); };
  const handleNext = () => { setIdx(i => Math.min(words.length-1, i+1)); setFlipped(false); };
  const handleKnown = () => setKnown(prev => new Set(Array.from(prev).concat(idx)));
  const handleReview = () => setReview(prev => new Set(Array.from(prev).concat(idx)));

  return (
    <Bg>
      <TopBar>
        <Progress>{idx+1} / {words.length}</Progress>
        <SettingsBtn title="Back to Dashboard" onClick={()=>navigate('/dashboard')}>⚙️</SettingsBtn>
      </TopBar>
      <FlashcardContainer>
        <Card flipped={flipped} onClick={handleFlip} title="Click to flip">
          <CardFace>{word.meaning}</CardFace>
          <CardFace back>{word.example || word.enDef || word.viDef || 'No example/definition.'}</CardFace>
        </Card>
      </FlashcardContainer>
      <Actions>
        <NavBtn onClick={handlePrev} disabled={idx===0}>←</NavBtn>
        <ActionBtn onClick={handleKnown} style={{background:'#16a085'}}>Known</ActionBtn>
        <ActionBtn onClick={handleReview} style={{background:'#ffd700', color:'#333'}}>Review</ActionBtn>
        <NavBtn onClick={handleNext} disabled={idx===words.length-1}>→</NavBtn>
      </Actions>
    </Bg>
  );
};

export default Flashcard; 