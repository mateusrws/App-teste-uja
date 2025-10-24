import { Router} from 'express';
import ControllerRotas from './Controllers/ControllerRotas';
import { createEvent } from './Controllers/ControllerEvents/CreateEvent/CreateEvents';
import { getEvents, getEventsBySlug } from './Controllers/ControllerEvents/GetEvent/GetEvents';
import { putEvent } from './Controllers/ControllerEvents/PutEvent/PutEvents';
import { deleteEvent } from './Controllers/ControllerEvents/DeleteEvent/deleteEvent';

const router = Router();

router.get('/', ControllerRotas.raiz);


router.post('/events', createEvent);
router.get('/events', getEvents);
router.get('/events/:slug', getEventsBySlug);
router.put('/events', putEvent)
router.delete('/events/:slug', deleteEvent);

export default router;
