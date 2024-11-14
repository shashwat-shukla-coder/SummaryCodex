const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const {
  getAllNotes,
  getNoteById,
  CreateNote,
  UpdateNote,
  DeleteNote,
} = require("../controllers/noteControllers.js");
const router = express.Router();

// // Route to get all notes

router.route("/").get(authMiddleware, getAllNotes);
router.route("/create").post(authMiddleware, CreateNote);

// Route to get a single note by ID
router
  .route("/:id")
  .get(authMiddleware, getNoteById)
  .put(authMiddleware, UpdateNote)
  .delete(authMiddleware, DeleteNote);

module.exports = router;
