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
  padding: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  border-left: 4px solid #1abc9c;
`;

const WordHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const WordTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WordText = styled.strong`
  font-size: 1.3rem;
  color: #2c3e50;
`;

const WordActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: #1abc9c;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #16a085;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: #95a5a6;
  &:hover {
    background: #7f8c8d;
  }
`;

const DefinitionSection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ecf0f1;
`;

const DefinitionTitle = styled.h4`
  color: #34495e;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const DefinitionText = styled.p`
  color: #2c3e50;
  line-height: 1.5;
  margin: 0.5rem 0;
`;

const ExampleText = styled.div`
  font-style: italic;
  color: #7f8c8d;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #1abc9c;
`;

const LoadingText = styled.div`
  color: #7f8c8d;
  font-style: italic;
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
`;

const AddForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const AddInput = styled.input`
  flex: 1;
  min-width: 200px;
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
  pronunciation?: string;
  partOfSpeech?: string;
  synonyms?: string[];
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
  const [loadingWords, setLoadingWords] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const filteredWords = words.filter(word =>
    word.meaning.toLowerCase().includes(search.toLowerCase())
  );

  const fetchWordDefinition = async (word: string, index: number) => {
    setLoadingWords(prev => new Set(prev).add(index));
    
    try {
      // Using Free Dictionary API
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data[0]) {
          const wordData = data[0];
          const meanings = wordData.meanings || [];
          const phonetics = wordData.phonetics || [];
          
          const updatedWord: VocabWord = {
            ...words[index],
            enDef: meanings.map((m: any) => `${m.partOfSpeech}: ${m.definitions?.[0]?.definition || 'No definition available'}`).join('; '),
            pronunciation: phonetics[0]?.text || '',
            partOfSpeech: meanings[0]?.partOfSpeech || '',
            synonyms: meanings.flatMap((m: any) => m.synonyms || []).slice(0, 5)
          };
          
          const updatedWords = words.map((w, i) => i === index ? updatedWord : w);
          setWords(updatedWords);
          localStorage.setItem('vocabBank', JSON.stringify(updatedWords));
        }
      } else {
        console.log(`No definition found for "${word}"`);
      }
    } catch (error) {
      console.error('Error fetching definition:', error);
    } finally {
      setLoadingWords(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newMeaning &&
      newExample &&
      !words.some(w => w.meaning === newMeaning)
    ) {
      const newWord: VocabWord = {
        meaning: newMeaning,
        example: newExample,
        enDef: newEnDef || undefined,
        viDef: newViDef || undefined
      };
      
      const updated = [newWord, ...words];
      setWords(updated);
      localStorage.setItem('vocabBank', JSON.stringify(updated));
      setNewMeaning('');
      setNewEnDef('');
      setNewViDef('');
      setNewExample('');
    }
  };

  const pronounceWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new window.SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
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
          placeholder="English Definition (optional)"
          value={newEnDef}
          onChange={e => setNewEnDef(e.target.value)}
        />
        <AddInput
          type="text"
          placeholder="Vietnamese Definition (optional)"
          value={newViDef}
          onChange={e => setNewViDef(e.target.value)}
        />
        <AddInput
          type="text"
          placeholder="Example"
          value={newExample}
          onChange={e => setNewExample(e.target.value)}
          required
        />
        <AddButton type="submit">Add Word</AddButton>
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
                <ActionButton type="button" onClick={handleEditSave} style={{ marginRight: 8 }}>Save</ActionButton>
                <SecondaryButton type="button" onClick={handleEditCancel}>Cancel</SecondaryButton>
              </>
            ) : (
              <>
                <WordHeader>
                  <WordTitle>
                    <WordText>{word.meaning}</WordText>
                    {word.pronunciation && (
                      <span style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                        /{word.pronunciation}/
                      </span>
                    )}
                  </WordTitle>
                  <WordActions>
                    <ActionButton onClick={() => pronounceWord(word.meaning)}>
                      🔊
                    </ActionButton>
                    {!word.enDef && (
                      <ActionButton onClick={() => fetchWordDefinition(word.meaning, idx)}>
                        {loadingWords.has(idx) ? '⏳' : '📖'}
                      </ActionButton>
                    )}
                    <SecondaryButton onClick={() => handleEdit(idx)}>
                      ✏️
                    </SecondaryButton>
                  </WordActions>
                </WordHeader>
                
                {loadingWords.has(idx) && (
                  <LoadingText>Loading definition...</LoadingText>
                )}
                
                {word.enDef && (
                  <DefinitionSection>
                    <DefinitionTitle>English Definition:</DefinitionTitle>
                    <DefinitionText>{word.enDef}</DefinitionText>
                  </DefinitionSection>
                )}
                
                {word.viDef && (
                  <DefinitionSection>
                    <DefinitionTitle>Vietnamese Definition:</DefinitionTitle>
                    <DefinitionText>{word.viDef}</DefinitionText>
                  </DefinitionSection>
                )}
                
                {word.synonyms && word.synonyms.length > 0 && (
                  <DefinitionSection>
                    <DefinitionTitle>Synonyms:</DefinitionTitle>
                    <DefinitionText>{word.synonyms.join(', ')}</DefinitionText>
                  </DefinitionSection>
                )}
                
                <ExampleText>
                  <strong>Example:</strong> {word.example}
                </ExampleText>
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