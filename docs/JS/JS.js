document.addEventListener('DOMContentLoaded', readyToLoad);

function readyToLoad() {
    // Set up event listeners for adding items to the cart
    let addToCartButtons = document.getElementsByClassName('add-to-cart');
    for (let i = 0; i < addToCartButtons.length; i++) {
        let cartButton = addToCartButtons[i];
        cartButton.addEventListener('click', addToCart);
    }

    // Load saved cart items from local storage and update cart
    loadCartFromStorage();

    // Event listener for Buy Now button to navigate to checkout page
    document.getElementById('BuyNowButton').addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });

    // Event listeners for opening and closing the cart
    document.querySelector('.openCart').addEventListener('click', openCartClicked);
    document.querySelector('.closeCart').addEventListener('click', closeCartClicked);

    // Set up event listeners for cart item removal buttons
    updateCartListeners();

    // Event listener for Add to Favorites button
    document.querySelector('.save-to-favorites').addEventListener('click', saveToFavorites);

    // Event listener for Apply Favorites button
    document.querySelector('.apply-favorites').addEventListener('click', applyFavorites);
}

function updateCartListeners() {
    // Set up event listeners for cart item removal buttons
    let removeCartItemButtons = document.getElementsByClassName("button-remove");
    for (let i = 0; i < removeCartItemButtons.length; i++) {
        let removeButton = removeCartItemButtons[i];
        removeButton.addEventListener('click', removeCartItems);
    }

    // Set up event listeners for quantity input changes
    let quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for (let i = 0; i < quantityInputs.length; i++) {
        let quantityInput = quantityInputs[i];
        quantityInput.addEventListener('change', quantityChanged);
    }
}

// Function to handle adding items to the cart
function addToCart(event) {
    let addButton = event.target;
    let shopItem = addButton.closest('.product'); 
    let title = shopItem.querySelector('.product-title').innerText;
    let price = shopItem.querySelector('.product-price').innerText.replace('Price:', '').replace('Rs.', '').replace('/=', '');
    let imageSrc = shopItem.querySelector('.product-image').src;
    let quantity = parseFloat(shopItem.querySelector('input').value);

    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
    }

    let cartItems = JSON.parse(localStorage.getItem('cartData')) || [];
    let existingItem = cartItems.find(item => item.name === title);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({name: title, price: parseFloat(price), quantity: quantity, image: imageSrc});
    }

    localStorage.setItem('cartData', JSON.stringify(cartItems));
    updateCartTotal(cartItems);
    loadCartItems(cartItems);  // Ensure the cart display is updated
}

// Function to update cart total
function updateCartTotal(cartItems) {
    let total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.querySelector('.total').innerText = 'Rs.' + total.toFixed(2) + '/=';
}


// Function to load cart items from local storage and update the cart
function loadCartFromStorage() {
    let cartItems = JSON.parse(localStorage.getItem('cartData')) || [];
    loadCartItems(cartItems);
}

// Function to load cart items into the cart display
function loadCartItems(cartItems) {
    const cartContainer = document.querySelector('.cart .listCart');
    cartContainer.innerHTML = ''; // Clear current items

    cartItems.forEach((item, index) => {
        const cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');
        cartRow.innerHTML = `
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${item.image}" width="100" height="100">
                <span class="cart-item-title">${item.name}</span>
            </div>
            <span class="cart-price cart-column">Rs.${item.price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="${item.quantity}" step="1">
                <i class="fa fa-trash-o button-remove"></i>
            </div>
        `;

        cartContainer.append(cartRow);
    });

    updateCartTotal(cartItems);
    updateCartListeners(); // Reattach listeners after loading items
}

// Function to handle cart item removal
function removeCartItems(event) {
    let buttonClicked = event.target;
    let cartItems = JSON.parse(localStorage.getItem('cartData')) || [];
    let index = Array.from(buttonClicked.closest('.cart-row').parentElement.children).indexOf(buttonClicked.closest('.cart-row'));

    cartItems.splice(index, 1);
    localStorage.setItem('cartData', JSON.stringify(cartItems));
    loadCartItems(cartItems);
}

// Function to update cart total when quantity is changed
function quantityChanged(event) {
    let quantityInput = event.target;
    let cartItems = JSON.parse(localStorage.getItem('cartData')) || [];
    let index = Array.from(quantityInput.closest('.cart-row').parentElement.children).indexOf(quantityInput.closest('.cart-row'));

    if (isNaN(quantityInput.value) || quantityInput.value <= 0) {
        quantityInput.value = cartItems[index].quantity;
        return;
    }

    cartItems[index].quantity = parseFloat(quantityInput.value);
    localStorage.setItem('cartData', JSON.stringify(cartItems));
    updateCartTotal(cartItems);
}

// Function to clear the cart
function clearCart() {
    localStorage.removeItem('cartData');
    document.querySelector('.cart').innerHTML = '';
    updateCartTotal([]);
}

// Function to open the cart
function openCartClicked() {
    document.body.classList.add('active');
}

// Function to close the cart
function closeCartClicked() {
    document.body.classList.remove('active');
}

// Function to save cart items to favorites
function saveToFavorites() {
    let cartItems = JSON.parse(localStorage.getItem('cartData')) || [];
    localStorage.setItem('favoriteItems', JSON.stringify(cartItems));
    alert('Items saved to favorites!');
}

// Function to apply favorite items to the cart
function applyFavorites() {
    let favoriteItems = JSON.parse(localStorage.getItem('favoriteItems')) || [];
    let cartItems = JSON.parse(localStorage.getItem('cartData')) || [];

    favoriteItems.forEach(favItem => {
        let existingItem = cartItems.find(cartItem => cartItem.name === favItem.name);

        if (existingItem) {
            existingItem.quantity += favItem.quantity;
        } else {
            cartItems.push(favItem);
        }
    });

    localStorage.setItem('cartData', JSON.stringify(cartItems));
    loadCartItems(cartItems);
    alert('Favorite items added to cart!');
}
