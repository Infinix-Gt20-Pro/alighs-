import { Router } from 'express';
import { bookAppointment } from '../controllers/appointmentController';

const router = Router();
router.post('/', bookAppointment);

export default router;
