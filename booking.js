import express from 'express';
import { getRedisClient } from './redis.js';
import { v4 as uuidv4 } from 'uuid';
import { acquireLock, releaseLock } from './lock.util.js';
export const bookSeatRouter = express.Router();
const seats = {
    "1": "available",
    "2": "available",
    "3": "available"
};
bookSeatRouter.post('/book/:seatId', async (req, res) => {
    const seatId = req.params.seatId;
    const client = getRedisClient();
    if (!seats[seatId]) {
        return res.status(404).json({ message: 'Seat not found' });
    }
    const lockKey = `lock:seat:${seatId}`;
    const lockToken = uuidv4();
    try {
        const acquired = await acquireLock(client, lockKey, lockToken, 10000); // 10s TTL
        if (!acquired) {
            return res.status(423).json({ message: 'Seat is locked, try again later' });
        }

        if (seats[seatId] === 'booked') {
            return res.status(400).json({ message: 'Seat already booked' });
        }
        seats[seatId] = 'booked';
        res.status(200).json({ message: `Seat ${seatId} booked successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        await releaseLock(client, lockKey, lockToken);
    }
});