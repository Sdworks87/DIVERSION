(function () {
  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'success');
    toast.textContent = message;
    toast.style.cssText =
      'position:fixed;bottom:24px;right:24px;padding:14px 24px;background:var(--lime);color:var(--dark);font-weight:600;font-size:14px;z-index:10000;border-radius:4px;box-shadow:0 4px 20px rgba(0,0,0,.3);animation:toastIn .3s ease;';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastOut .2s ease forwards';
      setTimeout(() => toast.remove(), 200);
    }, 3000);
  }
  window.toast = { show: showToast, success: (m) => showToast(m, 'success'), error: (m) => showToast(m, 'error') };
})();
