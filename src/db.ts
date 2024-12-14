import mongoose from 'mongoose';

export async function connectDB() {
    await mongoose.connect('mongodb://localhost:27017/todo-app');
    console.log('Connected to MongoDB');
}
