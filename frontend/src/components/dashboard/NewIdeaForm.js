import { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import './Dashboard.css';

const CATEGORIES = [
  'Software & Apps',
  'E-commerce',
  'Health & Wellness',
  'Education',
  'Finance',
  'Social Media',
  'Entertainment',
  'Food & Beverage',
  'Travel',
  'Real Estate',
  'Other'
];

const NewIdeaForm = ({ onSubmit, onCancel, initialIdeaText = '' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetAudience: '',
    problemSolved: '',
    uniqueValueProp: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use initialIdeaText to populate form on mount
  useEffect(() => {
    if (initialIdeaText) {
      setFormData({
        ...formData,
        description: initialIdeaText
      });
    }
  }, [initialIdeaText]);

  const { title, description, category, targetAudience, problemSolved, uniqueValueProp } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear field-specific error when user types
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: null
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      errors.description = 'Description is required';
    } else if (description.trim().length < 20) {
      errors.description = 'Description should be at least 20 characters';
    }
    
    if (!category) {
      errors.category = 'Category is required';
    }
    
    if (!problemSolved.trim()) {
      errors.problemSolved = 'Problem description is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        await onSubmit(formData);
      } catch (err) {
        console.error('Error submitting idea:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="new-idea-form">
      <div className="form-header">
        <h3>Add New Idea</h3>
        <button 
          className="close-button"
          onClick={onCancel}
          type="button"
        >
          <FaTimesCircle />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Idea Title <span className="required">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            placeholder="Enter a clear, concise title"
            className={formErrors.title ? 'error' : ''}
          />
          {formErrors.title && <div className="error-message">{formErrors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category <span className="required">*</span></label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={onChange}
            className={formErrors.category ? 'error' : ''}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {formErrors.category && <div className="error-message">{formErrors.category}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description <span className="required">*</span></label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            placeholder="Describe your idea in detail"
            rows={3}
            className={formErrors.description ? 'error' : ''}
          />
          {formErrors.description && <div className="error-message">{formErrors.description}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="problemSolved">Problem Solved <span className="required">*</span></label>
          <textarea
            id="problemSolved"
            name="problemSolved"
            value={problemSolved}
            onChange={onChange}
            placeholder="What problem does your idea solve?"
            rows={3}
            className={formErrors.problemSolved ? 'error' : ''}
          />
          {formErrors.problemSolved && <div className="error-message">{formErrors.problemSolved}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="targetAudience">Target Audience</label>
          <input
            type="text"
            id="targetAudience"
            name="targetAudience"
            value={targetAudience}
            onChange={onChange}
            placeholder="Who is your idea for?"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="uniqueValueProp">Unique Value Proposition</label>
          <textarea
            id="uniqueValueProp"
            name="uniqueValueProp"
            value={uniqueValueProp}
            onChange={onChange}
            placeholder="What makes your idea unique or better than existing solutions?"
            rows={3}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Idea'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewIdeaForm; 