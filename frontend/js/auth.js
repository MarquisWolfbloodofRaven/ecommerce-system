// Estado de autenticação
let currentUser = null;

// Inicializar autenticação
function initAuth() {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');

  if (token && savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      updateUIForUser();
    } catch (error) {
      console.error('Erro ao restaurar sessão:', error);
      clearAuth();
    }
  }
}

// Login
async function login(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password }, { auth: false });

    if (response.success) {
      currentUser = response.data.user;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      updateUIForUser();
      closeLoginModal();
      showAlert('success', `Bem-vindo, ${currentUser.name}!`);
      
      // Recarregar produtos após login
      await loadProducts();
      
      return true;
    }
  } catch (error) {
    showAlert('error', error.message || 'Erro ao fazer login');
    return false;
  }
}

// Logout (CORRIGIDO)
async function logout() {
  if (!confirm('Deseja realmente sair?')) {
    return;
  }

  try {
    // Chamar endpoint de logout no backend
    await api.post('/auth/logout');
  } catch (error) {
    console.warn('Erro ao notificar logout no backend:', error);
  } finally {
    // Limpar dados locais SEMPRE, mesmo se API falhar
    clearAuth();
    
    // Resetar UI
    updateUIForUser();
    switchPanel('client');
    
    // Recarregar produtos (visitante pode ver)
    await loadProducts();
    
    showAlert('success', 'Logout realizado com sucesso!');
  }
}

// Limpar autenticação local
function clearAuth() {
  currentUser = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart'); // Limpar carrinho também
}

// Atualizar UI baseado no usuário
function updateUIForUser() {
  const navTabs = document.getElementById('navTabs');
  const userName = document.getElementById('userName');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const cartBadgeBtn = document.getElementById('cartBadgeBtn');

  if (currentUser) {
    // Usuário logado
    userName.textContent = currentUser.name;
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-flex';
    cartBadgeBtn.style.display = 'block';

    // Renderizar abas baseadas na role
    let tabsHTML = '<button class="tab-btn active" data-panel="client">🛍️ Loja</button>';
    
    if (currentUser.role === 'attendant' || currentUser.role === 'admin') {
      tabsHTML += '<button class="tab-btn" data-panel="attendant">📞 Atendimento</button>';
    }
    
    if (currentUser.role === 'admin') {
      tabsHTML += '<button class="tab-btn" data-panel="admin">⚙️ Administração</button>';
    }
    
    navTabs.innerHTML = tabsHTML;
    attachTabListeners();
  } else {
    // Visitante
    userName.textContent = 'Visitante';
    loginBtn.style.display = 'inline-flex';
    logoutBtn.style.display = 'none';
    cartBadgeBtn.style.display = 'block';
    navTabs.innerHTML = '<button class="tab-btn active" data-panel="client">🛍️ Loja</button>';
    attachTabListeners();
  }
}

// Verificar permissão de acesso
function checkAccess(requiredRole) {
  if (!currentUser) {
    showAlert('warning', 'Você precisa fazer login para acessar esta área!');
    showLoginModal();
    return false;
  }

  if (requiredRole === 'admin' && currentUser.role !== 'admin') {
    showAlert('error', 'Acesso negado! Apenas administradores podem acessar esta área.');
    return false;
  }

  if (requiredRole === 'attendant' && 
      currentUser.role !== 'admin' && 
      currentUser.role !== 'attendant') {
    showAlert('error', 'Acesso negado! Apenas atendentes e administradores podem acessar esta área.');
    return false;
  }

  return true;
}

// Modal de login
function showLoginModal() {
  document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('loginForm').reset();
}

// Toggle senha
function togglePassword() {
  const passwordInput = document.getElementById('loginPassword');
  const icon = document.getElementById('togglePasswordIcon');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.textContent = '🙈';
  } else {
    passwordInput.type = 'password';
    icon.textContent = '👁️';
  }
}

// Event Listeners de autenticação
document.getElementById('loginBtn')?.addEventListener('click', showLoginModal);
document.getElementById('logoutBtn')?.addEventListener('click', logout);
document.getElementById('closeModalBtn')?.addEventListener('click', closeLoginModal);
document.getElementById('togglePasswordBtn')?.addEventListener('click', togglePassword);

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  await login(email, password);
});

// Fechar modal ao clicar fora
document.getElementById('loginModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'loginModal') {
    closeLoginModal();
  }
});
