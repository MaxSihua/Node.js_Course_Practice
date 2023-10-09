import swaggerJsdoc, { OAS3Definition } from "swagger-jsdoc";
import { port } from "../configs";

const swaggerOptions: OAS3Definition = {
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
    apis: ['src/resources/*.ts'],
    openapi: '',
    info: {
      title: 'test swagger',
      version: '0.0.1',
    },
  };

  export const swaggerSpec: object = swaggerJsdoc(swaggerOptions);
  