import { Router} from 'express';
import ControllerRotas from './Controllers/ControllerRotas';
import { createEvent } from './Controllers/ControllerEvents/CreateEvent/CreateEvents';
import { getEvents, getEventsBySlug } from './Controllers/ControllerEvents/GetEvent/GetEvents';
import { putEvent } from './Controllers/ControllerEvents/PutEvent/PutEvents';
import { deleteEvent } from './Controllers/ControllerEvents/DeleteEvent/deleteEvent';
import { ensureAuthenticate } from './middleware/EnsureAuthenticate';
import { Login } from './Controllers/controllerLogin/ControllerLogin';

const router = Router();

router.get('/', ensureAuthenticate , ControllerRotas.raiz);


router.post('/events', ensureAuthenticate , createEvent);
router.get('/events', ensureAuthenticate , getEvents);
router.get('/events/:slug', ensureAuthenticate , getEventsBySlug);
router.put('/events', ensureAuthenticate , putEvent)
router.delete('/events/:slug', ensureAuthenticate , deleteEvent);

router.post('/login', Login);

export default router;
