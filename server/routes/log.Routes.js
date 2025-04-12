import { Router } from 'express';
import { getAuditLogs } from '../controllers/log.Controller.js';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const router = Router();

// Get all audit logs (Admins only)
router.get('/', authenticateAndAuthorize(['auditAccess'], 'administrator'), getAuditLogs);

export default router;
