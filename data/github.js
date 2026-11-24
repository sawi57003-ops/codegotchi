// Codegotchi GitHub data: public events fetch + streak computation.
// No auth, no token. Cached 1h in localStorage.
(function (root) {
  'use strict';

  var CACHE_KEY = 'codegotchi-gh-cache';
  var CACHE_TTL_MS = 60 * 60 * 1000;

  function cacheGet(user) {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var c = JSON.parse(raw);
      if (c.user !== user) return null;
      if (Date.now() - c.at > CACHE_TTL_MS) return null;
      return c.data;
    } catch (e) { return null; }
  }

  function cacheSet(user, data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ user: user, at: Date.now(), data: data }));
    } catch (e) { /* storage full/blocked: ignore */ }
  }

  // Returns { days: ['YYYY-MM-DD', ...], error: null|string }.
  async function fetchPushDays(user) {
    var cached = cacheGet(user);
    if (cached) return cached;
    var url = 'https://api.github.com/users/' + encodeURIComponent(user) + '/events/public?per_page=100';
    var res;
    try {
      res = await fetch(url);
    } catch (e) {
      return { days: [], error: 'network' };
    }
    if (res.status === 404) return { days: [], error: 'nouser' };
    if (res.status === 403) return { days: [], error: 'ratelimit' };
    if (!res.ok) return { days: [], error: 'http' + res.status };
    var evs = await res.json();
    var days = [];
    var seen = {};
    for (var i = 0; i < evs.length; i++) {
      if (evs[i].type !== 'PushEvent') continue;
      var d = String(evs[i].created_at).slice(0, 10);
      if (!seen[d]) { seen[d] = true; days.push(d); }
    }
    var out = { days: days, error: null };
    cacheSet(user, out);
    return out;
  }

  var api = { fetchPushDays: fetchPushDays };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CodegotchiGithub = api;
})(typeof window !== 'undefined' ? window : globalThis);
