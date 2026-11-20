const Cart=require("../models/cart");

exports.cartRemove=async (req,res)=>{
    try{
        const id=req.params.id;
        const cart = await Cart.findOne({
            user: req.user.id,
            "items._id": id
        }) || await Cart.findOne({ user: req.user.id });

        if(!cart){
            return res.status(404).json({error: 'Cart not found'});
        }
        cart.items = cart.items.filter(item => item._id.toString() !== id);
        await cart.save();
        res.json({ message: "Cart item deleted"});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

exports.myCart=async (req,res)=>{
    try{
        const cart = await Cart.find({ user: req.user.id })
            .populate("items.product");
        const result = cart.flatMap(car =>
            car.items
                .filter(item => item && item.product)
                .map(item => ({
                    _id: item._id,
                    product: item.product,
                    quantity: item.quantity,
                    orderId: car._id
                }))
        );
        res.json(result);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

exports.cartUpdate=async (req,res)=>{
    try{
        const id=req.params.id;
        const quantity=Number(req.body.quantity);
        if (quantity < 1) {
            return res.status(400).json({ error: "Quantity must be at least 1" });
        }
        const cart = await Cart.findOne({
            user: req.user.id,
            "items._id": id
        });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const item = cart.items.id(id);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        item.quantity = quantity;
        await cart.save();

        res.json({ message: "Quantity updated", cart });
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
};


