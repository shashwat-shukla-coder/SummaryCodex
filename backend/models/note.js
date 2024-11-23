const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: false,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    bookmark: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //pass as string
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
noteSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
