const supabase = require('../services/supabase');

exports.createProduct = async (req, res) => {
    const { name, price, ingredients } = req.body; // ingredients é um array: [{ ingredient_id, quantity_used }]
    try {
        // 1. Insere o produto
        const { data: productData, error: productError } = await supabase
            .from('products')
            .insert([{ name, price }])
            .select()
            .single();
        if (productError) throw productError;

        // 2. Associa os ingredientes ao produto
        const recipe = ingredients.map(ing => ({
            product_id: productData.id,
            ingredient_id: ing.ingredient_id,
            quantity_used: ing.quantity_used
        }));

        const { error: recipeError } = await supabase.from('product_ingredients').insert(recipe);
        if (recipeError) throw recipeError;

        res.status(201).json(productData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        // Pega produtos e também os ingredientes da receita de cada um
        const { data, error } = await supabase
            .from('products')
            .select('*, product_ingredients(*, ingredients(name, unit_of_measure))');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};