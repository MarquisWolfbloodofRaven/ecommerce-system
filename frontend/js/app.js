// Sistema de alertas
function showAlert(type, message) {
  // Criar elemento de alerta
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  alert.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'};
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;

  document.body.appendChild(alert);

  // Remover após 3 segundos
  setTimeout(() => {
    alert.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Trocar painel
function switchPanel(panelName) {
  // Verificar permissões
  if (panelName === 'attendant' && !checkAccess('attendant')) return;
  if (panelName === 'admin' && !checkAccess('admin')) return;

  // Esconder todos os painéis
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  // Mostrar painel selecionado
  const panel = document.getElementById(`${panelName}Panel`);
  if (panel) {
    panel.classList.add('active');
  }

  // Carregar dados específicos do painel
  if (panelName === 'cart') {
    renderCart();
  } else if (panelName === 'attendant') {
    renderAttendantOrders();
  } else if (panelName === 'admin') {
    updateStats();
    renderAdminOrders();
    renderAdminProducts();
  }
}

// Anexar listeners às abas
function attachTabListeners() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.getAttribute('data-panel');
      switchPanel(panel);
      
      // Atualizar aba ativa
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// Inicialização do sistema
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Inicializando sistema...');

  // Inicializar módulos
  initAuth();
  initCart();

  // Carregar dados iniciais
  await loadProducts();

  // Anexar listeners
  attachTabListeners();

  console.log('✅ Sistema inicializado com sucesso!');
});
