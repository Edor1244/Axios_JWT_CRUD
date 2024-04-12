require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const sqlite3 = require('sqlite3').verbose();
const dbPath2 = './db/empleadosDB.sqlite';
const {checkToken} = require('../middleware');

// CRUD de usuarios

// Leer todos los usuarios
router.get('/api', (req, res) => {
  const db = new sqlite3.Database(dbPath2);
  db.all(`SELECT * FROM usuarios`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (rows.length > 0) {
      res.json({ usuarios: rows });
    } else {
      res.status(404).json({ error: 'No users found' });
    }
  });
  db.close();
});

// Crear usuario
router.post('/api', async (req, res) => {
  const { nombre, rol, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const db = new sqlite3.Database(dbPath2);

  db.run(`INSERT INTO usuarios (nombre, rol, password) VALUES (?, ?, ?)`, [nombre, rol, hashedPassword], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
  db.close();
});

// Leer usuario (por ID)
router.get('/api/:id', (req, res) => {
  const id = req.params.id;
  const db = new sqlite3.Database(dbPath2);
  db.get(`SELECT id, nombre, rol FROM usuarios WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (row) {
      res.json({usuario: row});
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  });
  db.close();
});

// Actualizar usuario
router.put('/api/:id', checkToken, async (req, res) => {
  const { nombre, rol, password } = req.body;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  const id = req.params.id;
  const db = new sqlite3.Database(dbPath2);
  db.run(`UPDATE usuarios SET nombre = ?, rol = ?${password ? ', password = ?' : ''} WHERE id = ?`, 
    password ? [nombre, rol, hashedPassword, id] : [nombre, rol, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.json({ message: 'Usuario actualizado' });
    }
  });
  db.close();
});

// Eliminar usuario
router.delete('/api/:id', checkToken, (req, res) => {
  const id = req.params.id;
  const db = new sqlite3.Database(dbPath2);
  db.run(`DELETE FROM usuarios WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.json({ message: 'Usuario eliminado' });
    }
  });
  db.close()
});



module.exports = router;
