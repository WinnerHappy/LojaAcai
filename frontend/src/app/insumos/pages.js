'use client';
import { useState, useEffect } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function InsumosPage() {
    const [ingredients, setIngredients] = useState([]);
    const [showScanner, setShowScanner] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        barcode: '',
        stock_quantity: 0,
        unit_of_measure: 'g', // Padrão 'gramas'
    });
    const [message, setMessage] = useState('');

    // Função para buscar a lista de insumos
    const fetchIngredients = async () => {
        try {
            const res = await fetch(`${API_URL}/ingredients`);
            if (!res.ok) throw new Error('Falha ao buscar insumos');
            const data = await res.json();
            setIngredients(data);
        } catch (error) {
            setMessage(`Erro: ${error.message}`);
        }
    };

    // Busca os insumos quando a página carrega
    useEffect(() => {
        fetchIngredients();
    }, []);

    // Atualiza o formulário quando um campo é alterado
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Submete o formulário para criar um novo insumo
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Cadastrando...');
        try {
            const res = await fetch(`${API_URL}/ingredients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Falha ao cadastrar insumo');
            }
            setMessage('Insumo cadastrado com sucesso!');
            setFormData({ name: '', barcode: '', stock_quantity: 0, unit_of_measure: 'g' }); // Limpa o formulário
            fetchIngredients(); // Atualiza a lista
        } catch (error) {
            setMessage(`Erro: ${error.message}`);
        }
    };

    // O que fazer quando o scanner lê um código
    const handleScanResult = (barcode) => {
        setFormData({ ...formData, barcode: barcode }); // Preenche o campo de código de barras
        setShowScanner(false); // Esconde o scanner
        setMessage(`Código ${barcode} capturado! Complete o resto do formulário.`);
    };

    return (
        <div>
            <h1>Gerenciamento de Insumos</h1>
            <div className="container">
                <h2>Cadastrar Novo Insumo</h2>
                {message && <p><strong>{message}</strong></p>}
                
                {/* Botão para mostrar/esconder o scanner */}
                <button onClick={() => setShowScanner(!showScanner)}>
                    {showScanner ? 'Fechar Scanner' : 'Escanear Código de Barras'}
                </button>
                
                {showScanner && (
                    <div style={{marginTop: '1rem'}}>
                        <p>Aponte a câmera para o código de barras ou QR code.</p>
                        <BarcodeScanner onScanResult={handleScanResult} />
                    </div>
                )}

                {/* Formulário de cadastro manual */}
                <form onSubmit={handleSubmit} style={{marginTop: '1.5rem'}}>
                    <div className="form-group">
                        <label htmlFor="barcode">Código de Barras (opcional)</label>
                        <input
                            type="text"
                            id="barcode"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleInputChange}
                            placeholder="Preenchido pelo scanner ou digitado"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Nome do Insumo *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock_quantity">Quantidade Inicial em Estoque *</label>
                        <input
                            type="number"
                            id="stock_quantity"
                            name="stock_quantity"
                            value={formData.stock_quantity}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="unit_of_measure">Unidade de Medida *</label>
                        <select
                            id="unit_of_measure"
                            name="unit_of_measure"
                            value={formData.unit_of_measure}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="g">Gramas (g)</option>
                            <option value="kg">Quilogramas (kg)</option>
                            <option value="ml">Mililitros (ml)</option>
                            <option value="l">Litros (l)</option>
                            <option value="un">Unidade (un)</option>
                        </select>
                    </div>
                    <button type="submit">Adicionar Insumo</button>
                </form>
            </div>

            <div className="container">
                <h2>Insumos em Estoque</h2>
                <table style={{width: '100%', textAlign: 'left'}}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Estoque</th>
                            <th>Código de Barras</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredients.map(ing => (
                            <tr key={ing.id}>
                                <td>{ing.name}</td>
                                <td>{ing.stock_quantity} {ing.unit_of_measure}</td>
                                <td>{ing.barcode || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}