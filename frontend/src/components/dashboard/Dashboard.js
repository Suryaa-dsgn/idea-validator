import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getIdeas, createIdea, validateIdea } from '../../api/ideas';
import IdeaCard from './IdeaCard';
import NewIdeaForm from './NewIdeaForm';
import './Dashboard.css';

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewIdeaForm, setShowNewIdeaForm] = useState(false);
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    fetchIdeas();
  }, []);
  
  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const fetchedIdeas = await getIdeas();
      setIdeas(fetchedIdeas);
      setError(null);
    } catch (err) {
      setError('Failed to load ideas. Please try again later.');
      console.error('Error fetching ideas:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddIdea = async (ideaData) => {
    try {
      setLoading(true);
      const newIdea = await createIdea(ideaData);
      setIdeas([newIdea, ...ideas]);
      setShowNewIdeaForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create idea. Please try again.');
      console.error('Error creating idea:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleValidateIdea = async (ideaId) => {
    try {
      setLoading(true);
      const validatedIdea = await validateIdea(ideaId);
      setIdeas(ideas.map(idea => 
        idea._id === validatedIdea._id ? validatedIdea : idea
      ));
      setError(null);
    } catch (err) {
      setError('Failed to validate idea. Please try again.');
      console.error('Error validating idea:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-welcome">
          <h1>Welcome, {user?.name || 'User'}</h1>
          <p>Here are your startup ideas:</p>
        </div>
        <button 
          className="btn btn-primary add-idea-btn"
          onClick={() => setShowNewIdeaForm(true)}
        >
          + New Idea
        </button>
      </div>
      
      {error && <div className="error-alert">{error}</div>}
      
      {showNewIdeaForm && (
        <div className="new-idea-form-container">
          <NewIdeaForm 
            onSubmit={handleAddIdea} 
            onCancel={() => setShowNewIdeaForm(false)}
          />
        </div>
      )}
      
      {loading && !showNewIdeaForm ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="ideas-grid">
          {ideas.length > 0 ? (
            ideas.map(idea => (
              <IdeaCard 
                key={idea._id} 
                idea={idea} 
                onValidate={handleValidateIdea}
              />
            ))
          ) : (
            <div className="no-ideas">
              <p>You don't have any ideas yet. Let's create your first idea!</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowNewIdeaForm(true)}
              >
                Create First Idea
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 