'use client';
import { useState, useEffect } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function IngredientsPage() {
    const [scannedCode, setScannedCode] = useState('');
    const [foundIngredient, setFoundIngredient] = useState(null);
    const [message, setMessage] = useState('');
    const [quantityToAdd, setQuantityToAdd] = useState(1);

    const handleScan = async (barcode) => {
        if (barcode === scannedCode) return; // Evita buscas repetidas
        setScannedCode(barcode);
        setMessage('Buscando...');
        setFoundIngredient(null);
        try {
            const res = await fetch(`${API_URL}/ingredients/barcode/${barcode}`);
            if (res.status === 404) {
                setMessage(`Insumo com código ${barcode} não encontrado. Cadastre-o abaixo.`);
            } else if (res.ok) {
                const data = await res.json();
                setFoundIngredient(data);
                setMessage('Insumo encontrado! Adicione a quantidade de entrada.');
            } else {
                throw new Error('Falha na busca');
            }
        } catch (error) {
            setMessage('Erro ao buscar o insumo.');
        }
    };

    const handleUpdateStock = async () => {
        if (!foundIngredient) return;
        try {
            const res = await fetch(`${API_URL}/ingredients/${foundIngredient.id}/stock`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity_to_add: parseFloat(quantityToAdd) })
            });
            if (res.ok) {
                setMessage(`Estoque de ${foundIngredient.name} atualizado com sucesso!`);
                setFoundIngredient(null);
                setScannedCode('');
            } else {
                throw new Error('Falha ao atualizar estoque');
            }
        } catch (error) {
            setMessage('Erro ao atualizar estoque.');
        }
    };

    return (
        <div>
            <h1>Gerenciamento de Insumos</h1>
            <div className="container">
                <h2>Entrada de Estoque via Código de Barras</h2>
                <BarcodeScanner onScanResult={handleScan} />
                {message && <p><strong>{message}</strong></p>}
                {scannedCode && <p>Código Lido: {scannedCode}</p>}

                {foundIngredient && (
                    <div>
                        <h3>{foundIngredient.name}</h3>
                        <p>Estoque atual: {foundIngredient.stock_quantity} {foundIngredient.unit_of_measure}</p>
                        <input
                            type="number"
                            value={quantityToAdd}
                            onChange={(e) => setQuantityToAdd(e.target.value)}
                            placeholder="Quantidade de entrada"
                        />
                        <button onClick={handleUpdateStock}>Confirmar Entrada</button>
                    </div>
                )}
            </div>
            {/* Aqui entrará o formulário para cadastrar novos insumos e a lista de todos os insumos */}
        </div>
    );
}