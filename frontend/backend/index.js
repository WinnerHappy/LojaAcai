const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ingredientRoutes = require('./src/routes/ingredientRoutes');
const productRoutes = require('./src/routes/productRoutes');
const saleRoutes = require('./src/routes/saleRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.get('/api', (req, res) => res.send('API da Loja de Açaí está no ar!'));
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});