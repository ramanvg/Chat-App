const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const express = require("express");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { chats } = require("./data/data");
const res = require("express/lib/response");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running");
});
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(5000, console.log("server"));
