import express from 'express';
import {
  getIdeas,
  getIdea,
  createIdea,
  updateIdea,
  deleteIdea,
  validateIdea,
  getPublicIdeas,
  emailValidationReport
} from '../controllers/ideaController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/public', getPublicIdeas);

// Protected routes
router.use(protect); // All routes below this line require authentication

// Idea CRUD operations
router.route('/')
  .get(getIdeas)
  .post(createIdea);

router.route('/:id')
  .get(getIdea)
  .put(updateIdea)
  .delete(deleteIdea);

// Idea validation
router.post('/:id/validate', validateIdea);
router.post('/:id/email-report', emailValidationReport);

export default router;