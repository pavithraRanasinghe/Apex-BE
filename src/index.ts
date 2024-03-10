import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import userRouter from './routes/user.routes';
import authRouter from './routes/auth.routes';
import shipmentRouter from './routes/shipment.routes'

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/shipment', shipmentRouter);

app.listen(PORT, ()=> console.log(`Server listen on port ${PORT}`)); 
