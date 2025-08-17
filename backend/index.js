const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ingredientRoutes = require('./src/routes/ingredientRoutes');
const productRoutes = require('./src/routes/productRoutes');
const saleRoutes = require('./src/routes/saleRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// --- INÍCIO DA CORREÇÃO DE CORS ---

// Lista de origens (URLs) que têm permissão para acessar nosso backend.
const allowedOrigins = [
    'http://localhost:3000', // Permissão para o seu ambiente de desenvolvimento local
    'https://loja-acai-fhow.vercel.app' // << IMPORTANTE: A URL exata do seu frontend na Vercel
];

const corsOptions = {
    origin: (origin, callback) => {
        // Se a origem da requisição estiver na nossa lista de permissões,
        // ou se for uma requisição sem origem (como um app mobile ou Postman), permita.
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Não permitido pela política de CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    allowedHeaders: 'Content-Type,Authorization' // Cabeçalhos permitidos
};

// Use as opções de CORS configuradas
app.use(cors(corsOptions));

// --- FIM DA CORREÇÃO DE CORS ---

// Middlewares
app.use(express.json());

// Rotas da API
app.get('/api', (req, res) => res.send('API da Loja de Açaí está no ar!'));
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});