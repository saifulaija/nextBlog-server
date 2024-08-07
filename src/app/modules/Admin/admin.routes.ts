import express, { NextFunction, Request, Response } from 'express';
import { AdminController } from './admin.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { adminValidationSchemas } from './admin.ValidationSchema';
import authGuard from '../../middlewares/authGuard';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  // authGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAllAdmin,
);

router.get(
  '/:id',
  authGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getSingleAdmin,
);

router.patch(
  '/:id',
  authGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(adminValidationSchemas.update),
  AdminController.updateAdmin,
);

router.delete(
  '/:id',
  authGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.deleteAdmin,
);

router.delete(
  '/soft/:id',
  authGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.softDeleteAdmin,
);

export const AdminRoutes = router;
