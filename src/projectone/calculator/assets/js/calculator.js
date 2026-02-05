// Calculator JS — стиль имён и функций в духе проекта
document.addEventListener('DOMContentLoaded', () => {
  const calcBtn = document.getElementById('calcBtn');
  const resetBtn = document.getElementById('resetBtn');
  const requestBtn = document.getElementById('requestBtn');

  calcBtn.addEventListener('click', calculateTotal);
  resetBtn.addEventListener('click', resetForm);
  requestBtn.addEventListener('click', sendRequest);
});

function calculateTotal(){
  const checked = Array.from(document.querySelectorAll('input[name="service"]')).filter(i=>i.checked);
  const breakdown = document.getElementById('breakdown');
  const totalEl = document.getElementById('total');
  breakdown.innerHTML = '';
  let total = 0;

  checked.forEach(input => {
    const price = Number(input.dataset.price) || 0;
    const name = input.closest('.service-row').querySelector('.service-name').textContent.trim();
    const qtyInput = input.closest('.service-row').querySelector('.qty');
    const qty = Math.max(0, Number(qtyInput.value) || 0);
    const sum = price * qty;
    total += sum;
    const row = document.createElement('div');
    row.textContent = `${name} — ${qty} × ${formatCurrency(price)} = ${formatCurrency(sum)}`;
    breakdown.appendChild(row);
  });

  totalEl.textContent = formatCurrency(total) + ' тг';
}

function formatCurrency(n){
  return n.toLocaleString('ru-RU');
}

function resetForm(){
  document.getElementById('calcForm').reset();
  document.getElementById('breakdown').innerHTML = '';
  document.getElementById('total').textContent = '0 тг';
}

function sendRequest(){
  // Простая демонстрация: вывод модального окна с итогом
  const total = document.getElementById('total').textContent;
  alert('Заявка отправлена. ' + '\n' + 'Ориентировочная стоимость: ' + total);
}
