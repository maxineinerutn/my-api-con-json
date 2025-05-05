import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = './usuarios.json';

function cargarUsuarios() {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  }
  return [];
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(usuarios, null, 2));
}

let usuarios = cargarUsuarios();

app.get('/usuarios', (req, res) => res.json(usuarios));

app.get('/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  usuario ? res.json(usuario) : res.status(404).send('No encontrado');
});

app.post('/usuarios', (req, res) => {
  const nuevo = { id: Date.now(), ...req.body };
  usuarios.push(nuevo);
  guardarUsuarios(usuarios);
  res.status(201).json(nuevo);
});

app.put('/usuarios/:id', (req, res) => {
  const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('No encontrado');
  usuarios[index] = { id: usuarios[index].id, ...req.body };
  guardarUsuarios(usuarios);
  res.json(usuarios[index]);
});

app.delete('/usuarios/:id', (req, res) => {
  usuarios = usuarios.filter(u => u.id !== parseInt(req.params.id));
  guardarUsuarios(usuarios);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
