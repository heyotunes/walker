const { productsList } = require('../products')

exports.productsCtrlFunction = (req, res) => {
    try {

    res.status(200).json({
        products: productsList
    })

    } catch (error) {
        console.log(error);
    }
}