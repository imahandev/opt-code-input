(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const inputs = Array.from(document.querySelectorAll('#pin input'));
    const submitBtn = document.getElementById('submit');
    const clearBtn = document.getElementById('clear');
    const hidden = document.getElementById('code-hidden');
    const form = document.getElementById('pin-form');
    const msg = document.getElementById('msg');

    inputs.forEach((el, i) => {
      el.autocomplete = 'off';
      el.setAttribute('inputmode', 'numeric');
      el.pattern = '\\d?';

      el.addEventListener('input', (e) => {
        const value = e.target.value.replace(/\D/g, '');
        e.target.value = value;

        if (value && i < inputs.length - 1) {
          inputs[i + 1].focus();
          inputs[i + 1].select();
        }
        updateState();
      });

      el.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && i > 0) inputs[i - 1].focus();
        if (e.key === 'ArrowRight' && i < inputs.length - 1) inputs[i + 1].focus();

        if (e.key === 'Backspace' && !e.target.value && i > 0) {
          inputs[i - 1].value = '';
          inputs[i - 1].focus();
          inputs[i - 1].select();
          updateState();
          e.preventDefault();
        }
      });

      el.addEventListener('paste', (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
        const digits = paste.replace(/\D/g, '').slice(0, inputs.length);
        if (!digits) return;

        for (let j = 0; j < digits.length && (i + j) < inputs.length; j++) {
          inputs[i + j].value = digits[j];
        }

        const nextIndex = Math.min(inputs.length - 1, i + digits.length - 1);
        inputs[nextIndex].focus();
        inputs[nextIndex].select();
        updateState();
      });
    });

    form.addEventListener('paste', (e) => {
      const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
      const digits = paste.replace(/\D/g, '').slice(0, inputs.length);
      if (!digits) return;
      e.preventDefault();

      for (let j = 0; j < digits.length; j++) inputs[j].value = digits[j];

      inputs[Math.min(inputs.length - 1, digits.length - 1)].focus();
      updateState();
    });

    clearBtn.addEventListener('click', () => {
      inputs.forEach(i => i.value = '');
      inputs[0].focus();
      updateState();
      msg.classList.add('hidden');
    });

    function updateState(){
      const code = inputs.map(i => i.value || '').join('');
      hidden.value = code;
      submitBtn.disabled = code.length !== inputs.length;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = hidden.value;
      if (code.length !== inputs.length) return;

      msg.textContent = 'کد وارد شد: ' + code;
      msg.classList.remove('hidden');

      submitBtn.disabled = true;
      inputs.forEach(i => i.blur());
    });

    if (inputs && inputs[0]) inputs[0].focus();

    document.addEventListener('keyup', (e) => {
      if (e.key === 'Tab') {
        document.documentElement.classList.add('user-is-tabbing');
      }
    });
  });
})();
