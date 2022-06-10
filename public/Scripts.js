var bar = document.getElementById('bar');
var close = document.getElementById('close');
var nav = document.getElementById('navbar');

function hamburger() {
    nav.classList.add('active');
}

function hamburger2() {
    nav.classList.remove('active');
}


bar.addEventListener("click", hamburger);
close.addEventListener("click", hamburger2);





let carts = document.querySelectorAll('.addcart');
let stage = 'stage'
let products = [];

 async function getProducts() {
     const host = stage === 'dev' ? 'http://localhost:5000' : 'https://walker-app-syjmq.ondigitalocean.app'
    const response = await axios.get(`${host}/products`);
   console.log(response.data);
   products = response.data.products

   populateProducts();
}
getProducts();

    function populateProducts() {
    const container = document.querySelector('.pro-container');

    const productsHtml = products.map((product, i) => {
           return (
               `
                 <div class="pro">
                  <img src="${product.image}" alt="${product.description}">
                  <div class="des">
                   <span>${product.name}</span>
                   <h5>Men's Running shoes</h5>
                   <h4>${product.price}</h4>
                   <a href="#"><button class="addcart basket${i}">Add To Cart</button></a>
                  </div>
                 </div>
               
               `
         ) 
      })

      if(container) {
          container.innerHTML += productsHtml.toString().replaceAll(',', '');
          addCartActions() 
      }
}

function addCartActions() {
    let carts = document.querySelectorAll('.addcart');

    for (let i = 0; i < carts.length; i++) {
         carts[i].addEventListener('click', () => {
             cartNumbers(products[i]);
             totalCost(products[i]);
         })
        
    }
}

for (let i=0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]); //passing and looping product to our cart//
        totalCost(products[i]);
    })
}

function onloadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers'); 

    if (productNumbers) {                                                      //we are using this function to save the cart numbers after reloading the page//
        document.querySelector('.check span').textContent = productNumbers;
    } 
    
}

function cartNumbers(products, action) {
    let productNumbers = localStorage.getItem('cartNumbers');  //storing cart number to variable//
    productNumbers = parseInt(productNumbers);    //converting product number from string to number//
  
    let cartItems = localStorage.getItem('productsinCart')
    cartItems = JSON.parse(cartItems);

    if ( action == "decrease") {
        localStorage.setItem('cartNumbers', productNumbers -1)
        document.querySelector('.check span').textContent = productNumbers - 1;
    } else if( productNumbers  ) {
        localStorage.setItem("cartNumbers", productNumbers + 1);
        document.querySelector('.check span').textContent = productNumbers + 1;
    }  else {
        localStorage.setItem("cartNumbers", 1);
        document.querySelector('.check  span').textContent = 1;
    }
     

    setItems(products);

}

//if (productNumbers) {
    //localStorage.setItem('cartNumbers', productNumbers +1);                           //we are using this statement to check cart storage before adding any items to the cart//
   // document.querySelector('.check span').textContent = productNumbers +1;
//} else {
    //localStorage.setItem('cartNumbers',1);
    //document.querySelector('.check span').textContent = 1;
//}


function setItems(products) {
    let cartItems = localStorage.getItem('productsinCart');                //this function is use to set thetype of product in the cart
    cartItems = JSON.parse(cartItems);
   

if (cartItems != null) {
  
    if(cartItems[products.tag] === undefined) {             //this statement is use to check if a product already exist in cart before adding anymore
        cartItems = {
            ...cartItems,
            [products.tag]: products
        }
    }
    cartItems[products.tag].inCart +=1
    
} else { 
    products.inCart = 1;
    cartItems = {
        [products.tag]: products
    }
}
    localStorage.setItem("productsinCart", JSON.stringify (cartItems));
  
}
  function totalCost(products, action) {
      //console.log("the product price is", products.price);
    let cartCost = localStorage.getItem('totalCost');

    console.log("my cartCost is", cartCost);
    console.log(typeof cartCost);

    if ( action === "decrease"){
        cartCost = parseInt(cartCost)
        localStorage.setItem('totalCost', cartCost - products.price);
        
    }else if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost + products.price);
    } else {
        localStorage.setItem("totalCost", products.price);
    }

  }

  function displayCart() {
      let cartItems = localStorage.getItem("productsinCart");
      cartItems = JSON.parse(cartItems);
      let productContainer = document.querySelector(".prod1");
      let cartCost = localStorage.getItem('totalCost');
      console.log(cartItems)
      if ( cartItems && productContainer ) {
          productContainer.innerHTML = '';
          Object.values(cartItems).map(item => {
              productContainer.innerHTML += 
              `<div class="p1">
            <i class="fa-solid fa-circle-xmark"></i>
            <img src="./image/${item.tag}.svg" height="100px"/>
              <span>${item.name}</span>
             </div>
             <div class="prices">$${item.price},00</div>
             <div class="quantitys">
             <i   class="fa-solid decrease  fa-circle-chevron-left"></i>
             <span>${item.inCart}</span>
             <i class="fa-solid increase fa-circle-chevron-right"></i>
             </div>
             <div class="totals">
             $${item.inCart * item.price},00
             </div>`

 });

          productContainer.innerHTML += `
              <div class="basketContainer">
                <h4 class="basketTotalTitle">
                    Basket Total
                    </h4>
                    <h4 class="basketTotal">
                    $${cartCost},00
                    </h4>
                    </div>`


       
      }
    deleteButtons();
    manageQuantity();
  }

  function deleteButtons() {
      let deleteButtons = document.querySelectorAll('.p1 .fa-circle-xmark')
       let productName;
       let productNumbers = localStorage.getItem('cartNumbers');
       let cartItems = localStorage.getItem('productsinCart');
       cartItems = JSON.parse(cartItems);
       let cartCost = localStorage.getItem('totalCost');
       

for (let i=0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', () => {
       productName = deleteButtons[i]
       .parentElement.textContent.trim().toLowerCase().replace(/ /g, '');
      // console.log(productName);
       //console.log(cartItems[productName].name + " " + cartItems[productName].inCart);
          
      localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);
      localStorage.setItem('totalCost', cartCost - ( cartItems[productName].price * cartItems[productName].inCart));
     
      delete cartItems[productName];
      localStorage.setItem('productsinCart', JSON.stringify(cartItems));
      
      onloadCartNumbers()
      displayCart();

    });
   }
  }


function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
   let cartItems = localStorage.getItem('productsinCart');
   let currentQuantity = 0;
   let currentProduct = '';
 
   cartItems = JSON.parse(cartItems);
   console.log(cartItems);

    for(let i=0; i < decreaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();
            console.log(currentProduct);
           
            if( cartItems[currentProduct].inCart > 1 ) {
                cartItems[currentProduct].inCart -= 1;
                cartNumbers(cartItems[currentProduct], "decrease");
                totalCost(cartItems[currentProduct], "decrease");
                localStorage.setItem('productsinCart', JSON.stringify(cartItems));
                displayCart();
            }

        });
    }

    for(let i=0; i < increaseButtons.length; i++) {
        increaseButtons[i].addEventListener('click', () => {
            console.log("increase buttons");
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);

          
            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();
            console.log(currentProduct);
           
            
                cartItems[currentProduct].inCart += 1;
                cartNumbers(cartItems[currentProduct]);
                totalCost(cartItems[currentProduct]);
                localStorage.setItem('productsinCart', JSON.stringify(cartItems));
                displayCart();
            
           
        })
    }
}
onloadCartNumbers()
displayCart();

