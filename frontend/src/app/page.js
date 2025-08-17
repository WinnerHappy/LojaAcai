'use client'; // Essencial para componentes com interatividade e hooks

import { useState } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner'; // Importa nosso componente de scanner

// Esta constante pega a URL da API do nosso arquivo .env.local (para dev) ou das variáveis de ambiente da Vercel (para prod)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
    const [scannedCode, setScannedCode] = useState('');
    const [foundIngredient, setFoundIngredient] = useState(null);
    const [message, setMessage] = useState('Aponte a câmera para um código de barras para começar.');
    const [isLoading, setIsLoading] = useState(false);
    const [quantityToAdd, setQuantityToAdd] = useState(1);

    // Função chamada sempre que o scanner lê um código
    const handleScan = async (barcode) => {
        if (!barcode || barcode === scannedCode || isLoading) return; // Evita buscas repetidas ou durante o carregamento

        setIsLoading(true);
        setScannedCode(barcode);
        setMessage(`Buscando código: ${barcode}...`);
        setFoundIngredient(null);

        try {
            // AQUI ESTÁ A CHAMADA À API USANDO A VARIÁVEL DE AMBIENTE
            const response = await fetch(`${API_URL}/ingredients/barcode/${barcode}`);

            if (response.status === 404) {
                setMessage(`Insumo não cadastrado. Vá para a página "Insumos" para adicioná-lo.`);
                setFoundIngredient(null);
            } else if (response.ok) {
                const data = await response.json();
                setFoundIngredient(data);
                setMessage(`Insumo encontrado! Confirme a quantidade de entrada.`);
            } else {
                // Captura outros erros da API
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao buscar o insumo.');
            }
        } catch (error) {
            setMessage(`Erro: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para confirmar e adicionar a quantidade ao estoque
    const handleUpdateStock = async () => {
        if (!foundIngredient) return;
        setIsLoading(true);
        setMessage(`Atualizando estoque de ${foundIngredient.name}...`);

        try {
            const response = await fetch(`${API_URL}/ingredients/${foundIngredient.id}/stock`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity_to_add: parseFloat(quantityToAdd) })
            });

            if (response.ok) {
                setMessage(`Estoque de "${foundIngredient.name}" atualizado com sucesso!`);
                // Limpa o estado para um novo scan
                setFoundIngredient(null);
                setScannedCode('');
                setQuantityToAdd(1);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao atualizar o estoque.');
            }
        } catch (error) {
            setMessage(`Erro: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Dashboard - Entrada Rápida de Estoque</h1>
            <div className="container">
                <BarcodeScanner onScanResult={handleScan} />

                <div style={{ textAlign: 'center', marginTop: '1rem', minHeight: '50px' }}>
                    {isLoading ? (
                        <p>Carregando...</p>
                    ) : (
                        <p><strong>{message}</strong></p>
                    )}
                </div>

                {foundIngredient && (
                    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                        <h2>{foundIngredient.name}</h2>
                        <p>Estoque Atual: {foundIngredient.stock_quantity} {foundIngredient.unit_of_measure}</p>
                        <div className="form-group">
                            <label htmlFor="quantity">Adicionar ao estoque:</label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantityToAdd}
                                onChange={(e) => setQuantityToAdd(e.target.value)}
                                style={{ marginLeft: '10px', padding: '8px', width: '80px' }}
                                disabled={isLoading}
                            />
                            <button onClick={handleUpdateStock} disabled={isLoading} style={{ marginLeft: '10px' }}>
                                Confirmar Entrada
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}