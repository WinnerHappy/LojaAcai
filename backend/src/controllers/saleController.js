const supabase = require('../services/supabase');

exports.createSale = async (req, res) => {
    const { channel, items } = req.body; // items é um array: [{ product_id, quantity, unit_price }]
    try {
        const total_amount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

        // 1. Cria a transação financeira de entrada
        const { data: transData, error: transError } = await supabase
            .from('transactions')
            .insert({ description: `Venda via ${channel}`, amount: total_amount, type: 'entrada', category: 'Venda' })
            .select().single();
        if (transError) throw transError;
        
        // 2. Registra a venda
        const { data: saleData, error: saleError } = await supabase
            .from('sales')
            .insert({ channel, total_amount, transaction_id: transData.id })
            .select().single();
        if (saleError) throw saleError;
        
        // 3. Registra os itens da venda
        const saleItems = items.map(item => ({
            sale_id: saleData.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price
        }));
        const { error: itemsError } = await supabase.from('sale_items').insert(saleItems);
        if (itemsError) throw itemsError;

        // 4. Baixa no estoque (a parte mais complexa)
        for (const item of items) {
            const { data: recipe, error: recipeError } = await supabase
                .from('product_ingredients')
                .select('*')
                .eq('product_id', item.product_id);

            if (recipeError) throw recipeError;

            for (const ingredient of recipe) {
                const quantity_to_deduct = ingredient.quantity_used * item.quantity;
                await supabase.rpc('update_stock', { 
                    ingredient_id_in: ingredient.ingredient_id,
                    quantity_in: -quantity_to_deduct // Usa número negativo para subtrair
                });
            }
        }

        res.status(201).json(saleData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};