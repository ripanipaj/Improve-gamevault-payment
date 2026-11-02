/* Payment Gateway Logic for GameVault */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  let currentGameId = null;
  let currentGameData = null;

  function formatPrice(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }

  function simulatePrice(game) {
    const base = Math.floor((game.rating || 3.5) * 50000);
    const idFactor = (game.id % 7) * 25000;
    return Math.max(150000, Math.min(750000, base + idFactor));
  }

  function openPaymentModal(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;
    currentGameId = gameId;
    currentGameData = game;

    const price = game.price ?? simulatePrice(game);
    const total = price + 2500;

    $('paymentThumb').style.backgroundImage = `url('${game.image}')`;
    $('paymentGameTitle').textContent = game.title;
    $('paymentGameSubtitle').textContent = (game.genres || [game.genre]).slice(0, 2).join(' · ');
    $('paymentGamePrice').textContent = formatPrice(price);
    $('payGamePrice').textContent = formatPrice(price);
    $('payTotalPrice').textContent = formatPrice(total);

    const methods = [
      { id: 'qris', label: 'QRIS', icon: '📱', desc: 'Bayar dengan QRIS via aplikasi e-wallet/bank favorit' },
      { id: 'ewallet', label: 'E-Wallet (GoPay/OVO/Dana)', icon: '💳', desc: 'GoPay, OVO, Dana, ShopeePay' },
      { id: 'transfer', label: 'Transfer Bank (BCA/Mandiri/BNI)', icon: '🏦', desc: 'Transfer ke rekening virtual BCA, Mandiri, BNI' },
      { id: 'card', label: 'Kartu Kredit/Debit', icon: '💳', desc: 'Visa, Mastercard, JCB' }
    ];

    $('paymentMethods').innerHTML = methods.map(m => `
      <label class="method-item">
        <input type="radio" name="paymentMethod" value="${m.id}" ${m.id === 'qris' ? 'checked' : ''}>
        <span class="method-icon" aria-hidden="true">${m.icon}</span>
        <div>
          <div class="method-name">${m.label}</div>
          <small style="color:#8aa3bd">${m.desc}</small>
        </div>
      </label>
    `).join('');

    $('paymentModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closePaymentModal() {
    $('paymentModal').classList.add('hidden');
    document.body.style.overflow = '';
    currentGameId = null;
    currentGameData = null;
  }

  async function handlePayment() {
    if (!currentGameId || !currentGameData) return;
    const btn = $('paySubmitBtn');
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'qris';

    btn.classList.add('loading');
    btn.textContent = 'Memproses...';

    const price = currentGameData.price ?? simulatePrice(currentGameData);
    const paymentDetails = {
      price,
      method: selectedMethod,
      handlingFee: 2500,
      total: price + 2500,
      status: 'success'
    };

    await new Promise(r => setTimeout(r, 1500));

    try {
      await GameVaultDB.setPurchased(currentGameId, paymentDetails);
      toast('Pembayaran Berhasil! Game telah ditambahkan ke koleksi kamu.');
      closePaymentModal();
      updateBuyButtonState(currentGameId);
      if (window.renderExplore) window.renderExplore();
      if (window.renderPopular) window.renderPopular();
      if (window.renderWishlist) window.renderWishlist();
    } catch (e) {
      console.error('Payment save error:', e);
      toast('Gagal menyimpan data pembelian.', true);
    } finally {
      btn.classList.remove('loading');
      btn.textContent = 'Bayar Sekarang';
    }
  }

  function updateBuyButtonState(gameId) {
    if (GameVaultDB.isPurchased) {
      GameVaultDB.isPurchased(gameId).then(isPurchased => {
        const detailBuyBtn = document.getElementById('detailBuy');
        if (detailBuyBtn) {
          if (isPurchased) {
            detailBuyBtn.textContent = '✓ Owned';
            detailBuyBtn.disabled = true;
            detailBuyBtn.style.opacity = '0.6';
            detailBuyBtn.style.cursor = 'default';
          } else {
            detailBuyBtn.textContent = '🛒 Beli Game';
            detailBuyBtn.disabled = false;
            detailBuyBtn.style.opacity = '';
            detailBuyBtn.style.cursor = '';
          }
        }
      }).catch(() => {});
    }
  }

  function injectBuyButton() {
    const detailCopy = document.querySelector('.detail-copy');
    if (!detailCopy || document.getElementById('detailBuy')) return;

    const buyBtn = document.createElement('button');
    buyBtn.id = 'detailBuy';
    buyBtn.type = 'button';
    buyBtn.className = 'btn';
    buyBtn.style.marginLeft = '8px';
    buyBtn.textContent = '🛒 Beli Game';
    buyBtn.addEventListener('click', () => {
      if (currentGame) openPaymentModal(currentGame.id);
    });
    detailCopy.appendChild(buyBtn);
  }

  function checkPurchasedAndUpdateUI() {
    if (currentGame) {
      updateBuyButtonState(currentGame.id);
    }
  }

  function initPayment() {
    $('paymentModal')?.querySelector('.modal-close')?.addEventListener('click', closePaymentModal);
    $('paySubmitBtn')?.addEventListener('click', handlePayment);
    $('paymentModal')?.addEventListener('click', e => {
      if (e.target === $('paymentModal')) closePaymentModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !$('paymentModal')?.classList.contains('hidden')) closePaymentModal();
    });

    const originalOpenDetails = openDetails;
    openDetails = function (title) {
      originalOpenDetails(title);
      injectBuyButton();
      checkPurchasedAndUpdateUI();
    };

    const originalRenderExplore = renderExplore;
    renderExplore = function () {
      originalRenderExplore();
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPayment);
  } else {
    initPayment();
  }
})();