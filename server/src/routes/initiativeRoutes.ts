import { Router } from 'express';
import * as initiativeController from '../controllers/initiativeController';

const router = Router();

// GET /api/initiatives — List all initiatives with optional filters
router.get('/', initiativeController.getAllInitiatives);

// GET /api/initiatives/:id — Get single initiative by ID
router.get('/:id', initiativeController.getInitiativeById);

// POST /api/initiatives — Create new initiative
router.post('/', initiativeController.createInitiative);

// PUT /api/initiatives/:id — Update initiative
router.put('/:id', initiativeController.updateInitiative);

// DELETE /api/initiatives/:id — Delete initiative
router.delete('/:id', initiativeController.deleteInitiative);

export default router;
