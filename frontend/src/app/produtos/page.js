'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductsPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch(`${API_URL}/products`);
            const data = await res.json();
            setProducts(data);
        };
        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Produtos (Açaí e Combos)</h1>
            <div className="container">
                <h2>Criar Novo Produto</h2>
                {/* O formulário de criação de produto com seleção de insumos virá aqui */}
                <p>Em construção...</p>
            </div>
            <div className="container">
                <h2>Produtos Cadastrados</h2>
                <ul>
                    {products.map(product => (
                        <li key={product.id}>{product.name} - R$ {product.price}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}