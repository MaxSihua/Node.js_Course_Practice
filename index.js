const express = require('express');
const app = express();
const port = 3000;

// Підключення до Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger опції
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API Documentation',
      version: '1.0.0',
      description: 'Documentation for my API',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local server',
      },
    ],
  },
  apis: ['index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /health-check:
 *   get:
 *     description: Check if the server is up and running
 *     responses:
 *       200:
 *         description: Server is up and running
 */

app.get('/health-check', (req, res) => {
  res.json({ status: 'Server is up and running' });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
