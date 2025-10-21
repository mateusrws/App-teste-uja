import { Router} from 'express';
import ControllerRotas from './Controllers/ControllerRotas';
import { createBodyValidator, createEvent } from './Controllers/ControllerEvents';

const router = Router();

router.get('/', ControllerRotas.raiz);
router.post('/events', createBodyValidator, createEvent)

export default router;
