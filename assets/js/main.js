(function($) {
  var $w = $(window),
  $b = $('body'),
  $wr = $('#wrapper'),
  $h = $('#header'),
  $f = $('#footer'),
  $m = $('#main'),
  $ma = $m.children('article');
  breakpoints({
    xlarge: ['1281px', '1680px'],
    large: ['981px', '1280px'],
    medium: ['737px', '980px'],
    small: ['481px', '736px'],
    xsmall: ['361px', '480px'],
    xxsmall: [null, '360px']
  });
  $w.on('load',
  function() {
    setTimeout(function() {
      $b.removeClass('is-preload')
    },
    100)
  });
  if (browser.name == 'ie') {
    var fft;
    $w.on('resize.flexbox-fix',
    function() {
      clearTimeout(fft);
      fft = setTimeout(function() {
        $wr.css('height', $wr.prop('scrollHeight') > $w.height() ? 'auto': '100vh')
      },
      250)
    }).triggerHandler('resize.flexbox-fix')
  }
  var $n = $h.children('nav'),
  $nl = $n.find('li');
  if ($nl.length % 2 == 0) {
    $n.addClass('use-middle');
    $nl.eq($nl.length / 2).addClass('is-middle')
  }
  var d = 325,
  l = 0;
  $m._show = function(id, i) {
    var $a = $ma.filter('#' + id);
    if ($a.length == 0) return;
    if (l || (typeof i != 'undefined' && i === true)) {
      $b.addClass('is-switching is-article-visible');
      $ma.removeClass('active');
      $h.hide();
      $f.hide();
      $m.show();
      $a.show().addClass('active');
      l = 0;
      setTimeout(function() {
        $b.removeClass('is-switching')
      },
      i ? 1000 : 0);
      return
    }
    l = 1;
    if ($b.hasClass('is-article-visible')) {
      var $ca = $ma.filter('.active');
      $ca.removeClass('active');
      setTimeout(function() {
        $ca.hide();
        $a.show();
        setTimeout(function() {
          $a.addClass('active');
          $w.scrollTop(0).triggerHandler('resize.flexbox-fix');
          setTimeout(function() {
            l = 0
          },
          d)
        },
        25)
      },
      d)
    } else {
      $b.addClass('is-article-visible');
      setTimeout(function() {
        $h.hide();
        $f.hide();
        $m.show();
        $a.show();
        setTimeout(function() {
          $a.addClass('active');
          $w.scrollTop(0).triggerHandler('resize.flexbox-fix');
          setTimeout(function() {
            l = 0
          },
          d)
        },
        25)
      },
      d)
    }
  };
  $m._hide = function(as) {
    var $a = $ma.filter('.active');
    if (!$b.hasClass('is-article-visible')) return;
    if (typeof as != 'undefined' && as === true) history.pushState(null, null, '#');
    if (l) {
      $b.addClass('is-switching');
      $a.removeClass('active').hide();
      $m.hide();
      $f.show();
      $h.show();
      $b.removeClass('is-article-visible is-switching');
      l = 0;
      $w.scrollTop(0).triggerHandler('resize.flexbox-fix');
      return
    }
    l = 1;
    $a.removeClass('active');
    setTimeout(function() {
      $a.hide();
      $m.hide();
      $f.show();
      $h.show();
      setTimeout(function() {
        $b.removeClass('is-article-visible');
        $w.scrollTop(0).triggerHandler('resize.flexbox-fix');
        setTimeout(function() {
          l = 0
        },
        d)
      },
      25)
    },
    d)
  };
  $ma.each(function() {
    var $t = $(this);
    $('<div class="close">Close</div>').appendTo($t).on('click',
    function() {
      location.hash = ''
    });
    $t.on('click',
    function(e) {
      e.stopPropagation()
    })
  });
  $b.on('click',
  function() {
    if ($b.hasClass('is-article-visible')) $m._hide(true)
  });
  $w.on('keyup',
  function(e) {
    if (e.keyCode == 27 && $b.hasClass('is-article-visible')) $m._hide(true)
  });
  $w.on('hashchange',
  function(e) {
    if (location.hash == '' || location.hash == '#') {
      e.preventDefault();
      e.stopPropagation();
      $m._hide()
    } else if ($ma.filter(location.hash).length > 0) {
      e.preventDefault();
      e.stopPropagation();
      $m._show(location.hash.substr(1))
    }
  });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  else {
    var osp = 0,
    sp = 0,
    $hb = $('html,body');
    $w.on('scroll',
    function() {
      osp = sp;
      sp = $hb.scrollTop()
    }).on('hashchange',
    function() {
      $w.scrollTop(osp)
    })
  }
  $m.hide();
  $ma.hide();
  if (location.hash != '' && location.hash != '#') $w.on('load',
  function() {
    $m._show(location.hash.substr(1), true)
  })
})(jQuery);
