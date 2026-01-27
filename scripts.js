async function loadGallery() {
  try {
    const response = await fetch('links.json');
    if (!response.ok) throw new Error('Failed to load gallery data');
    const items = await response.json();
    
    const topsideGallery = document.getElementById('gallery-topside');
    const hullGallery = document.getElementById('gallery-hull');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="images/${item.filename}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/400x250?text=Image+Not+Found'">
        <div class="card-content">
          <div class="card-title">${item.title}</div>
        </div>
      `;
      
      card.addEventListener('click', () => {
        openModal(item);
      });
      
      if (item.group === 'HULL') {
        hullGallery.appendChild(card);
      } else {
        topsideGallery.appendChild(card);
      }
    });

    function openModal(item) {
      modal.style.display = 'flex';
      modalContent.innerHTML = `
        <h2>${item.title}</h2>
        <p>${item.disclaimer}</p>
        <div class="btn-group">
          ${item.options.map(opt => `
            <button class="btn-primary" onclick="window.open('${opt.url}', '_blank')">${opt.label}</button>
          `).join('')}
          <button class="btn-close" id="close-modal">Close</button>
        </div>
      `;
      
      document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

  } catch (error) {
    console.error('Error loading gallery:', error);
    document.querySelector('main').innerHTML = `<p style="text-align:center; color:#f87171; padding:50px;">${error.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadGallery);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}
