import express from 'express';
import bodyParser from 'body-parser';

import userRouter from './routes/user.routes';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

app.use('/api/user', userRouter);

app.listen(PORT, ()=> console.log(`Server listen on port ${PORT}`)); 
