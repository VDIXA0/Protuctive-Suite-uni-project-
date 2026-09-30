// assets/js/main.js

// Base URL of the products API. Change the port if yours is different.
const PRODUCTS_API_BASE = 'http://localhost:5002/api/products';

// Keeps track of whatever products are currently rendered on the page,
// so addToCart() can look up a product's info without needing a separate
// API call every time someone clicks "Add to Cart".
let currentProducts = [];

// Helper to get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('shopnest_cart')) || [];
}

// Helper to save cart and update badge
function saveCart(cart) {
  localStorage.setItem('shopnest_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countSpan = document.getElementById('cart-count');
  if (countSpan) {
    countSpan.textContent = totalItems;
  }
}

// Add to cart functionality -- looks the product up from whatever was last rendered
function addToCart(productId) {
  let cart = getCart();
  const product = currentProducts.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  alert(`${product.name} added to cart!`);
}

// Render products dynamically inside a container
function renderProducts(productsArray, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Remember these products so addToCart() can find them later
  currentProducts = productsArray;

  if (productsArray.length === 0) {
    container.innerHTML = '<p>No products found.</p>';
    return;
  }

  container.innerHTML = productsArray.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" class="product-img">
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">$${Number(product.price).toFixed(2)}</p>
        <button class="btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

// Fetches products from the real backend API.
// Optional filters (search, category) get added as query string params, e.g.
// http://localhost:5002/api/products?search=watch&category=electronics
async function fetchProducts({ search, category } = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category && category !== 'all') params.append('category', category);

  const url = params.toString() ? `${PRODUCTS_API_BASE}?${params}` : PRODUCTS_API_BASE;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to load products');
  }

  return data.data; // the array of products
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', async () => {
  updateCartCount();

  // If this is the index page, fetch and show a few featured products
  const featuredContainer = document.getElementById('featured-products');
  if (featuredContainer) {
    try {
      const products = await fetchProducts();
      renderProducts(products.slice(0, 4), 'featured-products');
    } catch (error) {
      console.error('Could not load featured products:', error);
      featuredContainer.innerHTML = '<p>Could not load products. Is the backend running?</p>';
    }
  }
});
