// assets/js/cart.js
document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();
});

function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  const summaryTotal = document.getElementById('summary-total');
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    if (summaryTotal) summaryTotal.textContent = 'Total: $0.00';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    total += item.price * item.quantity;
    return `
      <div class="cart-item-row">
        <div>
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <div>
          <button onclick="changeQuantity(${item.id}, 1)" style="padding: 2px 8px;">+</button>
          <span style="margin: 0 8px;">${item.quantity}</span>
          <button onclick="changeQuantity(${item.id}, -1)" style="padding: 2px 8px;">-</button>
          <button onclick="removeFromCart(${item.id})" style="margin-left: 1rem; color: red; border:none; background:none; cursor:pointer;">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  if (summaryTotal) {
    summaryTotal.textContent = `Total: $${total.toFixed(2)}`;
  }
}

function changeQuantity(productId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
  }
  saveCart(cart);
  renderCartPage();
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  renderCartPage();
}
