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
import { getUserById, getUsers } from './Controllers/ControllerUser/getUser/getUser';
import { putUser } from './Controllers/ControllerUser/putUser/putUser';
import { ensureIsLogged } from './middleware/ensureIsLogged';
import { Logout } from './Controllers/ControllerLogout/controllerLogout';
import { getPass, getPassById } from './Controllers/ControllerIngresso/getPass';
import { createPass } from './Controllers/ControllerIngresso/createPass';
import { putPass } from './Controllers/ControllerIngresso/putPass';
import { deletePass } from './Controllers/ControllerIngresso/deletePass';

const router = Router();

// ============================================
// ROTAS PÚBLICAS (sem autenticação)
// ============================================
router.post('/login', Login);
router.post('/user', ensureCoord, ifCreateAdolescente, createUser);

// ============================================
// ROTAS PROTEGIDAS (requerem autenticação)
// ============================================
// Todas as rotas abaixo precisam estar autenticadas

router.get('/', ensureAuthenticate, ControllerRotas.raiz);

// Rotas de Eventos
router.post('/events', ensureAuthenticate, ensureCoord, createEvent);
router.get('/events', ensureAuthenticate, getEvents);
router.get('/events/:slug', ensureAuthenticate, getEventsBySlug);
router.put('/events', ensureAuthenticate, ensureCoord, putEvent);
router.delete('/events/:slug', ensureAuthenticate, ensureCoord, deleteEvent);

// Rotas de Usuários
router.get('/user', ensureAuthenticate, getUsers);
router.get('/user/:slug', ensureAuthenticate, getUserById);
router.put('/user', ensureAuthenticate, ensureCoord, putUser);
router.delete('/user', ensureAuthenticate, ensureCoord);

/// Rota de Logout
router.post('/logout', ensureIsLogged, Logout);

// Rotas de Ingresso
router.get('/ingresso', ensureAuthenticate, getPass);
router.get('/ingresso/:id', ensureAuthenticate, getPassById);
router.post('/ingresso', ensureAuthenticate, createPass);
router.put('/ingresso', ensureAuthenticate, putPass);
router.delete('/ingresso/:id', ensureAuthenticate, deletePass);




export default router;
