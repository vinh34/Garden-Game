/**
 * Cửa hàng: mua nước, phân, lượt quét
 */

function renderShop() {
  const container = document.getElementById('shop-items');
  if (!container) return;
  const state = window.gameState;
  if (!state) return;

  container.innerHTML = SHOP_ITEMS.map((item) => {
    const canAfford = state.money >= item.price;
    return `
      <div class="shop-item" data-item-id="${item.id}" data-price="${item.price}" data-amount="${item.amount}">
        <div class="icon">${item.icon}</div>
        <div class="name">${item.name}</div>
        <div class="price">💰 ${item.price}</div>
        <div class="desc">${item.desc}</div>
        ${!canAfford ? '<div class="desc" style="color:var(--danger)">Không đủ tiền</div>' : ''}
      </div>
    `;
  }).join('');

  container.querySelectorAll('.shop-item').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset.itemId;
      const price = parseInt(el.dataset.price, 10);
      const amount = parseInt(el.dataset.amount, 10);
      if (state.money < price) return;
      state.money -= price;
      if (id === 'water') state.water += amount;
      else if (id === 'fertilizer') state.fertilizer += amount;
      else if (id === 'scan') state.scanCount += amount;
      updateHUD();
      renderShop();
    });
  });
}
