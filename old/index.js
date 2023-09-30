const express = require('express');
const app = express();
const port = 3000;
const serverIsWorking = {
    status: 'ok',
    message: 'Server is working!'
};

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
        url: `http://localhost:${port}`, // Потрібно використовувати обратні кавички (`) для вставки змінної
        description: 'Local server',
      },
    ],
  },
  apis: ['index.js'], // Файл, де описані ваші маршрути
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Описуйте ваші маршрути тут

// Маршрут для перевірки працездатності (health-check)
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
    res.json(serverIsWorking);
});

/**
 * @swagger
 * /about:
 *   get:
 *     description: Get information about the About page
 *     responses:
 *       200:
 *         description: Information about the About page
 */
app.get('/about', (req, res) => {
    res.send('about');
});

//Маршрут для перевірки працездатності (acd або abcd)
/**
 * @swagger
 * /ab?cd:
 *   get:
 *     description: This endpoint is valid for /abcd and /acd
 *     responses:
 *       200:
 *         description: ab?cd
 */
app.get('/ab?cd', (req, res) => {
    res.send('ab?cd');
});

// Error handling middleware for 404 Not Found
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware for 500 Internal Server Error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
