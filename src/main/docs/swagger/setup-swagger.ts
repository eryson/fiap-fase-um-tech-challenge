import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import express from 'express'
import YAML from 'yamljs'
import path from 'path'

const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'))

const options = {
  definition: swaggerDocument,
  apis: ['./src/main/routes/**/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

export const setupSwagger = (app: express.Application): void => {
  app.use(
    '/documentation',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Documentação Tech Challenge',
      customfavIcon: '/public/images/favicon.png',
      customCss: `
        .swagger-ui .topbar {
          background-color: #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .swagger-ui .topbar .link {
          background: url('/public/images/fiap-logo.png') no-repeat left center;
          background-size: contain;
          width: 200px;
          height: 40px;
        }
        .swagger-ui .topbar .link svg {
          display: none;
        }
      `,
    })
  )
}
