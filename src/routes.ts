import { Router} from 'express';
import ControllerRotas from './Controllers/ControllerRotas';
import { createEvent } from './Controllers/ControllerEvents/CreateEvent/CreateEvents';
import { getEvents, getEventsBySlug } from './Controllers/ControllerEvents/GetEvents';
import { createBodyValidator } from './utils/createEventBodyValidator';

const router = Router();

router.get('/', ControllerRotas.raiz);

router.post('/events', createBodyValidator, createEvent)
router.get('/events', getEvents)
router.get('/events/:slug', getEventsBySlug)

export default router;
