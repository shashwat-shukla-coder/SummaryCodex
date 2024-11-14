const Note = require("../models/note");
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

module.exports = {
  getAllNotes,
  getNoteById,
  CreateNote,
  DeleteNote,
  UpdateNote,
};
