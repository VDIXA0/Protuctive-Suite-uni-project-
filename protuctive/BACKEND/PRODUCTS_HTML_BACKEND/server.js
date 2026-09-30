const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());

const productRoutes = require('./routers/productRoutes');
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('products backend running');
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`products backend running on port ${PORT}`);
});
