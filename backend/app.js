const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

let trips = [];

app.get('/trips', (req, res) => {
  res.json(trips);
});

app.post('/trips', (req, res) => {
  const newTrip = {
    id: Date.now(),
    ...req.body,
    attractions: req.body.attractions || [],
  };

  trips.push(newTrip);
  res.status(201).json(newTrip);
});

app.put('/trips/:id', (req, res) => {
  const id = Number(req.params.id);

  const index = trips.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Trip not found' });

  trips[index] = {
    ...trips[index],
    ...req.body,
  };

  res.json(trips[index]);
});

app.delete('/trips/:id', (req, res) => {
  const id = Number(req.params.id);

  trips = trips.filter(t => t.id !== id);

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});