(async function () {
  const element = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const type = params.get('type');
  const id = params.get('id');
  if (params.getAll('type').length !== 1 || params.getAll('id').length !== 1 ||
      !['spot', 'route'].includes(type) || !/^[a-zA-Z0-9-]{1,128}$/.test(id || '')) {
    element('status').textContent = 'Dieser Teilen-Link ist ungültig. Bitte lass dir einen neuen Link schicken.';
    return;
  }
  element('kind').textContent = type === 'spot' ? 'Ein Spot für dich' : 'Eine Strecke für dich';
  element('open-app').href = `roavyn://${type}/${encodeURIComponent(id)}`;
  element('open-app').hidden = false;
  element('retry').addEventListener('click', () => location.reload());

  async function readJson(url, options = {}) {
    const response = await fetch(url, { ...options, credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('load-failed');
    return response.json();
  }
  function fact(label, value) {
    if (value === undefined || value === null || value === '') return;
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = String(value);
    element('facts').append(term, description);
  }
  try {
    const config = await readJson('/share/config.json');
    for (const [key, button, host] of [['iosStoreUrl', 'ios-store', 'apps.apple.com'], ['androidStoreUrl', 'android-store', 'play.google.com']]) {
      if (!config[key]) continue;
      const url = new URL(config[key]);
      if (url.protocol === 'https:' && url.hostname === host) {
        element(button).href = url.href;
        element(button).hidden = false;
      }
    }
    const seeds = await readJson('/share/seeds.json');
    let item = seeds[type].find((candidate) => candidate.id === id);
    if (!item && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      const table = type === 'spot' ? 'spots' : 'scenic_routes';
      const fields = type === 'spot'
        ? 'title,description,category,location_label,best_time,parking,image_url,image_urls'
        : 'title,description,start_label,end_label,distance_km,duration_minutes,road_type,best_time';
      const url = new URL(`/rest/v1/${table}`, config.supabaseUrl);
      url.search = new URLSearchParams({ id: `eq.${id}`, select: fields, limit: '1' }).toString();
      // Public key only: anonymous RLS also excludes removed and restricted entries.
      const rows = await readJson(url.href, { headers: { apikey: config.supabasePublishableKey } });
      item = rows[0];
    }
    if (!item) {
      element('status').textContent = 'Dieser Eintrag ist nicht verfügbar. Er wurde möglicherweise gelöscht oder ist nicht öffentlich sichtbar.';
      return;
    }
    document.title = `${item.title} – Roavyn`;
    element('title').textContent = item.title;
    element('description').textContent = item.description;
    element('summary').textContent = type === 'spot' ? item.location_label : `${item.start_label} → ${item.end_label}`;
    fact('Beste Zeit', item.best_time);
    if (type === 'spot') {
      fact('Kategorie', item.category);
      fact('Parken', item.parking);
      const image = item.image_url || item.image_urls?.[0];
      if (typeof image === 'string' && URL.canParse(image)) {
        const url = new URL(image);
        const prefix = '/storage/v1/object/public/spot-images/';
        const path = url.pathname.slice(prefix.length);
        if (url.protocol === 'https:' && url.origin === new URL(config.supabaseUrl).origin &&
            !url.username && !url.password && !url.search && !url.hash && url.pathname.startsWith(prefix) &&
            /^[0-9a-f-]{36}\/[a-zA-Z0-9_-][a-zA-Z0-9_./-]*$/.test(path) && !path.includes('..') && !path.includes('//')) {
          const photo = new URL('/functions/v1/spot-image', config.supabaseUrl);
          photo.searchParams.set('path', path);
          element('photo').src = photo.href;
          element('photo').alt = item.title;
          element('photo').hidden = false;
          element('photo').addEventListener('error', () => { element('photo').hidden = true; });
        }
      }
    } else {
      fact('Länge', `${item.distance_km} km`);
      fact('Fahrzeit', `ca. ${item.duration_minutes} Minuten`);
      fact('Straßenart', item.road_type);
    }
    element('content').hidden = false;
    element('status').textContent = '';
  } catch {
    element('status').textContent = 'Der Eintrag konnte gerade nicht geladen werden. Bitte versuche es erneut.';
    element('retry').hidden = false;
  }
})();
