// Carregar pedidos do usuário
async function loadOrders() {
  if (!currentUser) return;

  try {
    const response = await api.get('/orders');

    if (response.success) {
      renderOrders(response.data);
    }
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
    showAlert('error', 'Erro ao carregar pedidos');
  }
}

// Renderizar pedidos (atendente)
async function renderAttendantOrders() {
  try {
    const response = await api.get('/orders');

    if (!response.success) return;

    const tbody = document.getElementById('attendantOrders');
    const activeOrders = response.data.filter(
      o => o.status !== 'delivered' && o.status !== 'cancelled'
    );

    if (activeOrders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Nenhum pedido ativo</td></tr>';
      return;
    }

    tbody.innerHTML = activeOrders.map(order => `
      <tr>
        <td>#${order.id}</td>
        <td>${order.user?.name || 'N/A'}</td>
        <td>${formatDate(order.createdAt)}</td>
        <td>R$ ${parseFloat(order.total).toFixed(2)}</td>
        <td><span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></td>
        <td>
          <select class="form-control" onchange="updateOrderStatus(${order.id}, this.value)" style="width: auto; display: inline-block; padding: 5px;">
            <option value="">Alterar status...</option>
            <option value="processing">Em Processamento</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
  }
}

// Renderizar pedidos (admin)
async function renderAdminOrders() {
  try {
    const response = await api.get('/orders');

    if (!response.success) return;

    const tbody = document.getElementById('adminOrders');

    if (response.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">Nenhum pedido registrado</td></tr>';
      return;
    }

    tbody.innerHTML = response.data.map(order => `
      <tr>
        <td>#${order.id}</td>
        <td>${order.user?.name || 'N/A'}</td>
        <td>${formatDate(order.createdAt)}</td>
        <td>${order.items?.length || 0}</td>
        <td>R$ ${parseFloat(order.total).toFixed(2)}</td>
        <td><span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></td>
        <td>
          <button class="btn btn-danger" onclick="deleteOrder(${order.id})" style="padding: 5px 10px; font-size: 12px;">
            🗑️ Excluir
          </button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
  }
}

// Atualizar status do pedido
async function updateOrderStatus(orderId, newStatus) {
  if (!newStatus) return;

  try {
    const response = await api.patch(`/orders/${orderId}/status`, { status: newStatus });

    if (response.success) {
      showAlert('success', 'Status atualizado com sucesso!');
      renderAttendantOrders();
      renderAdminOrders();
    }
  } catch (error) {
    showAlert('error', error.message || 'Erro ao atualizar status');
  }
}

// Deletar pedido
async function deleteOrder(orderId) {
  if (!confirm('Tem certeza que deseja excluir este pedido?')) return;

  try {
    const response = await api.delete(`/orders/${orderId}`);

    if (response.success) {
      showAlert('success', 'Pedido excluído com sucesso!');
      renderAdminOrders();
      updateStats();
    }
  } catch (error) {
    showAlert('error', error.message || 'Erro ao excluir pedido');
  }
}

// Helpers
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Pendente',
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  };
  return labels[status] || status;
}
