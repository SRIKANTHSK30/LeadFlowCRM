"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.get('/profile', auth_1.auth, userController_1.getProfile);
router.get('/', auth_1.auth, userController_1.getUsers);
exports.default = router;
