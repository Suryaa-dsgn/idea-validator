import { useState } from 'react';
import { FaRegThumbsUp, FaRegEdit, FaRegTrashAlt, FaCheck, FaSpinner } from 'react-icons/fa';
import './Dashboard.css';

const IdeaCard = ({ idea, onValidate }) => {
  const [isValidating, setIsValidating] = useState(false);
  
  const handleValidate = async () => {
    if (idea.validation.isValidated) return;
    
    setIsValidating(true);
    try {
      await onValidate(idea._id);
    } catch (err) {
      console.error('Error validating idea:', err);
    } finally {
      setIsValidating(false);
    }
  };
  
  const renderValidationBadge = () => {
    if (isValidating) {
      return (
        <div className="validation-badge validating">
          <FaSpinner className="spinner" /> Validating...
        </div>
      );
    }
    
    if (idea.validation.isValidated) {
      const score = idea.validation.score || 0;
      let badgeClass = 'low';
      
      if (score >= 80) {
        badgeClass = 'high';
      } else if (score >= 50) {
        badgeClass = 'medium';
      }
      
      return (
        <div className={`validation-badge validated ${badgeClass}`}>
          <FaCheck className="check-icon" /> Validation Score: {score}%
        </div>
      );
    }
    
    return (
      <div className="validation-badge not-validated">
        Not Validated
      </div>
    );
  };

  return (
    <div className="idea-card">
      <div className="idea-header">
        <h3>{idea.title}</h3>
        <div className="idea-actions">
          <button className="icon-button edit">
            <FaRegEdit />
          </button>
          <button className="icon-button delete">
            <FaRegTrashAlt />
          </button>
        </div>
      </div>
      
      <div className="idea-category">{idea.category}</div>
      
      <p className="idea-description">{idea.description}</p>
      
      <div className="idea-footer">
        <div className="validation-section">
          {renderValidationBadge()}
        </div>
        
        {!idea.validation.isValidated && (
          <button 
            className="validate-button"
            onClick={handleValidate}
            disabled={isValidating}
          >
            <FaRegThumbsUp /> Validate Idea
          </button>
        )}
      </div>
    </div>
  );
};

export default IdeaCard; 