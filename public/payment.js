stage = 'prod';

const host = stage === 'dev' ? 'http://localhost:5000' : 'https://walker-app-syjmq.ondigitalocean.app'

const stripe = Stripe('pk_live_51L6RyAHIGSx0fTGc7GUAnjLqLs5L7X9nomX7C94mtv2DeKdZTp1JwgvQdd1NoyK46hD2lDbdmyFNuRyPgcC0Smwt00FkzpOhtC');

const startCheckout = document.getElementById('startCheckout');

startCheckout.addEventListener('click', () => {
    console.log("btn clicked");
    startCheckout.textContent = "processing..."
    buyProducts(myProducts())
});

function myProducts() {
    const getProducts = JSON.parse(localStorage.getItem('productsinCart'))
    
    const products = [];
    console.log(getProducts);
    for( const property in getProducts) {
        products.push({
            tag: getProducts[property].tag,
            inCart: getProducts[property].inCart
        })
    }
   return products;
}

async function buyProducts(cartProducts) {
    try {
        const body = JSON.stringify({
            products: cartProducts
        })

        const response = await axios.post(`${host}/checkout`, body, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
        
        console.log(response.data);
        localStorage.setItem('sessionId', response.data.session.id);

        await stripe.redirectToCheckout({
            sessionId: response.data.session.id
        })

    } catch (error) {
      console.log(error);  
    }
}