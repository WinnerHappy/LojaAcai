<<<<<<< HEAD
# Sistema de Gestão para Loja de Açaí

Este é um sistema completo (web + mobile responsivo) para gerenciar uma loja de açaí, com foco em controle de insumos, finanças e vendas.

## ✨ Funcionalidades Principais (Versão Inicial)

*   **Gestão de Insumos:** Cadastro e controle de estoque de ingredientes.
*   **Entrada Rápida com Código de Barras:** Use a câmera do celular ou um leitor USB para escanear produtos e dar entrada no estoque de forma rápida.
*   **Controle Financeiro:** Registro de entradas e saídas.
*   **Controle de Vendas:** Registro de vendas feitas por canais como Instagram e WhatsApp.
*   **Baixa Automática de Estoque:** Ao registrar a venda de um produto (ex: "Açaí 500ml"), o sistema automaticamente deduz a quantidade dos insumos ("receita") do estoque.

## 💻 Tech Stack (Tecnologias Utilizadas)

*   **Backend:** Node.js com Express.js
*   **Frontend:** Next.js (React)
*   **Banco de Dados:** Supabase (PostgreSQL)
*   **Autenticação:** Supabase Auth
*   **Hospedagem:** Vercel

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 18 ou superior)
*   [Git](https://git-scm.com/)
*   Uma conta gratuita no [Supabase](https://supabase.com)
*   Uma conta gratuita no [Vercel](https://vercel.com) (para o deploy)

### 1. Backend

```bash
# Navegue até a pasta do backend
cd backend

# Instale as dependências
npm install

# Renomeie o arquivo .env.example para .env
# Preencha com suas credenciais do Supabase

# Inicie o servidor de desenvolvimento
npm start
O backend estará rodando em http://localhost:3001.
2. Frontend
code
Bash
# Em outro terminal, navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
O frontend estará rodando em http://localhost:3000.
code
Code
---

### **Parte 1: O Banco de Dados (Supabase)**

Este é o coração do sistema.

1.  **Crie seu Projeto no Supabase:**
    *   Acesse sua conta no [Supabase](https://supabase.com).
    *   Crie um "**New Project**", dê um nome a ele e salve bem a sua senha do banco de dados.
    *   Aguarde a criação do projeto.

2.  **Execute o Código SQL para Criar as Tabelas:**
    *   No menu lateral esquerdo, vá para **SQL Editor**.
    *   Clique em "**New query**".
    *   Copie **TODO** o código abaixo e cole na janela do editor de SQL.
    *   Clique em "**RUN**". Isso criará todas as tabelas e relacionamentos necessários de uma só vez.

    ```sql
    -- Tabela de Insumos (Ingredientes)
    CREATE TABLE ingredients (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        name TEXT NOT NULL,
        barcode TEXT UNIQUE, -- Código de barras é único
        stock_quantity NUMERIC DEFAULT 0 NOT NULL,
        unit_of_measure TEXT NOT NULL -- ex: 'g', 'ml', 'un'
    );
    COMMENT ON TABLE ingredients IS 'Armazena todos os insumos e ingredientes da loja.';

    -- Tabela de Produtos Vendáveis
    CREATE TABLE products (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        name TEXT NOT NULL,
        price NUMERIC DEFAULT 0 NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL
    );
    COMMENT ON TABLE products IS 'Produtos finais que são vendidos aos clientes (ex: Açaí 500ml).';

    -- Tabela de "Receita" (associa insumos a produtos)
    CREATE TABLE product_ingredients (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        ingredient_id BIGINT NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
        quantity_used NUMERIC NOT NULL
    );
    COMMENT ON TABLE product_ingredients IS 'Define a "receita" de cada produto, especificando quais insumos e quantidades são usados.';

    -- Tabela de Transações Financeiras
    CREATE TABLE transactions (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        description TEXT NOT NULL,
        amount NUMERIC NOT NULL, -- Positivo para entradas, negativo para saídas
        type TEXT NOT NULL, -- 'entrada' ou 'saida'
        category TEXT
    );
    COMMENT ON TABLE transactions IS 'Registra todas as movimentações financeiras.';

    -- Tabela de Vendas
    CREATE TABLE sales (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        channel TEXT, -- 'Instagram', 'WhatsApp', 'iFood'
        total_amount NUMERIC NOT NULL,
        transaction_id BIGINT REFERENCES transactions(id) -- Link com a transação de entrada
    );
    COMMENT ON TABLE sales IS 'Registra os detalhes de cada venda realizada.';

    -- Tabela de Itens da Venda
    CREATE TABLE sale_items (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        sale_id BIGINT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
        product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        quantity INT NOT NULL,
        unit_price NUMERIC NOT NULL
    );
    COMMENT ON TABLE sale_items IS 'Detalha os produtos vendidos em cada venda.';

    ```

3.  **Guarde suas Credenciais:**
    *   Vá em **Project Settings** (ícone de engrenagem) > **API**.
    *   Copie a **Project URL** e a chave **`service_role`**. Guarde-as, vamos usá-las no backend.

---

### **Parte 2: O Cérebro do Sistema (Backend)**

Agora vamos criar a API que conversará com o banco de dados.

1.  **Crie a Estrutura de Pastas e Arquivos:**
    Abra seu terminal e execute estes comandos:

    ```bash
    # Cria a pasta principal
    mkdir gestao-loja-sistema
    cd gestao-loja-sistema

    # Cria e entra na pasta do backend
    mkdir backend
    cd backend

    # Inicia o projeto Node.js e instala dependências
    npm init -y
    npm install express @supabase/supabase-js dotenv cors
    npm install nodemon --save-dev

    # Cria a estrutura de pastas
    mkdir -p src/controllers src/routes src/services
    ```

2.  **Crie os Arquivos e Cole os Códigos:**

    *   **Arquivo `backend/.gitignore`:**
        ```
        /node_modules
        .env
        ```

    *   **Arquivo `backend/.env.example`** (Este é um modelo, você irá renomeá-lo):
        ```
        SUPABASE_URL=SUA_URL_DO_PROJETO_SUPABASE
        SUPABASE_SERVICE_KEY=SUA_CHAVE_SERVICE_ROLE_DO_SUPABASE
        PORT=3001
        ```
        **Ação:** Renomeie este arquivo para `.env` e preencha com as suas credenciais do Supabase.

    *   **Arquivo `backend/package.json`** (Apenas edite a seção `scripts`):
        ```json
        // ... (outras chaves geradas pelo npm init)
        "scripts": {
          "start": "nodemon index.js"
        },
        // ...
        ```

    *   **Arquivo `backend/index.js`:**
        ```javascript
        const express = require('express');
        const cors = require('cors');
        require('dotenv').config();
        const routes = require('./src/routes');

        const app = express();
        const PORT = process.env.PORT || 3001;

        app.use(cors());
        app.use(express.json());
        app.use('/api', routes);

        app.listen(PORT, () => {
            console.log(`Servidor backend rodando na porta ${PORT}`);
        });
        ```

    *   **Arquivo `backend/src/services/supabase.js`:**
        ```javascript
        const { createClient } = require('@supabase/supabase-js');
        require('dotenv').config();

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Credenciais do Supabase não encontradas no arquivo .env");
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        module.exports = supabase;
        ```

    *   **Arquivo `backend/src/controllers/ingredientController.js`:**
        ```javascript
        const supabase = require('../services/supabase');

        const findIngredientByBarcode = async (req, res) => {
            const { barcode } = req.params;
            try {
                const { data, error } = await supabase
                    .from('ingredients')
                    .select('*')
                    .eq('barcode', barcode)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;

                if (!data) {
                    return res.status(404).json({ message: 'Insumo não cadastrado.' });
                }
                res.status(200).json(data);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };

        module.exports = { findIngredientByBarcode };
        ```

    *   **Arquivo `backend/src/routes/index.js`:**
        ```javascript
        const express = require('express');
        const router = express.Router();
        const { findIngredientByBarcode } = require('../controllers/ingredientController');

        router.get('/', (req, res) => res.send('API da Loja de Açaí está no ar!'));
        router.get('/ingredients/barcode/:barcode', findIngredientByBarcode);

        module.exports = router;
        ```

3.  **Teste o Backend:**
    *   No terminal, dentro da pasta `backend`, execute `npm start`.
    *   Você verá a mensagem: `Servidor backend rodando na porta 3001`.

---

### **Parte 3: A Interface (Frontend)**

Vamos criar a tela onde a mágica do scanner acontece.

1.  **Crie a Estrutura de Pastas e Arquivos:**
    *   Abra **outro terminal**. Navegue para a pasta raiz `gestao-loja-sistema`.
    *   Execute os comandos:

    ```bash
    # Cria o projeto Next.js (responda as perguntas como preferir, ex: TypeScript? No, ESLint? Yes, etc.)
    npx create-next-app@latest frontend
    cd frontend

    # Instala a biblioteca para o leitor de código de barras
    npm install react-qr-reader
    ```

2.  **Crie o Arquivo e Cole o Código:**
    *   Dentro da pasta `frontend/src/app/`, substitua o conteúdo do arquivo `page.js` pelo código abaixo. Ele cria uma página simples com o scanner.

    *   **Arquivo `frontend/src/app/page.js`:**
        ```javascript
        'use client'; // Necessário para usar hooks do React no Next.js 13+

        import { useState } from 'react';
        import { QrReader } from 'react-qr-reader';

        export default function Home() {
          const [scanResult, setScanResult] = useState('');
          const [isLoading, setIsLoading] = useState(false);
          const [error, setError] = useState('');
          const [ingredient, setIngredient] = useState(null);

          const handleScan = async (result, error) => {
            if (!!result) {
              const barcode = result?.text;
              setScanResult(barcode);
              setIsLoading(true);
              setError('');
              setIngredient(null);

              try {
                // A URL deve apontar para o seu backend. Para deploy, será a URL da Vercel.
                const response = await fetch(`http://localhost:3001/api/ingredients/barcode/${barcode}`);
                
                if (response.status === 404) {
                  setError('Produto não encontrado! Cadastre este novo insumo.');
                  setIsLoading(false);
                  return;
                }
                
                if (!response.ok) {
                  throw new Error('Falha ao buscar o produto.');
                }

                const data = await response.json();
                setIngredient(data);
              } catch (err) {
                setError(err.message);
              } finally {
                setIsLoading(false);
              }
            }

            if (!!error) {
              console.info(error);
            }
          };

          return (
            <main style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
              <h1>Controle de Estoque - Açaí</h1>
              <p>Aponte a câmera para o código de barras do insumo.</p>

              <div style={{ width: '100%', border: '2px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                <QrReader
                  onResult={handleScan}
                  constraints={{ facingMode: 'environment' }}
                  style={{ width: '100%' }}
                />
              </div>

              {isLoading && <p>Buscando produto...</p>}
              {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
              
              {scanResult && <p>Último código escaneado: <strong>{scanResult}</strong></p>}

              {ingredient && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <h2>Insumo Encontrado!</h2>
                  <p><strong>Nome:</strong> {ingredient.name}</p>
                  <p><strong>Estoque Atual:</strong> {ingredient.stock_quantity} {ingredient.unit_of_measure}</p>
                  <div>
                    <label htmlFor="quantity">Adicionar ao estoque:</label>
                    <input type="number" id="quantity" style={{ marginLeft: '10px', padding: '5px' }} />
                    <button style={{ marginLeft: '10px' }}>Confirmar Entrada</button>
                  </div>
                </div>
              )}
            </main>
          );
        }
        ```

3.  **Teste o Frontend:**
    *   No terminal, dentro da pasta `frontend`, execute `npm run dev`.
    *   Abra seu navegador em `http://localhost:3000`.
    *   Permita o uso da câmera e aponte para qualquer código de barras. Ele vai tentar buscar na sua API. Como ainda não temos nada cadastrado, ele deve mostrar a mensagem de erro "Produto não encontrado!", provando que a comunicação entre frontend e backend está funcionando!

---

### **Parte 4: Colocando no Ar (Vercel)**

Agora, vamos hospedar seu projeto para que ele seja acessível de qualquer lugar.

1.  **Crie um Repositório no GitHub:**
    *   Crie uma conta no [GitHub](https://github.com).
    *   Crie um novo repositório (ex: `gestao-loja-acai`).
    *   Na pasta raiz do seu projeto (`gestao-loja-sistema`), inicie o git e envie seus arquivos:
        ```bash
        git init
        git add .
        git commit -m "Versão inicial do sistema"
        # Siga as instruções do GitHub para conectar seu repositório local ao remoto e dar push
        git remote add origin SEU_LINK_DO_REPOSITORIO.git
        git branch -M main
        git push -u origin main
        ```

2.  **Faça o Deploy do Backend na Vercel:**
    *   Acesse sua conta na [Vercel](https://vercel.com) e conecte-a ao seu GitHub.
    *   Clique em "**Add New...**" > "**Project**".
    *   Importe o repositório que você acabou de criar.
    *   Na tela de configuração, **expanda a seção "Root Directory"** e selecione a pasta `backend`. A Vercel vai detectar que é um projeto Node.js.
    *   Expanda a seção "**Environment Variables**". Adicione as mesmas variáveis do seu arquivo `.env`:
        *   `SUPABASE_URL` com sua URL do Supabase.
        *   `SUPABASE_SERVICE_KEY` com sua chave secreta do Supabase.
    *   Clique em "**Deploy**". Em alguns minutos, seu backend estará online. Copie a URL gerada pela Vercel (ex: `https://seu-backend.vercel.app`).

3.  **Faça o Deploy do Frontend e Conecte ao Backend:**
    *   Volte ao dashboard da Vercel e clique em "**Add New...**" > "**Project**" novamente.
    *   Selecione o **mesmo repositório**.
    *   Desta vez, na configuração, mude o **"Root Directory"** para a pasta `frontend`. A Vercel detectará que é um projeto Next.js.
    *   **IMPORTANTE:** Vá ao seu código do frontend, no arquivo `frontend/src/app/page.js`, e altere a linha do `fetch`:
        ```javascript
        // Altere de:
        const response = await fetch(`http://localhost:3001/api/ingredients/barcode/${barcode}`);
        // Para a URL do seu backend na Vercel:
        const response = await fetch(`https://SEU_BACKEND_URL.vercel.app/api/ingredients/barcode/${barcode}`);
        ```    *   Salve, e envie a alteração para o GitHub (`git add .`, `git commit`, `git push`).
    *   Volte para a Vercel e clique em "**Deploy**" no projeto do frontend. A Vercel automaticamente pegará a última atualização.

**Parabéns!** Ao final desses passos, você terá a base completa do seu sistema, com backend e frontend rodando online, prontos para você continuar o desenvolvimento das outras funcionalidades.
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 6bd8562 (Initial commit from Create Next App)
