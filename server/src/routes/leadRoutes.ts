import { Router } from 'express';
import { auth } from '../middleware/auth';
import { 
  createLead, 
  getLeads, 
  updateLead, 
  deleteLead,
  addNote,
  getNotes
} from '../controllers/leadController';

const router = Router();

router.post('/', auth, createLead);
router.get('/', auth, getLeads);
router.put('/:id', auth, updateLead);
router.delete('/:id', auth, deleteLead);
router.post('/:id/notes', auth, addNote);
router.get('/:id/notes', auth, getNotes);

export default router;