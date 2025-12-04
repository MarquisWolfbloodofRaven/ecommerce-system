// Adicionar produto
async function addProduct(event) {
  event.preventDefault();

  const productData = {
    name: document.getElementById('productName').value,
    description: document.getElementById('productDescription').value,
    category: document.getElementById('productCategory').value,
    price: parseFloat(document.getElementById('productPrice').value),
    stock: parseInt(document.getElementById('productStock').value),
    icon: getCategoryIcon(document.getElementById('productCategory').value)
  };

  try {
    const response = await api.post('/products', productData);

    if (response.success) {
      showAlert('success', 'Produto adicionado com sucesso!');
      event.target.reset();
      await loadProducts();
      await renderAdminProducts();
      await updateStats();
    }
  } catch (error) {
    showAlert('error', error.message || 'Erro ao adicionar produto');
  }
}

// Renderizar produtos no admin
async function renderAdminProducts() {
  try {
    const response = await api.get('/products', { auth: false });

    if (!response.success) return;

    const tbody = document.getElementById('adminProducts');

    if (response.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Nenhum produto cadastrado</td></tr>';
      return;
    }

    tbody.innerHTML = response.data.map(product => `
      <tr>
        <td>${product.id}</td>
        <td>${product.icon} ${product.name}</td>
        <td>${product.category}</td>
        <td>R$ ${parseFloat(product.price).toFixed(2)}</td>
        <td>${product.stock}</td>
        <td>
          <button class="btn btn-primary" onclick="editProductStock(${product.id})" 
            style="padding: 5px 10px; font-size: 12px; margin-right: 5px;">
            📦 Estoque
          </button>
          <button class="btn btn-danger" onclick="deleteProduct(${product.id})" 
            style="padding: 5px 10px; font-size: 12px;">
            🗑️ Excluir
          </button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
}

// Editar estoque
async function editProductStock(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const newStock = prompt(
    `Estoque atual de "${product.name}": ${product.stock}\n\nDigite o novo estoque:`,
    product.stock
  );

  if (newStock === null) return;

  const stock = parseInt(newStock);
  if (isNaN(stock) || stock < 0) {
    showAlert('error', 'Estoque inválido!');
    return;
  }

  try {
    const response = await api.put(`/products/${productId}`, { stock });

    if (response.success) {
      showAlert('success', 'Estoque atualizado com sucesso!');
      await loadProducts();
      await renderAdminProducts();
    }
  } catch (error) {
    showAlert('error', error.message || 'Erro ao atualizar estoque');
  }
}

// Deletar produto
async function deleteProduct(productId) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return;

  try {
    const response = await api.delete(`/products/${productId}`);

    if (response.success) {
      showAlert('success', 'Produto excluído com sucesso!');
      await loadProducts();
      await renderAdminProducts();
      await updateStats();
    }
  } catch (error) {
    showAlert('error', error.message || 'Erro ao excluir produto');
  }
}

// Atualizar estatísticas
async function updateStats() {
  try {
    const [ordersRes, productsRes, usersRes] = await Promise.all([
      api.get('/orders'),
      api.get('/products', { auth: false }),
      api.get('/users')
    ]);

    if (ordersRes.success) {
      const orders = ordersRes.data;
      const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      const today = new Date().toISOString().split('T');
      const todayOrders = orders.filter(o => o.createdAt.startsWith(today)).length;

      document.getElementById('totalSales').textContent = `R$ ${totalSales.toFixed(2)}`;
      document.getElementById('todayOrders').textContent = todayOrders;
    }

    if (productsRes.success) {
      document.getElementById('totalProducts').textContent = productsRes.data.length;
    }

    if (usersRes.success) {
      const clients = usersRes.data.filter(u => u.role === 'client' && u.active);
      document.getElementById('totalCustomers').textContent = clients.length;
    }
  } catch (error) {
    console.error('Erro ao atualizar estatísticas:', error);
  }
}

// Helper
function getCategoryIcon(category) {
  const icons = {
    'Eletrônicos': '💻',
    'Roupas': '👕',
    'Livros': '📚',
    'Casa': '🏠'
  };
  return icons[category] || '📦';
}

// Event listener
document.getElementById('addProductForm')?.addEventListener('submit', addProduct);
