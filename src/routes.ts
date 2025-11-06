import { Router} from 'express';
import ControllerRotas from './Controllers/ControllerRotas';
import { 
  createEvent,
  getEvents,
  getEventsBySlug,
  putEvent,
  deleteEvent,
  ensureAuthenticate,
  Login,
  createUser,
  ensureCoord,
  ifCreateAdolescente,
  getUserById,
  getUsers,
  putUser,
  ensureIsLogged,
  Logout,
  getPass,
  getPassById,
  createPass,
  putPass,
  deletePass,
  deleteUser,
  createCong,
  getCongById,
  getCongByUserLoggedId,
  getCongs,
  putCong,
  deleteCong
} from './Controllers/exporterControllers';


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
router.post('/events', ensureAuthenticate, ensureIsLogged, ensureCoord, createEvent);
router.get('/events', ensureAuthenticate, ensureIsLogged , getEvents);
router.get('/events/:slug', ensureAuthenticate, ensureIsLogged , getEventsBySlug);
router.put('/events', ensureAuthenticate, ensureIsLogged, ensureCoord, putEvent);
router.delete('/events/:slug', ensureAuthenticate, ensureIsLogged, ensureCoord, deleteEvent);

// Rotas de Usuários
router.get('/user', ensureAuthenticate, ensureIsLogged , getUsers);
router.get('/user/:slug', ensureAuthenticate, ensureIsLogged , getUserById);
router.put('/user', ensureAuthenticate,ensureIsLogged ,ensureCoord  , putUser);
router.delete('/user', ensureAuthenticate, ensureIsLogged , ensureCoord, deleteUser);

/// Rota de Logout
router.post('/logout', ensureIsLogged, Logout);

// Rotas de Ingresso
router.get('/ingresso', ensureAuthenticate, ensureIsLogged,ensureCoord , getPass);
router.get('/ingresso/:id', ensureAuthenticate, getPassById);
router.post('/ingresso', ensureAuthenticate, ensureIsLogged , createPass);
router.put('/ingresso', ensureAuthenticate, ensureIsLogged , putPass);
router.delete('/ingresso/:id', ensureAuthenticate, ensureIsLogged , deletePass);

// Rotas de Congregação

router.get('/cong', ensureAuthenticate, ensureIsLogged, getCongs)
router.get('/cong/:id', ensureAuthenticate,ensureIsLogged, getCongById)
router.get('/cong/user', ensureAuthenticate, ensureIsLogged, getCongByUserLoggedId)
router.post('/cong', ensureAuthenticate, ensureIsLogged, ensureCoord,  createCong)
router.put('/cong', ensureAuthenticate, ensureIsLogged, ensureCoord, putCong)
router.delete('/cong', ensureAuthenticate, ensureIsLogged, ensureCoord, deleteCong)

export default router;
