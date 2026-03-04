import 'dotenv/config'; 
import app from './app.js';
import { connectRedis } from './redis.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectRedis();
        console.log('Connected to Redis');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};


startServer();


