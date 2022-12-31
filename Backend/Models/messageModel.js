const mongoose = require('mongoose');
const meesageModel = mongoose.Schema(
    {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
},
    {
        timstamps: true,
    }
);
const Message = mongoose.model('Message', meesageModel);
module.exports = Message;