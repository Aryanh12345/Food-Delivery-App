const cart = [];

var swiper = new Swiper('.mySwiper', {
    loop: true,

    autoplay: {
        delay: 3000,          // 3000 ms = 3 seconds
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: '#next',
        prevEl: '#prev',
    },
});


const value = document.querySelector(".cart-value");
const hamburger = document.querySelector(".hamburger");
const mobile = document.querySelector(".mobile-menu");
const bars = document.querySelector(".fa-bars");
const carttab = document.querySelector(".cart-tab");
const carticon = document.querySelector(".cart-icon");
carticon.addEventListener("click", () => {
    carttab.classList.add('cart-tab-active');
});

const closebtn = document.querySelector(".close-btn");
closebtn.addEventListener('click', () =>{
    carttab.classList.remove('cart-tab-active');
})

const cardlist = document.querySelector(".card-list");
async function cardlistshow() {
    const response = await fetch("products.json");
    const products = await response.json();

    products.forEach(order => {

        const id = document.createElement
        const ordercard = document.createElement("div");
        ordercard.classList.add("order-card");

        const cardimage = document.createElement("div");
        cardimage.classList.add("card-image");

        const img = document.createElement("img");
        img.src = order.image;
        img.alt = order.name;

        const name = document.createElement("h4");
        name.textContent = order.name;
        
        const price = document.createElement("h4");
        price.classList.add("price");
        price.textContent = order.price;

        const btn = document.createElement("a");
        btn.classList.add("btn");
        btn.href = "#"
        btn.textContent = "Add to Cart";

        cardimage.appendChild(img);

        ordercard.appendChild(cardimage);
        ordercard.appendChild(name);
        ordercard.appendChild(price);
        ordercard.appendChild(btn);

        cardlist.appendChild(ordercard);


        btn.addEventListener('click', (e) => {
            e.preventDefault();
            addtocart(order); 
            updateCartTotal();
        });
    });
}

cardlistshow();

function addtocart(order){

    const existing = cart.find(item => item.id === order.id);
    

    if(existing){

        existing.quantity++;

        // Update the quantity already shown in the cart
        const quantity = document.querySelector(
            `[data-id="${order.id}"] .quantity-value`
        );

        quantity.textContent = existing.quantity;

        const totalPrice = document.querySelector(
            `[data-id="${order.id}"] .item-total`
        );

        const price = parseFloat(existing.price.replace("$", ""));
        totalPrice.textContent = `$${(price * existing.quantity).toFixed(2)}`;
        alert("Item is in your cart Check it.");

    }else{
        cart.push({
            ...order,
            quantity: 1
        });
        cartlistitem(cart[cart.length - 1]);
    }
}

const cartlist = document.querySelector(".cart-list");
function cartlistitem(order){
    const item = document.createElement("div");
    item.classList.add("item","flex","gap-1");
    item.dataset.id = order.id;


    const imagecontainer = document.createElement("div");
    imagecontainer.classList.add("image-container");

    const imgs = document.createElement("img");
    imgs.src = order.image;
    imgs.alt = order.name;

    imagecontainer.appendChild(imgs);
    
    const itemcontainer = document.createElement("div");
    itemcontainer.classList.add("item-container");

    const name1 = document.createElement("h4");
    name1.textContent = order.name;

    const price1 = document.createElement("h4");
    price1.classList.add("item-total");
    price1.innerHTML = order.price;

    itemcontainer.appendChild(name1);
    itemcontainer.appendChild(price1);

    const quantity = document.createElement("div");
    quantity.classList.add("quantity", "flex");

    const minus = document.createElement("a");
    minus.classList.add("quantity-btn");
    minus.href = "#";
    
    const i1 = document.createElement("i");
    i1.classList.add("fa-solid", "fa-minus");

    minus.appendChild(i1);

    const quantityvalue = document.createElement("h4");
    quantityvalue.classList.add("quantity-value");
    quantityvalue.textContent = order.quantity;
    
    const plus = document.createElement("a");
    plus.classList.add("quantity-btn");
    plus.href = "#";

    const i2 = document.createElement("i");
    i2.classList.add("fa-solid","fa-plus");

    plus.appendChild(i2);

    quantity.appendChild(minus);
    quantity.appendChild(quantityvalue);
    quantity.appendChild(plus);

    item.appendChild(imagecontainer);
    item.appendChild(itemcontainer);
    item.appendChild(quantity);

    const total = document.querySelector(".cart-total");
    total.innerHTML = `${order.price}`;

    cartlist.appendChild(item);


    plus.addEventListener('click', () => {
        order.quantity++;
        quantityvalue.textContent = order.quantity;
        const price = parseFloat(order.price.replace("$", ""));
        price1.textContent = `$${(price * order.quantity).toFixed(2)}`;
        updateCartTotal();
    })
    minus.addEventListener('click', () => {
        if(order.quantity === 1){
            item.classList.add("slide-out");
            setTimeout(()=>{
                const index = cart.findIndex(item => item.id === order.id);

                if (index !== -1) {
                    cart.splice(index, 1);
                }

                item.remove();
                updateCartTotal();
            }, 300);

        } else {
            order.quantity--;
            quantityvalue.textContent = order.quantity;

            const price = parseFloat(order.price.replace("$", ""));
            price1.textContent = `$${(price * order.quantity).toFixed(2)}`;
        }
        updateCartTotal();
    })
    updateCartTotal();
}


function updateCartTotal() {

    let total = 0;
    let totalQ = 0;

    cart.forEach(item => {

        const price = parseFloat(item.price.replace("$", ""));
        total += price * item.quantity;

        totalQ += item.quantity;
    });

    document.querySelector(".cart-total").textContent =
        `$${total.toFixed(2)}`;

    value.textContent = totalQ;
}


hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    mobile.classList.toggle("mobile-menu-active");
    bars.classList.toggle("fa-bars");
    bars.classList.toggle("fa-xmark");
});

window.addEventListener("click", (e) => {
    if (!mobile.contains(e.target) && !hamburger.contains(e.target)) {
        mobile.classList.remove("mobile-menu-active");
    }
    if (!carticon.contains(e.target) && !carttab.contains(e.target)) {
        carttab.classList.remove("cart-tab-active");
    }
});