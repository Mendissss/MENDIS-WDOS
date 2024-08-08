document.addEventListener('DOMContentLoaded', function() {
    let cartData = JSON.parse(localStorage.getItem('cartData')) || [];
    const cartItemsList = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutForm = document.getElementById('checkout-form');
    const thankYouMessage = document.getElementById('thank-you-message');
    const deliveryDateElement = document.getElementById('delivery-date');
    let total = 0;

    // Load cart items
    function loadCartItems() {
        cartItemsList.innerHTML = '';
        total = 0;

        cartData.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${item.image}" alt="${item.name}" width="100" height="100"> 
                ${item.name} - Rs.${item.price} x ${item.quantity} 
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsList.appendChild(li);
            total += item.price * item.quantity;
        });

        totalPriceElement.textContent = `Rs.${total.toFixed(2)}`;
    }

    // Validate the form fields
    function validateForm() {
        let isValid = true;
        let errorMessage = "";

        // Get the form inputs
        const fullName = document.getElementById('fname');
        const email = document.getElementById('email');
        const address = document.getElementById('address');
        const city = document.getElementById('city');
        const state = document.getElementById('state');
        const zip = document.getElementById('zip');
        const cardName = document.getElementById('cname');
        const cardNumber = document.getElementById('ccnum');
        const expMonth = document.getElementById('expmonth');
        const expYear = document.getElementById('expyear');
        const cvv = document.getElementById('cvv');

        // Full Name validation
        if (fullName.value.trim() === "") {
            isValid = false;
            errorMessage += "Full Name is required.\n";
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            isValid = false;
            errorMessage += "Please enter a valid email address.\n";
        }

        // Address validation
        if (address.value.trim() === "") {
            isValid = false;
            errorMessage += "Address is required.\n";
        }

        // City validation
        if (city.value.trim() === "") {
            isValid = false;
            errorMessage += "City is required.\n";
        }

        // State validation
        if (state.value.trim() === "") {
            isValid = false;
            errorMessage += "State is required.\n";
        }

        // Zip validation
        if (zip.value.trim() === "" || isNaN(zip.value.trim())) {
            isValid = false;
            errorMessage += "Please enter a valid zip code.\n";
        }

        // Card Name validation
        if (cardName.value.trim() === "") {
            isValid = false;
            errorMessage += "Name on Card is required.\n";
        }

        // Card Number validation
        const cardNumberPattern = /^\d{16}$/;
        if (!cardNumberPattern.test(cardNumber.value.trim())) {
            isValid = false;
            errorMessage += "Please enter a valid 16-digit credit card number.\n";
        }

        // Expiry Month validation
        if (expMonth.value.trim() === "" || isNaN(expMonth.value.trim()) || expMonth.value < 1 || expMonth.value > 12) {
            isValid = false;
            errorMessage += "Please enter a valid expiry month (1-12).\n";
        }

        // Expiry Year validation
        const currentYear = new Date().getFullYear();
        if (expYear.value.trim() === "" || isNaN(expYear.value.trim()) || expYear.value < currentYear) {
            isValid = false;
            errorMessage += "Please enter a valid expiry year.\n";
        }

        // CVV validation
        const cvvPattern = /^\d{3,4}$/;
        if (!cvvPattern.test(cvv.value.trim())) {
            isValid = false;
            errorMessage += "Please enter a valid CVV (3 or 4 digits).\n";
        }

        // If the form is not valid, alert the error message
        if (!isValid) {
            alert(errorMessage);
        }

        return isValid;
    }

    // Remove item from cart
    cartItemsList.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-item')) {
            const index = event.target.getAttribute('data-index');
            cartData.splice(index, 1);
            localStorage.setItem('cartData', JSON.stringify(cartData));
            loadCartItems();
        }
    });

    // Load cart items initially
    loadCartItems();

    // Handle checkout form submission
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (validateForm()) {
            // Display thank you message and delivery date
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 3); // Delivery date is 3 days from now
            deliveryDateElement.textContent = deliveryDate.toDateString();

            // Hide form and cart summary, show thank you message
            document.querySelector('.container').style.display = 'none';
            thankYouMessage.style.display = 'block';

            // Clear cart data from localStorage
            localStorage.removeItem('cartData');
        }
    });
});
