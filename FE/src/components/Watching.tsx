import React, { useState, useRef, useEffect } from 'react';

const items = [
  {
    type: 'mv',
    title: 'Perfect (Ed Sheeran)',
    video: 'https://www.youtube.com/embed/2Vv-BfVoq4g',
    thumbnail: 'https://img.youtube.com/vi/2Vv-BfVoq4g/hqdefault.jpg',
    lyrics: `I found a love for me... Darling just dive right in and follow my lead... Well I found a girl, beautiful and sweet... (full lyrics here)`
  },
  {
    type: 'mv',
    title: 'See You Again (Wiz Khalifa ft. Charlie Puth)',
    video: 'https://www.youtube.com/embed/RgKAFK5djSk',
    thumbnail: 'https://img.youtube.com/vi/RgKAFK5djSk/hqdefault.jpg',
    lyrics: `It's been a long day without you, my friend... And I'll tell you all about it when I see you again... (full lyrics here)`
  },
  {
    type: 'movie',
    title: 'The Pursuit of Happyness (Trailer)',
    video: 'https://www.youtube.com/embed/89Kq8SDyvfg',
    thumbnail: 'https://img.youtube.com/vi/89Kq8SDyvfg/hqdefault.jpg',
    lyrics: `Movie script or memorable lines go here... (full script here)`
  },
];

const statCards = [
  { label: "Watched Videos", value: 3, desc: "+1 this week" },
  { label: "Favorite Genre", value: "Music Videos", desc: "Based on your activity" },
  { label: "Learning Streak", value: "2 days", desc: "Keep it up!" },
];

const tabs = [
  { label: "All Content", value: "all" },
  { label: "Movies", value: "movie" },
  { label: "Songs", value: "mv" },
];

// Retro notification style
const retroToastStyle: React.CSSProperties = {
  position: 'fixed',
  top: 40,
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#222',
  color: '#fff',
  border: '2px solid #ffcc00',
  borderRadius: 8,
  padding: '1rem 2rem',
  fontFamily: 'monospace',
  fontSize: '1.1rem',
  zIndex: 2000,
  boxShadow: '0 4px 24px #0008',
  textShadow: '1px 1px 0 #ffcc00',
  letterSpacing: 1,
  animation: 'retroPop 0.3s',
};

const Watching = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showSave, setShowSave] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const lyricsRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{msg: string, key: number}|null>(null);

  const filteredItems = activeTab === 'all' ? items : items.filter(i => i.type === activeTab);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (lyricsRef.current && lyricsRef.current.contains(range.commonAncestorContainer)) {
          const text = selection.toString().trim();
          setSelectedText(text);
          setShowSave(!!text);
        } else {
          setShowSave(false);
        }
      } else {
        setShowSave(false);
      }
    };
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, []);

  const handleSave = () => {
    if (selectedText) {
      // Save to localStorage vocabBank
      const stored = localStorage.getItem('vocabBank');
      let words: any[] = [];
      if (stored) {
        try { words = JSON.parse(stored); } catch {}
      }
      // Check for duplicate
      if (words.some(w => w.meaning === selectedText)) {
        setToast({msg: 'Already in Vocab Bank!', key: Date.now()});
      } else {
        // Find example sentence
        let example = 'Saved from video';
        if (selected !== null) {
          const item = filteredItems[selected];
          const text = item.lyrics;
          // Find the sentence containing the selected text
          const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
          const found = sentences.find(s => s.toLowerCase().includes(selectedText.toLowerCase()));
          if (found) {
            example = found.trim();
          }
        }
        const newWord = {
          meaning: selectedText,
          example,
        };
        const updated = [newWord, ...words];
        localStorage.setItem('vocabBank', JSON.stringify(updated));
        setToast({msg: 'Saved to Vocab Bank!', key: Date.now()});
      }
      setShowSave(false);
      window.getSelection()?.removeAllRanges();
    }
  };

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (selected !== null) {
    const item = filteredItems[selected];
    return (
      <div style={{ maxWidth: 800, margin: '3rem auto', padding: '2rem', background: '#fff', borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', position: 'relative' }}>
        {toast && (
          <div style={retroToastStyle} key={toast.key}>{toast.msg}</div>
        )}
        <button onClick={() => setSelected(null)} style={{ marginBottom: 24, background: '#f5f5f5', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', cursor: 'pointer', fontWeight: 500 }}>Back</button>
        <h2 style={{ marginBottom: 24 }}>{item.title}</h2>
        <iframe
          width="100%"
          height="400"
          src={item.video}
          title={item.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: 16, marginBottom: 32 }}
        ></iframe>
        <div ref={lyricsRef} style={{ background: '#f8f9fb', borderRadius: 12, padding: '1.5rem', fontSize: '1.1rem', color: '#333', whiteSpace: 'pre-line', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minHeight: 120 }}>
          {item.lyrics}
        </div>
        {showSave && selectedText && (
          <button
            onClick={handleSave}
            style={{
              position: 'fixed',
              left: '50%',
              top: '80%',
              transform: 'translate(-50%, 0)',
              background: '#16a085',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 1.5rem',
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              zIndex: 1000,
              cursor: 'pointer',
              marginTop: 16
            }}
          >
            Save to Vocab Bank
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ background: '#f7f9fb', minHeight: '100vh', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem 0 2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 8 }}>Welcome back!</h1>
        <div style={{ color: '#5c5c5c', fontSize: '1.1rem', marginBottom: 32 }}>Continue your learning journey with videos and movies</div>
        {/* Stat Cards */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 40, flexWrap: 'wrap' }}>
          {statCards.map(card => (
            <div key={card.label} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '2rem 2.5rem', minWidth: 220, flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '1.15rem', marginBottom: 12 }}>{card.label}</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#16a085', marginBottom: 6 }}>{card.value}</div>
              <div style={{ color: '#6c757d', fontSize: '1rem' }}>{card.desc}</div>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 32, borderBottom: '1.5px solid #e5e7eb', marginBottom: 24 }}>
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                fontWeight: 500,
                fontSize: '1.1rem',
                color: activeTab === tab.value ? '#16a085' : '#444',
                borderBottom: activeTab === tab.value ? '2.5px solid #16a085' : '2.5px solid transparent',
                padding: '0.7rem 0',
                cursor: 'pointer',
                transition: 'color 0.2s, border-bottom 0.2s',
                marginBottom: -1.5
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {filteredItems.map((item, idx) => (
          <div key={item.title} style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s', minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={() => setSelected(idx)}>
            <img src={item.thumbnail} alt={item.title} style={{ width: 260, height: 146, objectFit: 'cover', borderRadius: 16, marginBottom: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />
            <div style={{ fontWeight: 700, fontSize: '1.15rem', marginTop: 12 }}>{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watching; 