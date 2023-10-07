import express, { Request, Response, Application } from 'express';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './swagger/configs';

import { healthCheckRouter } from './resources/health-check.router';
import { aboutRouter } from './resources/about.router';
import { abcdRouter } from './resources/ab-сd.router';

export const app: Application = express();
export const port = 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

app.use('/health-check', healthCheckRouter); 

app.use('/about', aboutRouter);

app.get('/ab?cd', abcdRouter);

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