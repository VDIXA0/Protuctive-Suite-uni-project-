// assets/js/products.js
document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const listContainer = document.getElementById('product-list');

  // Loads products from the API using whatever search/category values are
  // currently in the form, and renders them into the product grid.
  async function loadAndRenderProducts() {
    const search = searchInput ? searchInput.value : '';
    const category = categoryFilter ? categoryFilter.value : 'all';

    try {
      const products = await fetchProducts({ search, category });
      renderProducts(products, 'product-list');
    } catch (error) {
      console.error('Could not load products:', error);
      if (listContainer) {
        listContainer.innerHTML = '<p>Could not load products. Is the backend running?</p>';
      }
    }
  }

  // Initial load -- show everything when the page first opens
  await loadAndRenderProducts();

  // Debounce: wait 300ms after the user stops typing before actually calling
  // the API. Without this, every single keystroke would fire a new request.
  let debounceTimer;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(loadAndRenderProducts, 300);
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', loadAndRenderProducts);
  }
});
