const express = require('express');
const router = express.Router();
const CraftingController = require('../controllers/craftingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Godot memanggil: Global.base_url + "/crafting/combine"
router.post('/combine', authMiddleware, CraftingController.craftItem);

module.exports = router;