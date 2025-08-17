// backend/src/controllers/ingredientController.js
const supabase = require('../services/supabase');

// FUNÇÃO PARA CRIAR UM NOVO INSUMO
exports.createIngredient = async (req, res) => {
    const { name, barcode, stock_quantity, unit_of_measure } = req.body;
    try {
        // Validação simples
        if (!name || !stock_quantity || !unit_of_measure) {
            return res.status(400).json({ error: 'Nome, quantidade e unidade são obrigatórios.' });
        }

        const { data, error } = await supabase
            .from('ingredients')
            .insert([{ name, barcode: barcode || null, stock_quantity, unit_of_measure }])
            .select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNÇÃO PARA LISTAR TODOS OS INSUMOS
exports.getAllIngredients = async (req, res) => {
    try {
        const { data, error } = await supabase.from('ingredients').select('*').order('name', { ascending: true });
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// FUNÇÃO PARA BUSCAR INSUMO POR CÓDIGO DE BARRAS
exports.findIngredientByBarcode = async (req, res) => {
    const { barcode } = req.params;
    try {
        const { data, error } = await supabase.from('ingredients').select('*').eq('barcode', barcode).single();
        if (error && error.code !== 'PGRST116') throw error;
        if (!data) return res.status(404).json({ message: 'Insumo não cadastrado.' });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateIngredientStock = async (req, res) => {
    const { id } = req.params;
    const { quantity_to_add } = req.body;
    try {
        // Esta é uma operação que deveria ser uma transação. Para simplicidade, usamos RPC.
        // Crie uma função no SQL Editor do Supabase:
        // CREATE OR REPLACE FUNCTION update_stock(ingredient_id_in BIGINT, quantity_in NUMERIC)
        // RETURNS void AS $$
        //     UPDATE ingredients
        //     SET stock_quantity = stock_quantity + quantity_in
        //     WHERE id = ingredient_id_in;
        // $$ LANGUAGE sql;
        const { error } = await supabase.rpc('update_stock', { ingredient_id_in: id, quantity_in: quantity_to_add });
        if (error) throw error;
        res.status(200).json({ message: 'Estoque atualizado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};