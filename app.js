import express from 'express';
import { bookSeatRouter } from './booking.js';
const app = express();
app.use(express.json());
app.use('/api', bookSeatRouter);
export default app;