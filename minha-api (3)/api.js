const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./database/dados.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    db.run(`CREATE TABLE IF NOT EXISTS estoque (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      quantidade INTEGER,
      preco DECIMAL(10, 2)
    )`);
  }
});

// Endpoint para obter a lista de frutas
app.get('/frutas', (req, res) => {
  const sql = 'SELECT * FROM estoque';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar frutas:', err.message);
      res.status(500).json({ error: 'Erro ao buscar frutas.' });
    } else {
      console.log('Dados do banco de dados:', rows);
      res.json(rows);
    }
  });
});

// Endpoint para adicionar um novo item ao estoque
app.post('/estoque', (req, res) => {
  const { nome, quantidade, preco } = req.body;
  const sql = 'INSERT INTO estoque (nome, quantidade, preco) VALUES (?, ?, ?)';
  db.run(sql, [nome, quantidade, preco], function(err) {
    if (err) {
      console.error('Erro ao adicionar item ao estoque:', err.message);
      res.status(500).json({ error: 'Erro ao adicionar item ao estoque.' });
    } else {
      res.status(201).json({ message: 'Item adicionado ao estoque com sucesso.' });
    }
  });
});

// Endpoint para editar uma fruta
app.put('/frutas/:id', (req, res) => {
  const id = req.params.id;
  const { nome, quantidade, preco } = req.body;
  const sql = 'UPDATE estoque SET nome = ?, quantidade = ?, preco = ? WHERE id = ?';
  db.run(sql, [nome, quantidade, preco, id], function(err) {
    if (err) {
      console.error('Erro ao editar fruta:', err.message);
      res.status(500).json({ error: 'Erro ao editar fruta.' });
    } else {
      res.status(200).json({ message: 'Fruta editada com sucesso.' });
    }
  });
});

// Endpoint para apagar uma fruta
app.delete('/frutas/apagar/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM estoque WHERE id = ?';
  db.run(sql, [id], function(err) {
    if (err) {
      console.error('Erro ao apagar fruta:', err.message);
      res.status(500).json({ error: 'Erro ao apagar fruta.' });
    } else {
      res.status(200).json({ message: 'Fruta apagada com sucesso.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Express em execução na porta ${PORT}`);
});