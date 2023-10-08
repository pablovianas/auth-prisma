import express, { Application, Request, Response } from 'express';
import { routes } from './routes';

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
