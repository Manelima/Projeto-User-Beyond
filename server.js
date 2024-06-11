const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
const portfinder = require('portfinder');
const app = express();

app.use(cors());
app.use(express.json()); 

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

// POST "/content"
app.post('/content', async (req, res) => {
  const content = req.body;
  
  // Verifique se o corpo da requisição tem todas as propriedades necessárias
  if (!content.title || !content.body) {
    return res.status(400).send('Corpo da requisição mal formatado');
  }

  // Crie um novo documento no Firestore
  const docRef = await db.collection('usuarios').add(content);

  // Retorne o ID do documento criado
  res.status(201).send(docRef.id);
});

// GET "/contents"
app.get('/contents', async (req, res) => {
  const snapshot = await db.collection('usuarios').get();

  let contents = [];
  snapshot.forEach(doc => {
    let id = doc.id;
    let data = doc.data();

    contents.push({id, ...data});
  });

  res.status(200).send(contents);
});

// PUT "/contents/{contentId}"
app.put('/contents/:contentId', async (req, res) => {
  const { contentId } = req.params;
  const newContent = req.body;

  // Verifique se o corpo da requisição tem todas as propriedades necessárias
  if (!newContent.title || !newContent.body) {
    return res.status(400).send('Corpo da requisição mal formatado');
  }

  // Atualize o documento no Firestore
  await db.collection('usuarios').doc(contentId).set(newContent, { merge: true });

  res.status(204).send();
});

// DELETE "/contents/{contentId}"
app.delete('/contents/:contentId', async (req, res) => {
  const { contentId } = req.params;

  // Remova o documento do Firestore
  await db.collection('usuarios').doc(contentId).delete();

  res.status(204).send();
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

portfinder.getPort((err, port) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
