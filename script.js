// Element selection
const cartIcon = document.getElementById("cart-icon");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.querySelector(".close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.querySelector(".checkout-btn");

let cart = [];

// Modal controls
cartIcon.addEventListener("click", () => {
    cartModal.style.display = "block";
    updateCart();
});

closeCartBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = "none";
    }
});

// Add to cart
document.querySelectorAll(".cart-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        try {
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            
            if (!name || isNaN(price)) {
                throw new Error("Invalid product data");
            }

            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ name, price, qty: 1 });
            }
            updateCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Có lỗi khi thêm sản phẩm vào giỏ hàng");
        }
    });
});

// Update cart display
function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <p><strong>${item.name}</strong></p>
            <p>Giá: $${item.price.toFixed(2)}</p>
            <div class="quantity-controls">
                <button class="qty-btn minus" data-index="${index}">-</button>
                <span>Số lượng: ${item.qty}</span>
                <button class="qty-btn plus" data-index="${index}">+</button>
            </div>
            <p>Tổng: $${itemTotal.toFixed(2)}</p>
            <button class="remove-btn" data-index="${index}">Xóa</button>
            <hr/>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
    attachRemoveEvents();
    attachQtyEvents();
    saveCart();
}

// Local storage
function saveCart() {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
        console.error("Error saving cart:", error);
    }
}

function loadCart() {
    try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCart();
        }
    } catch (error) {
        console.error("Error loading cart:", error);
        cart = [];
    }
}

// Event handlers
function attachRemoveEvents() {
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.dataset.index);
            cart.splice(index, 1);
            updateCart();
        });
    });
}

function attachQtyEvents() {
    document.querySelectorAll(".qty-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.dataset.index);
            if (btn.classList.contains("plus")) {
                cart[index].qty += 1;
            } else if (btn.classList.contains("minus") && cart[index].qty > 1) {
                cart[index].qty -= 1;
            }
            updateCart();
        });
    });
}

// Checkout
checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }

    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    alert(`Cảm ơn bạn đã mua hàng! Tổng thanh toán: $${total.toFixed(2)}`);
    cart = [];
    updateCart();
    cartModal.style.display = "none";
});

// Initialize
loadCart();