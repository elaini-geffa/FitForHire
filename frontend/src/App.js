import React, { useState } from 'react';

function App() {
  const [resume, setResume] = useState(null);
  const [job, setJob] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApplication, setNewApplication] = useState({
    company: '',
    position: '',
    dateApplied: '',
    status: 'applying'
  });

  const statusOptions = [
    'applying',
    'applied',
    'interviewing',
    'followup',
    'accepted',
    'rejected',
    'no longer interested',
    'ghosted'
  ];

  const getStatusColor = (status) => {
    const colors = {
      'applying': '#6b7280',
      'applied': '#2563eb',
      'interviewing': '#d97706',
      'followup': '#7c3aed',
      'rejected': '#dc2626',
      'no longer interested': '#6b7280',
      'ghosted': '#374151'
    };
    return colors[status] || '#6b7280';
  };

  const handleAddApplication = () => {
    if (newApplication.company && newApplication.position) {
      setApplications([...applications, {
        ...newApplication,
        id: Date.now(),
        dateApplied: newApplication.dateApplied || new Date().toISOString().split('T')[0]
      }]);
      setNewApplication({ company: '', position: '', dateApplied: '', status: 'applying' });
      setShowAddForm(false);
    }
  };

  const updateApplicationStatus = (id, newStatus) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const deleteApplication = (id) => {
    setApplications(applications.filter(app => app.id !== id));
  };

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
      const response = await fetch('http://127.0.0.1:5000/analyze', {
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

  const getScoreClass = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    return 'poor';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent Match!';
    if (score >= 60) return 'Good Match';
    return 'Needs Improvement';
  };

  const styles = {
    appContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #e0e7ff 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#374151',
    },
    header: {
      background: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e5e7eb',
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 1.5rem',
      textAlign: 'center',
    },
    logoContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    logo: {
      background: '#2563eb',
      padding: '0.75rem',
      borderRadius: '0.75rem',
      color: 'white',
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#6b7280',
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 1.5rem',
    },
    uploadSection: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      padding: '2rem',
      marginBottom: '2rem',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
    },
    sectionIcon: {
      width: '1.5rem',
      height: '1.5rem',
      marginRight: '0.75rem',
      color: '#2563eb',
    },
    uploadGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    uploadItem: {
      display: 'flex',
      flexDirection: 'column',
    },
    uploadLabel: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem',
    },
    uploadIcon: {
      width: '1rem',
      height: '1rem',
      marginRight: '0.5rem',
      color: '#6b7280',
    },
    fileInput: {
      display: 'block',
      width: '100%',
      fontSize: '0.875rem',
      color: '#6b7280',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      padding: '0.75rem',
      transition: 'all 0.2s',
      cursor: 'pointer',
    },
    fileSuccess: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.875rem',
      color: '#059669',
      background: '#ecfdf5',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      marginTop: '0.75rem',
    },
    successIcon: {
      width: '1rem',
      height: '1rem',
      marginRight: '0.5rem',
    },
    analyzeButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '2rem',
    },
    analyzeButton: {
      background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
      color: 'white',
      fontWeight: '600',
      padding: '1rem 2rem',
      borderRadius: '0.75rem',
      border: 'none',
      fontSize: '1.125rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s',
      transform: 'translateY(0)',
    },
    analyzeButtonHover: {
      background: 'linear-gradient(135deg, #1d4ed8, #4338ca)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)',
    },
    analyzeButtonDisabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
    buttonIcon: {
      width: '1.25rem',
      height: '1.25rem',
      marginRight: '0.75rem',
    },
    // Application Tracker Styles
    trackerSection: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      padding: '2rem',
      marginBottom: '2rem',
    },
    trackerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    addButton: {
      background: '#059669',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
    },
    addForm: {
      background: '#f9fafb',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      marginBottom: '1.5rem',
      border: '1px solid #e5e7eb',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem',
    },
    formInput: {
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
    },
    formSelect: {
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      background: 'white',
    },
    formButtons: {
      display: 'flex',
      gap: '0.5rem',
    },
    saveButton: {
      background: '#2563eb',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      cursor: 'pointer',
    },
    cancelButton: {
      background: '#6b7280',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      cursor: 'pointer',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.875rem',
    },
    tableHeader: {
      background: '#f9fafb',
      borderBottom: '2px solid #e5e7eb',
    },
    th: {
      padding: '1rem',
      textAlign: 'left',
      fontWeight: '600',
      color: '#374151',
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb',
    },
    statusSelect: {
      padding: '0.25rem 0.5rem',
      borderRadius: '0.375rem',
      border: '1px solid #d1d5db',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: 'white',
    },
    deleteButton: {
      background: '#dc2626',
      color: 'white',
      border: 'none',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      cursor: 'pointer',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: '#6b7280',
    },
    resultsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    scoreCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '2px solid',
      padding: '2rem',
      textAlign: 'center',
    },
    scoreCardExcellent: {
      background: '#f0fdf4',
      borderColor: '#bbf7d0',
    },
    scoreCardGood: {
      background: '#fffbeb',
      borderColor: '#fde68a',
    },
    scoreCardPoor: {
      background: '#fef2f2',
      borderColor: '#fecaca',
    },
    scoreTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '1rem',
    },
    scoreNumber: {
      fontSize: '3.75rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    scoreNumberExcellent: {
      color: '#059669',
    },
    scoreNumberGood: {
      color: '#d97706',
    },
    scoreNumberPoor: {
      color: '#dc2626',
    },
    scoreDescription: {
      color: '#6b7280',
    },
    keywordsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '1.5rem',
    },
    keywordsCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      padding: '1.5rem',
    },
    keywordsTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
    },
    keywordsTitleMatched: {
      color: '#059669',
    },
    keywordsTitleMissing: {
      color: '#dc2626',
    },
    keywordsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      maxHeight: '16rem',
      overflowY: 'auto',
    },
    keywordTag: {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    keywordTagMatched: {
      background: '#ecfdf5',
      color: '#065f46',
    },
    keywordTagMissing: {
      background: '#fef2f2',
      color: '#991b1b',
    },
    keywordsCount: {
      marginTop: '1rem',
      fontSize: '0.875rem',
      color: '#6b7280',
    },
    feedbackCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      padding: '2rem',
    },
    feedbackTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
    },
    feedbackContent: {
      background: '#f9fafb',
      borderRadius: '0.75rem',
      padding: '1.5rem',
    },
    feedbackText: {
      whiteSpace: 'pre-wrap',
      color: '#374151',
      lineHeight: '1.6',
    },
  };

  return (
    <div style={styles.appContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>🎯</div>
          </div>
          <h1 style={styles.title}>FitForHire</h1>
          <p style={styles.subtitle}>AI-Powered Resume Analysis & Application Tracker</p>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Application Tracker Section */}
        <div style={styles.trackerSection}>
          <div style={styles.trackerHeader}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>📋</span>
              Application Tracker
            </h2>
            <button 
              style={styles.addButton}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <span style={{marginRight: '0.5rem'}}>+</span>
              Add Application
            </button>
          </div>

          {showAddForm && (
            <div style={styles.addForm}>
              <div style={styles.formGrid}>
                <input
                  type="text"
                  placeholder="Company"
                  value={newApplication.company}
                  onChange={(e) => setNewApplication({...newApplication, company: e.target.value})}
                  style={styles.formInput}
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={newApplication.position}
                  onChange={(e) => setNewApplication({...newApplication, position: e.target.value})}
                  style={styles.formInput}
                />
                <input
                  type="date"
                  value={newApplication.dateApplied}
                  onChange={(e) => setNewApplication({...newApplication, dateApplied: e.target.value})}
                  style={styles.formInput}
                />
                <select
                  value={newApplication.status}
                  onChange={(e) => setNewApplication({...newApplication, status: e.target.value})}
                  style={styles.formSelect}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formButtons}>
                <button style={styles.saveButton} onClick={handleAddApplication}>
                  Save
                </button>
                <button style={styles.cancelButton} onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {applications.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No applications tracked yet. Click "Add Application" to get started!</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Position</th>
                  <th style={styles.th}>Date Applied</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td style={styles.td}>{app.company}</td>
                    <td style={styles.td}>{app.position}</td>
                    <td style={styles.td}>{app.dateApplied}</td>
                    <td style={styles.td}>
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        style={{
                          ...styles.statusSelect,
                          backgroundColor: getStatusColor(app.status)
                        }}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={styles.td}>
                      <button 
                        style={styles.deleteButton}
                        onClick={() => deleteApplication(app.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Upload Section */}
        <div style={styles.uploadSection}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>📤</span>
            Upload Documents
          </h2>
          
          <div style={styles.uploadGrid}>
            {/* Resume Upload */}
            <div style={styles.uploadItem}>
              <label style={styles.uploadLabel}>
                <span style={styles.uploadIcon}>📄</span>
                Resume (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                style={styles.fileInput}
                onChange={e => setResume(e.target.files[0])}
              />
              {resume && (
                <div style={styles.fileSuccess}>
                  <span style={styles.successIcon}>✅</span>
                  {resume.name} uploaded
                </div>
              )}
            </div>

            {/* Job Description Upload */}
            <div style={styles.uploadItem}>
              <label style={styles.uploadLabel}>
                <span style={styles.uploadIcon}>📄</span>
                Job Description (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                style={styles.fileInput}
                onChange={e => setJob(e.target.files[0])}
              />
              {job && (
                <div style={styles.fileSuccess}>
                  <span style={styles.successIcon}>✅</span>
                  {job.name} uploaded
                </div>
              )}
            </div>
          </div>

          {/* Analyze Button */}
          <div style={styles.analyzeButtonContainer}>
            <button
              onClick={handleSubmit}
              disabled={loading || !resume || !job}
              style={{
                ...styles.analyzeButton,
                ...(loading || !resume || !job ? styles.analyzeButtonDisabled : {}),
              }}
              onMouseEnter={(e) => {
                if (!loading && resume && job) {
                  Object.assign(e.target.style, styles.analyzeButtonHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && resume && job) {
                  Object.assign(e.target.style, styles.analyzeButton);
                }
              }}
            >
              {loading ? (
                <>
                  <span style={styles.buttonIcon}>⚡</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span style={styles.buttonIcon}>🧠</span>
                  Analyze Match
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div style={styles.resultsContainer}>
            {/* Match Score Card */}
            <div style={{
              ...styles.scoreCard,
              ...(getScoreClass(result.match_score) === 'excellent' ? styles.scoreCardExcellent :
                  getScoreClass(result.match_score) === 'good' ? styles.scoreCardGood : 
                  styles.scoreCardPoor)
            }}>
              <h2 style={styles.scoreTitle}>Match Score</h2>
              <div style={{
                ...styles.scoreNumber,
                ...(getScoreClass(result.match_score) === 'excellent' ? styles.scoreNumberExcellent :
                    getScoreClass(result.match_score) === 'good' ? styles.scoreNumberGood : 
                    styles.scoreNumberPoor)
              }}>
                {result.match_score}
              </div>
              <p style={styles.scoreDescription}>
                {getScoreMessage(result.match_score)}
              </p>
            </div>

            <div style={styles.keywordsGrid}>
              {/* Matched Keywords */}
              <div style={styles.keywordsCard}>
                <h3 style={{...styles.keywordsTitle, ...styles.keywordsTitleMatched}}>
                  <span style={styles.sectionIcon}>✅</span>
                  Matched Keywords
                </h3>
                <div style={styles.keywordsList}>
                  {result.matched_keywords.map((keyword, i) => (
                    <div key={i} style={{...styles.keywordTag, ...styles.keywordTagMatched}}>
                      {keyword}
                    </div>
                  ))}
                </div>
                <div style={styles.keywordsCount}>
                  {result.matched_keywords.length} keywords matched
                </div>
              </div>

              {/* Missing Keywords */}
              <div style={styles.keywordsCard}>
                <h3 style={{...styles.keywordsTitle, ...styles.keywordsTitleMissing}}>
                  <span style={styles.sectionIcon}>⚠️</span>
                  Missing Keywords
                </h3>
                <div style={styles.keywordsList}>
                  {result.missing_keywords.map((keyword, i) => (
                    <div key={i} style={{...styles.keywordTag, ...styles.keywordTagMissing}}>
                      {keyword}
                    </div>
                  ))}
                </div>
                <div style={styles.keywordsCount}>
                  {result.missing_keywords.length} keywords to consider adding
                </div>
              </div>
            </div>

            {/* AI Feedback */}
            <div style={styles.feedbackCard}>
              <h3 style={styles.feedbackTitle}>
                <span style={styles.sectionIcon}>🧠</span>
                AI Feedback & Recommendations
              </h3>
              <div style={styles.feedbackContent}>
                <div style={styles.feedbackText}>
                  {result.ai_feedback}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;