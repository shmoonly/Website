(function($) {

    const $window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $header = $('#header'),
        $footer = $('#footer'),
        $main = $('#main'),
        $main_articles = $main.children('article');

    // Define breakpoints.
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px'],
        xxsmall: [null, '360px']
    });

    // Initial animations on page load.
    $window.on('load', () => $body.removeClass('is-preload'));

    // Flexbox fix for IE.
    if (browser.name === 'ie') {
        $window.on('resize.flexbox-fix', () => {
            $wrapper.css('height', $wrapper.prop('scrollHeight') > $window.height() ? 'auto' : '100vh');
        }).triggerHandler('resize.flexbox-fix');
    }

    // Navigation middle alignment if items are even.
    const $nav = $header.children('nav'),
        $nav_li = $nav.find('li');
    if ($nav_li.length % 2 === 0) {
        $nav.addClass('use-middle');
        $nav_li.eq($nav_li.length / 2).addClass('is-middle');
    }

    // Variables for main logic.
    const delay = 325;
    let locked = false;

    // Show an article.
    function showArticle(id, initial) {
        const $article = $main_articles.filter(`#${id}`);
        if (!$article.length) return;

        const swapArticles = $body.hasClass('is-article-visible');

        // Quick transitions when locked or initial load.
        if (locked || initial) {
            toggleVisibility(true, $article, initial);
            return;
        }

        locked = true;

        if (swapArticles) {
            swap($main_articles.filter('.active'), $article);
        } else {
            toggleVisibility(true, $article);
        }
    }

    // Hide the currently active article.
    function hideArticle(addState) {
        const $article = $main_articles.filter('.active');
        if (!$body.hasClass('is-article-visible')) return;

        if (addState) history.pushState(null, null, '#');

        locked = true;
        toggleVisibility(false, $article);
    }

    // Toggle visibility of articles, header, footer, and main sections.
    function toggleVisibility(show, $article, initial = false) {
        $body.toggleClass('is-switching', initial);
        $body.toggleClass('is-article-visible', show);

        $main_articles.removeClass('active');
        $header.toggle(!show);
        $footer.toggle(!show);
        $main.toggle(show);
        $article.toggle(show).addClass('active');

        $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
        setTimeout(() => locked = false, initial ? 1000 : delay);
    }

    // Swap between articles.
    function swap($currentArticle, $newArticle) {
        $currentArticle.removeClass('active').fadeOut(delay, () => {
            $newArticle.fadeIn().addClass('active');
            $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
            locked = false;
        });
    }

    // Close button and prevent bubbling inside articles.
    $main_articles.each(function () {
        $('<div class="close">Close</div>').appendTo(this).on('click', () => location.hash = '');
        $(this).on('click', event => event.stopPropagation());
    });

    // Event listeners.
    $body.on('click', () => $body.hasClass('is-article-visible') && hideArticle(true));
    $window.on('keyup', e => e.keyCode === 27 && hideArticle(true));
    $window.on('hashchange', () => {
        const hash = location.hash;
        if (!hash || hash === '#') hideArticle();
        else if ($main_articles.filter(hash).length) showArticle(hash.substr(1));
    });

    // Scroll restoration for hash changes.
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    } else {
        let oldScrollPos = 0;
        $window.on('scroll', () => oldScrollPos = $(document).scrollTop());
        $window.on('hashchange', () => $window.scrollTop(oldScrollPos));
    }

    // Initialize: hide main and articles, load initial article if hash exists.
    $main.hide();
    $main_articles.hide();
    if (location.hash && location.hash !== '#') {
        $window.on('load', () => showArticle(location.hash.substr(1), true));
    }

})(jQuery);
