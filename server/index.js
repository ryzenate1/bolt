const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const products = require('./routes/products');
const upload = require('./routes/upload');
const cards = require('./routes/cards');

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/products', products);
app.use('/api/upload', upload);
app.use('/api/cards', cards);

mongoose.connect('mongodb://localhost:27017/fishshop', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(5001); 