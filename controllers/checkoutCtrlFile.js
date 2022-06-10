const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { productsList } = require('../products');


exports.checkoutCtrlFunction = async (req, res) => {
  try {
    const productsFromFrontend = req.body.products;
    // console.log(productList);

    function productsToBuy() {
      let products = [];
      
      productsList.forEach( singleProductsList => {
        productsFromFrontend.forEach(singleProductsFrontend => {
          if( singleProductsList.tag === singleProductsFrontend.tag ) {
            products.push({
              name: singleProductsList.name,
              description: singleProductsList.description,
              images: [singleProductsList.image],
              amount: singleProductsList.price * 100,
              currency: 'usd',
              quantity: singleProductsFrontend.inCart
            })
          }
        })
      })

      return products
    }

    console.log(productsToBuy())

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US', 'GB']
      },
      line_items: productsToBuy()
    });

    res.status(200).json({
      status: "success",
      session: session
    })
  } catch (error) {
    console.log(error);
  }
}

exports.cartSuccessFunction = (req, res) => {
  res.render('thankyouPage');
}

exports.finishOrder = async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(
    req.params.id
  )

  console.log("My payment was: ");
  console.log(session);

  if(session.payment_status === "paid") {
   
  
    
 
 
    return res.status(200).json({
      success: true
    })
  }

  res.status(200).json({
    success: false
  })
}
