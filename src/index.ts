import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import todoRoutes from './routes/todos';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/api/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
