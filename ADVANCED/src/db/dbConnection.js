import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not set');
        }

        await mongoose.connect(process.env.MONGO_URI,
            //      {
            //   useNewUrlParser: true,
            //   useUnifiedTopology: true,
            // }
        );
        console.log('Connected to database.');
    } catch (err) {
        console.error(`Error connecting to database: ${err.message}`);
        process.exit(1);
    }
};
