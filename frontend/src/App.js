import React, { useState } from 'react';
// You can remove the logo import if you're not using it
// import logo from './logo.svg';
import './App.css';

function App() {
  const [resume, setResume] = useState(null);
  const [job, setJob] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resume || !job) {
      alert('Please upload both files');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job', job);

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Resume Analyzer</h1>

      <input type="file" accept="application/pdf" onChange={e => setResume(e.target.files[0])} />
      <input type="file" accept="application/pdf" onChange={e => setJob(e.target.files[0])} />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {result && (
        <div>
          <h2>Match Score: {result.match_score}</h2>

          <h3>Matched Keywords</h3>
          <ul>{result.matched_keywords.map((k, i) => <li key={i}>{k}</li>)}</ul>

          <h3>Missing Keywords</h3>
          <ul>{result.missing_keywords.map((k, i) => <li key={i}>{k}</li>)}</ul>

          <h3>AI Feedback</h3>
          <pre>{result.ai_feedback}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
