(function () {
  function getToken() {
    return localStorage.getItem('scrapchain_token');
  }

  function getRole() {
    try {
      const token = getToken();
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (e) {
      return null;
    }
  }

  function redirectByRole() {
    const role = getRole();
    if (role === 'citizen') window.location.href = '../dashboards/citizen.html';
    else if (role === 'kabadi') window.location.href = '../dashboards/kabadi.html';
    else if (role === 'recycler' || role === 'admin') window.location.href = '../dashboards/recycler.html';
    else window.location.href = '../index.html';
  }

  function getUserId() {
    try {
      const token = getToken();
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) {
      return null;
    }
  }

  window.auth = {
    isLoggedIn: function () {
      if (new URLSearchParams(window.location.search).get('logout') === 'true') {
        this.logout();
        return false;
      }
      return !!getToken();
    },
    getRole: getRole,
    getUserId: getUserId,
    redirectByRole: redirectByRole,
    logout: function () {
      localStorage.removeItem('scrapchain_token');
      localStorage.removeItem('scrapchain_user');
      window.location.href = '../index.html';
    },
  };
})();
