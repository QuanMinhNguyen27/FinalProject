import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const Container = styled.div`
  max-width: 900px;
  margin: 3rem auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 2.5rem 2rem;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  border-bottom: 2px solid ${props => (props.active ? '#1abc9c' : 'transparent')};
  color: ${props => (props.active ? '#1abc9c' : '#888')};
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.5rem 0;
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`;

const ContentCard = styled.div`
  background: #f8f9fb;
  border-radius: 12px;
  padding: 1.2rem 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ContentTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const ContentDesc = styled.p`
  color: #888;
  margin-bottom: 1rem;
`;

const WatchButton = styled.a`
  background: #1abc9c;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.4rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
  &:hover {
    background: #16a085;
  }
`;

const BackButton = styled.button`
  background: #e6f4ea;
  color: #1abc9c;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 2rem;
  &:hover {
    background: #1abc9c;
    color: #fff;
  }
`;

const contentData = [
  { type: 'movie', title: 'The Social Network', desc: 'Learn English through this drama movie.', url: '#' },
  { type: 'movie', title: 'Inception', desc: 'Explore complex ideas in English.', url: '#' },
  { type: 'song', title: 'Shape of You', desc: 'Learn English through popular songs', url: '#' },
  { type: 'song', title: 'Let It Go', desc: 'Practice English with Disney songs.', url: '#' },
  { type: 'song', title: 'See You Again', desc: 'Learn English with emotional lyrics.', url: '#' },
  { type: 'mv', title: 'BLACKPINK - How You Like That (MV)', desc: 'Watch and learn English with this K-pop music video.', url: 'https://www.youtube.com/watch?v=ioNng23DkIM' },
  { type: 'mv', title: 'Wiz Khalifa - See You Again (MV)', desc: 'Watch and learn English with this emotional music video.', url: 'https://www.youtube.com/watch?v=RgKAFK5djSk' },
];

const tabOptions = [
  { label: 'All Content', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'Songs', value: 'song' },
];

const mvDataList = [
  {
    key: 'BLACKPINK - How You Like That (MV)',
    title: 'BLACKPINK - How You Like That (MV)',
    desc: 'Watch and learn English with this K-pop music video.',
    videoId: 'ioNng23DkIM',
    lyrics: `How you like that?\nYou gon\' like that\nHow you like that?\n...`,
  },
  {
    key: 'Wiz Khalifa - See You Again (MV)',
    title: 'Wiz Khalifa - See You Again (MV)',
    desc: 'Watch and learn English with this emotional music video.',
    videoId: 'RgKAFK5djSk',
    lyrics: `It's been a long day without you, my friend\nAnd I'll tell you all about it when I see you again\nWe've come a long way from where we began\nOh, I'll tell you all about it when I see you again\nWhen I see you again\n...`,
  },
];

const Watching = () => {
  const [tab, setTab] = useState('all');
  const [showMV, setShowMV] = useState<string | false>(false);
  const [highlighted, setHighlighted] = useState('');
  const [expandLyrics, setExpandLyrics] = useState(false);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const filteredContent = tab === 'all' ? contentData : contentData.filter(item => item.type === tab);

  // Save highlighted word to vocab bank (localStorage for now)
  const saveToVocabBank = () => {
    if (!highlighted) return;
    const vocab = JSON.parse(localStorage.getItem('vocabBank') || '[]');
    if (!vocab.some((w: any) => w.meaning === highlighted)) {
      vocab.unshift({ meaning: highlighted, example: '' });
      localStorage.setItem('vocabBank', JSON.stringify(vocab));
      setNotification(`Saved '${highlighted}' to Vocab Bank!`);
    } else {
      setNotification('Word already in Vocab Bank!');
    }
    setHighlighted('');
    setTimeout(() => setNotification(''), 2000);
  };

  // Handle text selection
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setHighlighted(selection.toString().trim());
    } else {
      setHighlighted('');
    }
  };

  if (showMV) {
    const mvData = mvDataList.find(mv => mv.key === showMV) || mvDataList[0];
    // Split lyrics into lines
    const lyricsLines = mvData.lyrics.split('\n');
    const visibleLyrics = expandLyrics ? lyricsLines : lyricsLines.slice(0, 4);
    return (
      <Container>
        <Title>{mvData.title}</Title>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: '2rem' }}>
          <iframe
            src={`https://www.youtube.com/embed/${mvData.videoId}`}
            title={mvData.title}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <ContentDesc
          as="div"
          style={{ whiteSpace: 'pre-line', cursor: 'text', background: '#f8f9fb', padding: '1rem', borderRadius: 8 }}
          onMouseUp={handleMouseUp}
        >
          {visibleLyrics.join('\n')}
        </ContentDesc>
        <button
          style={{ margin: '0.5rem 0', background: 'none', border: 'none', color: '#1abc9c', cursor: 'pointer', fontWeight: 500 }}
          onClick={() => setExpandLyrics(e => !e)}
        >
          {expandLyrics ? 'See less' : 'See more'}
        </button>
        {notification && (
          <div style={{ margin: '1rem 0', color: '#1abc9c', fontWeight: 500, background: '#e6f4ea', borderRadius: 8, padding: '0.5rem 1rem', textAlign: 'center' }}>
            {notification}
          </div>
        )}
        <BackButton onClick={() => { setShowMV(false); setHighlighted(''); setExpandLyrics(false); }}>Back to Watching List</BackButton>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Watching Content</Title>
      <Tabs>
        {tabOptions.map(option => (
          <Tab key={option.value} active={tab === option.value} onClick={() => setTab(option.value)}>
            {option.label}
          </Tab>
        ))}
      </Tabs>
      <ContentGrid>
        {filteredContent.map((item, idx) => (
          <ContentCard key={idx}>
            <ContentTitle>{item.title}</ContentTitle>
            <ContentDesc>{item.desc}</ContentDesc>
            {item.type === 'mv' ? (
              <WatchButton as="button" onClick={() => setShowMV(item.title)}>Watch</WatchButton>
            ) : (
              <WatchButton href={item.url} target="_blank" rel="noopener noreferrer">Watch</WatchButton>
            )}
          </ContentCard>
        ))}
      </ContentGrid>
      <BackButton onClick={() => navigate('/dashboard')}>Back to Dashboard</BackButton>
    </Container>
  );
};

export default Watching; 