const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors({origin: true}));

const userRouter = require('./routes/User');
app.use('/auth', userRouter);

app.listen(3001, () => {
    console.log('Server running on port 3001');
});