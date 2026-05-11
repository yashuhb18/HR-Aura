import { Router } from 'express';
import { getEmployees, getEmployeeById, createEmployee } from '../controllers/employeeController.js';

const router = Router();

router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);

export default router;
