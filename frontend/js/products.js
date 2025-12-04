let allProducts = [];

// Carregar produtos da API
async function loadProducts() {
  try {
    const response = await api.get('/products', { auth: false }); // Público

    if (response.success) {
      allProducts = response.data;
      renderProducts(allProducts);
    }
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    showAlert('error', 'Erro ao carregar produtos');
    document.getElementById('productsGrid').innerHTML = 
      '<div class="empty-state"><p>Erro ao carregar produtos</p></div>';
  }
}

// Renderizar produtos
function renderProducts(products) {
  const grid = document.getElementById('productsGrid');

  if (!products || products.length === 0) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><p>Nenhum produto encontrado</p></div>';
    return;
  }

  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">${product.icon}</div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-price">R$ ${parseFloat(product.price).toFixed(2)}</div>
        <div class="product-stock">Estoque: ${product.stock} unidades</div>
        <button 
          class="btn btn-primary btn-full" 
          onclick="addToCart(${product.id})"
          ${product.stock === 0 ? 'disabled' : ''}
        >
          ${product.stock === 0 ? '✗ Indisponível' : '+ Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  `).join('');
}

// Filtrar produtos
function filterProducts() {
  const search = document.getElementById('searchProduct').value.toLowerCase();
  const category = document.getElementById('filterCategory').value;

  let filtered = allProducts.filter(product => {
    const matchSearch = 
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search);
    const matchCategory = !category || product.category === category;
    return matchSearch && matchCategory;
  });

  renderProducts(filtered);
}

// Ordenar produtos
function sortProducts() {
  const sortBy = document.getElementById('sortProducts').value;
  let sorted = [...allProducts];

  if (sortBy === 'price-asc') {
    sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortBy === 'price-desc') {
    sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderProducts(sorted);
}

// Event listeners
document.getElementById('searchProduct')?.addEventListener('input', filterProducts);
document.getElementById('filterCategory')?.addEventListener('change', filterProducts);
document.getElementById('sortProducts')?.addEventListener('change', sortProducts);
