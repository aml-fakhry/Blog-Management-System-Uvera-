// Swagger definition
export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog-Management-System',
      version: '1.0.0',
      description: 'API documentation for my Express + TypeORM app',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};
