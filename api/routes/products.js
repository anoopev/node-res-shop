const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        console.log("All Products from DB: ", docs);
        const response = {
            count: docs.length,
            products: docs
        }
        if (docs.length >= 0) {
            res.status(200).json(response);
        }
        else {
            res.status(404).json({
                message: "No entries found!"
            });
        }
       
    })
    .catch(err => {
        console.log("Error when fetching all products from DB: ", err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log("Product saved in database: ", result);
        res.status(201).json({
            message: 'Handling POST requests to /products',
            createdProduct: result
        });
    })
    .catch(err => {
        console.log("Product POST Error: ", err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec().then( doc => {
        console.log("Product Find result from database: ", doc);
        if (doc) {
            res.status(200).json(doc);
        }
        else {
            res.status(404).json({ message: "Product doesn't exist with this id!"});
        }
        
    })
    .catch(err => {
        console.log("Error in Product Find: ", err);
        res.status(500).json({ error: err });
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        console.log("Patch request to DB result: ", result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log("Error when PATCH to DB: ", err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log("Error when deleting from DB: ". err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;