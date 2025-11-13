// scripts.js
// Carrega links.json e monta a galeria.
// links.json deve conter um array de objetos: [{ "filename": "exemplo1.jpg", "title": "Modelo 1", "url": "https://..." }, ...]
async function loadGallery(){
  try {
    const res = await fetch('links.json');
    if (!res.ok) throw new Error('links.json não encontrado ou erro ao carregar.');
    const items = await res.json();

    const gallery = document.getElementById('gallery');
    if (!Array.isArray(items)) throw new Error('links.json deve ser um array.');

    items.forEach(it => {
      const card = document.createElement('div');
      card.className = 'card';

      const link = document.createElement('a');
      link.href = it.url || '#';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      const img = document.createElement('img');
      img.className = 'thumb';
      img.alt = it.title || it.filename || 'Modelo 3D';
      img.src = `images/${it.filename}`;

      const body = document.createElement('div');
      body.className = 'card-body';
      const title = document.createElement('h3');
      title.className = 'card-title';
      title.textContent = it.title || it.filename;
      const linkText = document.createElement('div');
      linkText.className = 'card-link';
      linkText.textContent = it.url || '';

      link.appendChild(img);
      body.appendChild(title);
      body.appendChild(linkText);
      card.appendChild(link);
      card.appendChild(body);
      gallery.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = `<p style="color:#f88; padding:20px">Erro ao carregar a galeria: ${err.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadGallery);
