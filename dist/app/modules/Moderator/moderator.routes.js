"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeratorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const client_1 = require("@prisma/client");
const moderator_controller_1 = require("./moderator.controller");
const moderator_validation_1 = require("./moderator.validation");
const router = express_1.default.Router();
router.get('/', (0, authGuard_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), moderator_controller_1.ModeratorController.getAllModerator);
router.get('/:id', moderator_controller_1.ModeratorController.getSingleModerator);
router.patch('/:id', (0, validateRequest_1.validateRequest)(moderator_validation_1.moderatorValidationSchemas.updateModeratorSchema), moderator_controller_1.ModeratorController.updateModerator);
router.delete('/:id', moderator_controller_1.ModeratorController.deleteModerator);
router.delete('/soft/:id', moderator_controller_1.ModeratorController.softDeleteModerator);
exports.ModeratorRoutes = router;
