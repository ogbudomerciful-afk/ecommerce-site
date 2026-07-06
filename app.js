document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid');
  const cartButton = document.querySelector('.pill-btn');

  cartButton.textContent = 'View cart (0)';
  productGrid.innerHTML = `
    <article class="product-card">
      <span class="eyebrow">Scaffold</span>
      <h4>Storefront shell is ready</h4>
      <p>The interactive catalog and checkout flow will be wired in the next step.</p>
      <div class="product-footer">
        <strong>$0.00</strong>
        <button class="primary-btn" disabled>Coming soon</button>
      </div>
    </article>
  `;
});
