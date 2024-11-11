// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');

// Inicializa o aplicativo Express
const app = express();
app.use(express.json());

// Configura o cliente do Notion com a chave de API
const notion = new Client({ auth: process.env.NOTION_API_KEY, notionVersion: '2021-05-13' });

const databaseId = process.env.NOTION_DATABASE_ID;

// 2. Criação de um Novo Registro
app.post('/create', async (req, res) => {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: req.body
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Buscar Dados de um Registro Específico
app.get('/retrieve/:id', async (req, res) => {
  try {
    const response = await notion.pages.retrieve({ page_id: req.params.id });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Atualizar um Registro Específico
app.patch('/update/:id', async (req, res) => {
  try {
    const response = await notion.pages.update({
      page_id: req.params.id,
      properties: req.body
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/delete/:id', async (req, res) => {
    try {
      const response = await notion.pages.update({
        page_id: req.params.id,
        archived: true
      });
      res.status(200).json({ message: 'Registro arquivado com sucesso', response });
    } catch (error) {
      console.error('Erro ao tentar arquivar a página:', error);
      res.status(500).json({ error: error.message });
    }
  });
  

app.get('/database', async (req, res) => {
    try {
      const response = await notion.databases.retrieve({ database_id: databaseId });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
