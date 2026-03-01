(function () {
  const API_BASE = 'http://localhost:3000';

  function getToken() {
    return localStorage.getItem('scrapchain_token');
  }

  window.api = {
    async get(path) {
      const opts = { method: 'GET', headers: {} };
      const token = getToken();
      if (token) opts.headers['Authorization'] = 'Bearer ' + token;
      const res = await fetch(API_BASE + path, opts);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.statusText);
      return data;
    },
    async post(path, body) {
      const opts = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      };
      const token = getToken();
      if (token) opts.headers['Authorization'] = 'Bearer ' + token;
      const res = await fetch(API_BASE + path, opts);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.statusText);
      return data;
    },
    async patch(path, body) {
      const opts = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      };
      const token = getToken();
      if (token) opts.headers['Authorization'] = 'Bearer ' + token;
      const res = await fetch(API_BASE + path, opts);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.statusText);
      return data;
    },
    async upload(path, formData) {
      const opts = { method: 'POST', body: formData };
      const token = getToken();
      if (token) opts.headers = { Authorization: 'Bearer ' + token };
      const res = await fetch(API_BASE + path, opts);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.statusText);
      return data;
    },
  };
})();
