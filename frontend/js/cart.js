let cart = [];

// Inicializar carrinho do localStorage
function initCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartBadge();
    } catch (error) {
      console.error('Erro ao restaurar carrinho:', error);
      cart = [];
    }
  }
}

// Salvar carrinho
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Adicionar ao carrinho
function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  
  if (!product || product.stock === 0) {
    showAlert('error', 'Produto indisponível');
    return;
  }

  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
    if (existingItem.quantity < product.stock) {
      existingItem.quantity++;
      showAlert('success', `${product.name} adicionado ao carrinho!`);
    } else {
      showAlert('warning', 'Estoque insuficiente!');
      return;
    }
  } else {
    cart.push({
      productId,
      quantity: 1,
      product // Armazenar info do produto
    });
    showAlert('success', `${product.name} adicionado ao carrinho!`);
  }

  updateCartBadge();
  saveCart();
}

// Atualizar badge do carrinho
function updateCartBadge() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartBadge').textContent = totalItems;
}

// Renderizar carrinho
function renderCart() {
  const container = document.getElementById('cartItems');

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🛒</div><p>Seu carrinho está vazio</p></div>';
    document.getElementById('cartTotal').textContent = 'R$ 0,00';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    const product = item.product;
    const subtotal = parseFloat(product.price) * item.quantity;
    total += subtotal;

    return `
      <div class="cart-item">
        <div class="cart-item-image">${product.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">R$ ${parseFloat(product.price).toFixed(2)} x ${item.quantity}</div>
        </div>
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="updateQuantity(${product.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
        </div>
        <button class="btn btn-danger" onclick="removeFromCart(${product.id})">🗑️</button>
      </div>
    `;
  }).join('');

  document.getElementById('cartTotal').textContent = `R$ ${total.toFixed(2)}`;
}

// Atualizar quantidade
function updateQuantity(productId, change) {
  const product = allProducts.find(p => p.id === productId);
  const cartItem = cart.find(item => item.productId === productId);

  if (!cartItem) return;

  const newQuantity = cartItem.quantity + change;

  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }

  if (newQuantity > product.stock) {
    showAlert('warning', 'Estoque insuficiente!');
    return;
  }

  cartItem.quantity = newQuantity;
  updateCartBadge();
  saveCart();
  renderCart();
}

// Remover do carrinho
function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  updateCartBadge();
  saveCart();
  renderCart();
}

// Finalizar compra
async function finalizePurchase() {
  if (!currentUser) {
    showAlert('warning', 'Você precisa fazer login para finalizar a compra!');
    showLoginModal();
    return;
  }

  if (cart.length === 0) {
    showAlert('warning', 'Carrinho vazio!');
    return;
  }

  try {
    const items = cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    const response = await api.post('/orders', { items });

    if (response.success) {
      showAlert('success', `Pedido #${response.data.id} realizado com sucesso!`);
      
      // Limpar carrinho
      cart = [];
      saveCart();
      updateCartBadge();
      renderCart();
      
      // Recarregar produtos (estoque atualizado)
      await loadProducts();
    }
  } catch (error) {
    showAlert('error', error.message || 'Erro ao finalizar compra');
  }
}

// Event listeners
document.getElementById('cartBadgeBtn')?.addEventListener('click', () => {
  switchPanel('cart');
  renderCart();
});

document.getElementById('finalizePurchaseBtn')?.addEventListener('click', finalizePurchase);
