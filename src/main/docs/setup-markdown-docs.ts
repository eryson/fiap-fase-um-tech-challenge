/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import path from 'path'
import express from 'express'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

export const setupMarkdownDocs = (app: express.Application): void => {
  app.use('/development/assets', express.static(path.join(__dirname, './')))

  app.get('/development/*', (req, res: any) => {
    const filePathParam = req.params[0]
    const filePath = path.join(__dirname, './', `${filePathParam}.md`)

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Documento não encontrado.')
    }

    const markdownContent = fs.readFileSync(filePath, 'utf8')
    const htmlContent = md.render(markdownContent)

    res.send(`
<html>
  <head>
    <title>Tech Challenge Docs: ${filePathParam.charAt(0).toUpperCase()}${filePathParam.slice(1)}</title>
    <link rel="icon" href="/public/images/favicon.png" type="image/png">
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #f8f9fa;
        color: #333;
      }
      header {
        background: #2a2a2a;
        padding: 16px 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      header img {
        height: 40px;
      }
      nav a {
        color: white;
        margin-left: 24px;
        text-decoration: none;
        font-weight: bold;
      }
      nav a:hover {
        text-decoration: underline;
      }
      .container {
        display: flex;
        min-height: 90vh;
      }
      .sidebar {
        width: 250px;
        background: #fff;
        padding: 24px;
        border-right: 1px solid #ddd;
      }
      .sidebar h2 {
        font-size: 18px;
        margin-bottom: 16px;
      }
      .sidebar ul {
        list-style: none;
        padding: 0;
      }
      .sidebar li {
        margin-bottom: 12px;
      }
      .sidebar a {
        color: #2a2a2a;
        text-decoration: none;
      }
      .sidebar a:hover {
        text-decoration: underline;
      }
    .content {
  flex: 1;
  padding: 40px;
  background: white;
  overflow-wrap: break-word;
  word-break: break-word;
}

.content pre {
  background: #f4f4f4;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  max-width: 100%;
}

.content code {
  background: #eee;
  padding: 2px 6px;
  border-radius: 4px;
}

.content table {
  width: 100%;
  border-collapse: collapse;
}

.content th, .content td {
  border: 1px solid #ddd;
  padding: 8px;
}

.content th {
  background-color: #f2f2f2;
}

.content h1, .content h2, .content h3 {
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
}

.content img {
  max-width: 100%;
  height: auto;
}

.content a {
  word-break: break-word;
}

      footer {
        background: #2a2a2a;
        color: white;
        padding: 12px 24px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <header>
      <img src="/public/images/fiap-logo.svg" alt="Tech Challenge" />
      <nav>
        <a href="/development/onboarding">Onboarding</a>
        <a href="/documentation">Swagger API</a>
        <a href="/development/requirements/requirements">Requisitos</a>
        <a href="/development/architecture">Arquitetura</a>
        <a href="/development/patterns">Padrões</a>
      </nav>
    </header>

    <div class="container">
      <aside class="sidebar">
        <h2>Atalhos</h2>
        <ul>
          <li><a href="/development/onboarding">Onboarding</a></li>
          <li><a href="/development/architecture">Arquitetura</a></li>
          <li><a href="/development/patterns">Padroes</a></li>
          <li><a href="/development/requirements/requirements">Requisitos</a></li>
          <li><a href="/documentation">Swagger</a></li>
        </ul>
      </aside>

      <main class="content">
        ${htmlContent}
      </main>
    </div>

    <footer>
      © ${new Date().getFullYear()} Tech Challenge.
    </footer>
  </body>
</html>
    `)
  })
}
