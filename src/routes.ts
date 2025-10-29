import { Router} from 'express';
import ControllerRotas from './Controllers/ControllerRotas';
import { createEvent } from './Controllers/ControllerEvents/CreateEvent/CreateEvents';
import { getEvents, getEventsBySlug } from './Controllers/ControllerEvents/GetEvent/GetEvents';
import { putEvent } from './Controllers/ControllerEvents/PutEvent/PutEvents';
import { deleteEvent } from './Controllers/ControllerEvents/DeleteEvent/deleteEvent';
import { ensureAuthenticate } from './middleware/EnsureAuthenticate';
import { Login } from './Controllers/controllerLogin/ControllerLogin';
import { createUser } from './Controllers/ControllerUser/createUser/createUser';
import { ensureCoord } from './middleware/EnsureCoord';
import { ifCreateAdolescente } from './middleware/ifCreateAdolescente';
import { getUserByEmail, getUsers } from './Controllers/ControllerUser/getUser/getUser';
import { putUser } from './Controllers/ControllerUser/putUser/putUser';

const router = Router();

router.get('/', ensureAuthenticate , ControllerRotas.raiz);


router.post('/events', ensureAuthenticate, ensureCoord, createEvent);
router.get('/events', ensureAuthenticate , getEvents);
router.get('/events/:slug', ensureAuthenticate , getEventsBySlug);
router.put('/events', ensureAuthenticate, ensureCoord, putEvent)
router.delete('/events/:slug', ensureAuthenticate, ensureCoord, deleteEvent);

router.post('/login', Login);

// Alterar a logica para utilizar o uuid do usuario como parâmetro e identificação e adicionar sistema de cache ou cookies
router.post('/user',ensureCoord, ifCreateAdolescente ,createUser)
router.get('/user', ensureAuthenticate , getUsers);
router.get('/user/:slug', ensureAuthenticate , getUserByEmail);
router.put('/user', ensureAuthenticate, ensureCoord, putUser)
router.delete('/user', ensureAuthenticate, ensureCoord, )



export default router;
