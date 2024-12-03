(function ($) {
    // Generate a navigation list
    $.fn.navList = function () {
        return $(this).find('a').map(function () {
            const $a = $(this),
                depth = Math.max(0, $a.parents('li').length - 1),
                href = $a.attr('href') || '',
                target = $a.attr('target') || '';

            return `
                <a class="link depth-${depth}" ${target && `target="${target}"`} ${href && `href="${href}"`}>
                    <span class="indent-${depth}"></span>${$a.text()}
                </a>`;
        }).get().join('');
    };

    // Create a panel
    $.fn.panel = function (config) {
        if (!this.length) return this;

        if (this.length > 1) {
            this.each(function () { $(this).panel(config); });
            return this;
        }

        const $this = $(this),
            $body = $('body'),
            id = $this.attr('id'),
            settings = $.extend({
                delay: 0,
                hideOnClick: false,
                hideOnEscape: false,
                hideOnSwipe: false,
                resetScroll: false,
                resetForms: false,
                side: null,
                target: $this,
                visibleClass: 'visible'
            }, config);

        const target = $(settings.target);
        const hidePanel = (event) => {
            if (!target.hasClass(settings.visibleClass)) return;
            if (event) event.preventDefault();

            target.removeClass(settings.visibleClass);
            setTimeout(() => {
                if (settings.resetScroll) $this.scrollTop(0);
                if (settings.resetForms) $this.find('form').each(function () { this.reset(); });
            }, settings.delay);
        };

        // Event handlers
        $this.css({ '-ms-overflow-style': '-ms-autohiding-scrollbar', '-webkit-overflow-scrolling': 'touch' });

        if (settings.hideOnClick) {
            $this.find('a').on('click', function (event) {
                const $link = $(this),
                    href = $link.attr('href'),
                    target = $link.attr('target');
                if (!href || href.startsWith('#')) return;
                event.preventDefault();
                hidePanel();
                setTimeout(() => {
                    target === '_blank' ? window.open(href) : window.location.href = href;
                }, settings.delay + 10);
            });
        }

        if (settings.hideOnSwipe) {
            let touchPosX, touchPosY;
            $this.on('touchstart', (e) => { touchPosX = e.touches[0].pageX; touchPosY = e.touches[0].pageY; });
            $this.on('touchmove', (e) => {
                const diffX = touchPosX - e.touches[0].pageX,
                    diffY = touchPosY - e.touches[0].pageY,
                    delta = 50;
                if ((settings.side === 'left' && diffX > delta) || (settings.side === 'right' && diffX < -delta)) {
                    hidePanel();
                }
            });
        }

        $body.on('click touchend', hidePanel)
            .on('click', `a[href="#${id}"]`, (event) => {
                event.preventDefault();
                target.toggleClass(settings.visibleClass);
            });

        if (settings.hideOnEscape) {
            $(window).on('keydown', (event) => { if (event.key === 'Escape') hidePanel(); });
        }

        return this;
    };

    // Placeholder polyfill
    $.fn.placeholder = function () {
        if ('placeholder' in document.createElement('input')) return this;

        this.find('input, textarea').each(function () {
            const $input = $(this);
            if (!$input.val()) $input.val($input.attr('placeholder')).addClass('polyfill-placeholder');

            $input.on('focus', () => {
                if ($input.val() === $input.attr('placeholder')) $input.val('').removeClass('polyfill-placeholder');
            }).on('blur', () => {
                if (!$input.val()) $input.val($input.attr('placeholder')).addClass('polyfill-placeholder');
            });
        });

        return this;
    };

    // Prioritize elements
    $.prioritize = function ($elements, condition) {
        const key = '__prioritize';

        $elements.each(function () {
            const $el = $(this);
            if (condition) {
                if (!$el.data(key)) $el.data(key, $el.prev()).prependTo($el.parent());
            } else if ($el.data(key)) {
                $el.insertAfter($el.data(key)).removeData(key);
            }
        });
    };
})(jQuery);
