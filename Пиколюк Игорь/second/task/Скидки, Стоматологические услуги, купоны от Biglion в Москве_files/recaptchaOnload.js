/**
 * Вызывается после полной загрузки скрипта рекаптчи.
 * Ищет ноды с классом g-recaptcha и инициализирует на них запрос токена рекаптчи по нажатию.
 * Если рекаптча не инициализированна - выполнятся не будет.
 * Если кнопка не имеет атрибута disabled - она будет пропущена (подразумевается что она уже сынициализированна).
 */
function invRecaptcaReadyCallback() {
    if (typeof grecaptcha === 'undefined' || grecaptcha === null) {
        return;
    }

    [].forEach.call(document.querySelectorAll('.g-recaptcha'), function (button) {
        if (!button.disabled) {
            return;
        }

        grecaptcha.render(button, {
            'sitekey': button.getAttribute('data-sitekey'),
            'callback': button.getAttribute('data-callback'),
            'badge': 'invisible'
        });
        button.removeAttribute('disabled');
        button.classList.remove('disabled', 'gray');

        [].forEach.call(document.querySelectorAll('.inv_recapcha_loader'), function (spinner) {
            spinner.classList.remove('nr-anim-target');
            spinner.style.display = 'none';
        });
    });
}
