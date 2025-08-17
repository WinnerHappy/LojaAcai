'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SalesPage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [channel, setChannel] = useState('WhatsApp');

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch(`${API_URL}/products`);
            const data = await res.json();
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const addToCart = (product) => {
        setCart([...cart, { ...product, quantity: 1 }]);
    };
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    const handleRegisterSale = async () => {
        const saleData = {
            channel,
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price
            }))
        };

        const res = await fetch(`${API_URL}/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleData)
        });

        if (res.ok) {
            alert('Venda registrada com sucesso!');
            setCart([]);
        } else {
            alert('Erro ao registrar venda.');
        }
    };

    return (
        <div>
            <h1>Registrar Nova Venda</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="container">
                    <h2>Produtos Disponíveis</h2>
                    {products.map(product => (
                        <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                            <span>{product.name} - R$ {product.price}</span>
                            <button onClick={() => addToCart(product)}>+</button>
                        </div>
                    ))}
                </div>
                <div className="container">
                    <h2>Carrinho</h2>
                    <select value={channel} onChange={(e) => setChannel(e.target.value)}>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Balcão">Balcão</option>
                    </select>
                    <ul>
                        {cart.map((item, index) => (
                            <li key={index}>{item.name} (x{item.quantity})</li>
                        ))}
                    </ul>
                    <h3>Total: R$ {total}</h3>
                    <button onClick={handleRegisterSale} disabled={cart.length === 0}>Finalizar Venda</button>
                </div>
            </div>
        </div>
    );
}