import { get } from "./services.js";
import { post } from "./services.js";
import { patch } from "./services.js";
import { remove } from "./services.js";

const openCartBtnEl = document.querySelector(".open-cart-btn");
const shoppingCartEl = document.querySelector(".shopping-cart");
const closeCartBtnEl = document.querySelector(".close-cart-btn");

const productsListEl = document.querySelector(".products-list");

const cartItemsEl = document.querySelector(".cart-items");

const productsCountEl = document.querySelector(".products-count");

const subTotalEl = document.querySelector(".sub-total");

// Array to store all our products
let productsList = [];

// Function to fetch and display the list of products from the server
function showProductsList() {
    // Clear the products list before displaying new data
    productsListEl.innerHTML = "";

    // Fetch products from the server and display them
    get("http://localhost:3000/products").then(products => {
        // Store fetched products
        productsList = products;

        products.forEach((product, index) => {
            const productCardEl = document.createElement("article");
            productCardEl.className = "product-card";
            productCardEl.innerHTML = `
                <div class="card-head">
                    <img src="images/${product.image}" alt="${product.name}">
                </div>
                <div class="card-body">
                    <p class="product-title">
                        ${product.name}
                    </p>
                    <span class="product-price">
                        $${product.price}
                    </span>
                </div>
                <div class="card-foot">
                    <button 
                        class="add-to-cart-btn"
                        onclick="addToCart(${index})"
                    >
                        Add To Cart
                    </button>
                </div>
            `;
            // Append product card to the list
            productsListEl.appendChild(productCardEl);
        });
    });
}

// Call function to show the product list when the page loads
showProductsList();

// Function to handle adding a product to The Shopping Cart
async function addToCart(index) {
    // Get the product by ID
    const response = await fetch(
        `http://localhost:3000/cart?id=${productsList[index].id}`
    );

    // Get the cart item with the target ID
    const cartItems = await response.json();

    // If the product is already in the cart, update the quantity
    if (cartItems.length > 0) {
        const cartItem = cartItems[0];
        patch(`http://localhost:3000/cart/${cartItem.id}`, cartItem.quantity + 1)
    } else {
        // If the product is not in the cart, add it
        post(`http://localhost:3000/cart`, {
            ...productsList[index],
            quantity: 1
        }).then(_ => reloadCart());
    }
}

// Making the 'addToCart' function globally accessible
window.addToCart = addToCart;

// Function to reload the cart and display the cart items
function reloadCart() {
    // Clear the cart before reloading
    cartItemsEl.innerHTML = "";

    // variable to track the total price of items in the cart
    let totalPrice = 0;

    // Fetch cart items and display them
    get("http://localhost:3000/cart").then(cartItems => {
        // Display the number of products in the cart
        productsCountEl.innerHTML = cartItems.length;

        if (cartItems.length > 0) {
            cartItems.forEach(cartItem => {
                // Calculate total price
                totalPrice += cartItem.price * cartItem.quantity;

                const cartItemEl = document.createElement("div");
                cartItemEl.className = "cart-item";

                cartItemEl.innerHTML = `
                    <div class="item-img">
                        <img src="images/${cartItem.image}" alt="${cartItem.name}">
                    </div>
                    <div class="item-info">
                        <p class="item-title">
                            ${cartItem.name}
                        </p>
                        <span class="item-price">
                            $${cartItem.price}
                        </span>
                    </div>
                    <form class="quantity-control">
                        <button 
                            class="decrease-btn"
                            onclick="decreaseQuantity(
                                event,
                                ${cartItem.id},
                                ${cartItem.quantity}
                            )"
                        >
                            -
                        </button>
                        <input type="text" value="${cartItem.quantity}" readonly>
                        <button 
                            class="increase-btn"
                            onclick="increaseQuantity(
                                event,
                                ${cartItem.id},
                                ${cartItem.quantity}
                            )"
                        >
                            +
                        </button>
                    </form>
                `;
                // Append each cart item to the cart
                cartItemsEl.appendChild(cartItemEl);
            });
        } else {
            // Message if the cart is empty
            cartItemsEl.innerHTML = `<p class="no-items">No Items To Show</p>`
        }
        // Display the Sub Total:
        subTotalEl.innerHTML = `$${totalPrice.toFixed(2)}`;
    });
}

// Reload the cart when the page loads
reloadCart();

// Function to Increase the quantity of a product in the cart
function increaseQuantity(event, id, quantity) {
    // Prevent the default form submissiob
    event.preventDefault();

    patch(`http://localhost:3000/cart/${id}`, quantity + 1)
    .then(_ => reloadCart());
}

// Make the 'increaseQuantity' function globally accessible
window.increaseQuantity = increaseQuantity;

// Function to Decrease the quantity of a product in the cart
function decreaseQuantity(event, id, quantity) {
    // Prevent the default form submission
    event.preventDefault();

    if (quantity > 1) {
        // Update the quantity
        patch(`http://localhost:3000/cart/${id}`, quantity - 1)
        .then(_ => reloadCart());
    } else {
        // If the quantity is zero, remove the item from the cart
        remove(`http://localhost:3000/cart/${id}`)
        .then(_ => reloadCart());
    }
}

// Make the 'decreaseQuantity' function globally accessible
window.decreaseQuantity = decreaseQuantity;

openCartBtnEl.addEventListener("click", () => {
    shoppingCartEl.classList.add("opened");
});

closeCartBtnEl.addEventListener("click", () => {
    shoppingCartEl.classList.remove("opened");
});

// Close the shopping cart if clicked outside of it:
document.addEventListener("click", (event) => {
    if (
        !shoppingCartEl.contains(event.target) &&
        !openCartBtnEl.contains(event.target)
    ) {
        shoppingCartEl.classList.remove("opened");
    }
});
