import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const Container = styled.div`
  max-width: 700px;
  margin: 3rem auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 2.5rem 2rem;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const WordList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
`;

const WordItem = styled.li`
  background: #f8f9fb;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
`;

const AddForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const AddInput = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 1rem;
`;

const AddButton = styled.button`
  background: #1abc9c;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
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
  &:hover {
    background: #1abc9c;
    color: #fff;
  }
`;

type VocabWord = {
  meaning: string;
  example: string;
  enDef?: string;
  viDef?: string;
};

const VocabBank = () => {
  const [words, setWords] = useState<VocabWord[]>(() => {
    const stored = localStorage.getItem('vocabBank');
    if (stored) return JSON.parse(stored);
    return [
      { meaning: 'hello', example: 'She said hello to everyone.' },
      { meaning: 'world', example: 'The world is round.' },
      { meaning: 'react', example: 'I use React for web apps.' },
      { meaning: 'dashboard', example: 'The dashboard shows your stats.' }
    ];
  });
  const [search, setSearch] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newEnDef, setNewEnDef] = useState('');
  const [newViDef, setNewViDef] = useState('');
  const [newExample, setNewExample] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editWord, setEditWord] = useState<VocabWord | null>(null);
  const navigate = useNavigate();

  const filteredWords = words.filter(word =>
    word.meaning.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newMeaning &&
      newEnDef &&
      newViDef &&
      newExample &&
      !words.some(w => w.meaning === newMeaning)
    ) {
      const updated = [
        { meaning: newMeaning, example: newExample },
        ...words
      ];
      setWords(updated);
      localStorage.setItem('vocabBank', JSON.stringify(updated));
      setNewMeaning('');
      setNewExample('');
    }
  };

  const pronounceWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new window.SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support speech synthesis.');
    }
  };

  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditWord(words[idx]);
  };

  const handleEditChange = (field: keyof VocabWord, value: string) => {
    if (!editWord) return;
    setEditWord({ ...editWord, [field]: value });
  };

  const handleEditSave = () => {
    if (editIdx === null || !editWord) return;
    const updated = words.map((w, idx) => idx === editIdx ? editWord : w);
    setWords(updated);
    localStorage.setItem('vocabBank', JSON.stringify(updated));
    setEditIdx(null);
    setEditWord(null);
  };

  const handleEditCancel = () => {
    setEditIdx(null);
    setEditWord(null);
  };

  return (
    <Container>
      <Title>Vocab Bank</Title>
      <SearchInput
        type="text"
        placeholder="Search words..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <AddForm onSubmit={handleAdd}>
        <AddInput
          type="text"
          placeholder="Word"
          value={newMeaning}
          onChange={e => setNewMeaning(e.target.value)}
          required
        />
        <AddInput
          type="text"
          placeholder="Example"
          value={newExample}
          onChange={e => setNewExample(e.target.value)}
          required
        />
        <AddButton type="submit">Add</AddButton>
      </AddForm>
      <WordList>
        {filteredWords.map((word, idx) => (
          <WordItem key={idx}>
            {editIdx === idx && editWord ? (
              <>
                <AddInput
                  type="text"
                  value={editWord.meaning}
                  onChange={e => handleEditChange('meaning', e.target.value)}
                  style={{ marginBottom: 4 }}
                />
                <AddInput
                  type="text"
                  value={editWord.enDef || ''}
                  onChange={e => handleEditChange('enDef', e.target.value)}
                  placeholder="English Definition"
                  style={{ marginBottom: 4 }}
                />
                <AddInput
                  type="text"
                  value={editWord.viDef || ''}
                  onChange={e => handleEditChange('viDef', e.target.value)}
                  placeholder="Vietnamese Definition"
                  style={{ marginBottom: 4 }}
                />
                <AddInput
                  type="text"
                  value={editWord.example}
                  onChange={e => handleEditChange('example', e.target.value)}
                  placeholder="Example"
                  style={{ marginBottom: 4 }}
                />
                <AddButton type="button" onClick={handleEditSave} style={{ marginRight: 8 }}>Save</AddButton>
                <AddButton type="button" onClick={handleEditCancel} style={{ background: '#eee', color: '#1abc9c' }}>Cancel</AddButton>
              </>
            ) : (
              <>
                <button onClick={() => pronounceWord(word.meaning)} style={{marginRight: '1rem'}}>🔊 Pronounce</button>
                <strong>{word.meaning}</strong>
                {word.enDef && <div><em>English:</em> {word.enDef}</div>}
                {word.viDef && <div><em>Vietnamese:</em> {word.viDef}</div>}
                <div><em>Example:</em> {word.example}</div>
                <AddButton type="button" onClick={() => handleEdit(idx)} style={{ marginTop: 8, background: '#eee', color: '#1abc9c' }}>Edit</AddButton>
              </>
            )}
          </WordItem>
        ))}
      </WordList>
      <BackButton onClick={() => navigate('/dashboard')}>Back to Dashboard</BackButton>
    </Container>
  );
};

export default VocabBank; 