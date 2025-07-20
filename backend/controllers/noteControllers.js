const Note = require("../models/note");
const axios = require("axios");
//get user notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
//get requesed notes of user
const getNoteById = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    return res.json(note); // Return immediately after sending the response
  } else {
    return res.status(404).json({ message: "Note not found" }); // Ensure to return here as well
  }
};

//create a new note and save it to the user id
const CreateNote = async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    res.status(400);
    throw new Error("Please Fill all the feilds");
  } else {
    const note = new Note({ user: req.user._id, title, content, category });

    const createdNote = await note.save();

    res.status(201).json(createdNote);
  }
};

//delete a note by id and check if it belongs to the user
const DeleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You can't perform this action");
  }

  if (note) {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note Removed" });
  } else {
    res.status(404);
    throw new Error("Note not Found");
  }
};

//update a note by id and check if it belongs to the user
const UpdateNote = async (req, res) => {
  const { title, content, category } = req.body;

  const note = await Note.findById(req.params.id);

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You can't perform this action");
  }

  if (note) {
    note.title = title;
    note.content = content;
    note.category = category;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error("Note not found");
  }
};
const Updatebookmark = async function (req, res) {
  try {
    // Find the note by ID
    const reqNote = await Note.findById(req.params.id);

    // Check if the note exists
    if (!reqNote) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    // Verify the note belongs to the authenticated user
    if (reqNote.user.toString() !== req.user._id.toString()) {
      res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
      return;
    }

    // Toggle the bookmark field
    reqNote.bookmark = !reqNote.bookmark;

    // Save the updated note
    await reqNote.save();

    // Respond with the updated bookmark status
    res.status(200).json({
      message: "Bookmark status updated successfully",
      bookmark: reqNote.bookmark,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const summarizeAbstractive = async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }
  try {
    const response = await axios.post("http://localhost:7000/abstractive", {
      text: content,
    });
    res.json({ summary: response.data.summary });
  } catch (error) {
    console.error("Summarization Error:", error.message);
    res
      .status(500)
      .json({ message: "Error in summarization", error: error.message });
  }
};

const summarizeExtractive = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const response = await axios.post("http://localhost:7000/extractive", {
      text: content,
    });

    res.json({ summary: response.data.summary });
  } catch (error) {
    console.error("Extractive summarization error:", error.message);
    res.status(500).json({
      message: "Extractive summarization failed",
      error: error.message,
    });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  CreateNote,
  DeleteNote,
  UpdateNote,
  Updatebookmark,
  summarizeAbstractive,
  summarizeExtractive,
};
