import express, { Request, Response, Application } from 'express';
import swaggerUi from 'swagger-ui-express';

import { ServerSatatus } from './interface/interface'
import { swaggerSpec } from './swagger/configs';

const app: Application = express();
const port = 3000;
const serverIsWorking: ServerSatatus = {
  status: 'ok',
  message: 'Server is working!',
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

app.get('/health-check', (req: Request, res: Response): void => {
  res.json(serverIsWorking);
});

app.get('/about', (req: Request, res: Response): void => {
  res.send('about');
});

app.get('/ab?cd', (req: Request, res: Response): void => {
  res.send('ab?cd');
});

app.use((req: Request, res: Response): void => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err: Error, req: Request, res: Response): void => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});