(function($) {
  $.fn.navList = function() {
    var $t = $(this),
    a = $t.find('a'),
    b = [];
    a.each(function() {
      var $a = $(this),
      i = Math.max(0, $a.parents('li').length - 1),
      h = $a.attr('href'),
      t = $a.attr('target');
      b.push('<a class="link depth-' + i + '"' + (typeof t != 'undefined' && t != '' ? ' target="' + t + '"': '') + (typeof h != 'undefined' && h != '' ? ' href="' + h + '"': '') + '><span class="indent-' + i + '"></span>' + $a.text() + '</a>')
    });
    return b.join('')
  };
  $.fn.panel = function(uc) {
    if (this.length == 0) return $t;
    if (this.length > 1) {
      for (var i = 0; i < this.length; i++) $(this[i]).panel(uc);
      return $t
    }
    var $t = $(this),
    $b = $('body'),
    $w = $(window),
    id = $t.attr('id'),
    c = $.extend({
      delay: 0,
      hideOnClick: 0,
      hideOnEscape: 0,
      hideOnSwipe: 0,
      resetScroll: 0,
      resetForms: 0,
      side: null,
      target: $t,
      visibleClass: 'visible'
    },
    uc);
    if (typeof c.target != 'jQuery') c.target = $(c.target);
    $t._hide = function(e) {
      if (!c.target.hasClass(c.visibleClass)) return;
      if (e) {
        e.preventDefault();
        e.stopPropagation()
      }
      c.target.removeClass(c.visibleClass);
      setTimeout(function() {
        if (c.resetScroll) $t.scrollTop(0);
        if (c.resetForms) $t.find('form').each(function() {
          this.reset()
        })
      },
      c.delay)
    };
    $t.css({
      '-ms-overflow-style': '-ms-autohiding-scrollbar',
      '-webkit-overflow-scrolling': 'touch'
    });
    if (c.hideOnClick) {
      $t.find('a').css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');
      $t.on('click', 'a',
      function(e) {
        var $a = $(this),
        h = $a.attr('href'),
        t = $a.attr('target');
        if (!h || h == '#' || h == '' || h == '#' + id) return;
        e.preventDefault();
        e.stopPropagation();
        $t._hide();
        setTimeout(function() {
          t == '_blank' ? window.open(h) : window.location.href = h
        },
        c.delay + 10)
      })
    }
    $t.on('touchstart',
    function(e) {
      $t.touchPosX = e.originalEvent.touches[0].pageX;
      $t.touchPosY = e.originalEvent.touches[0].pageY
    }).on('touchmove',
    function(e) {
      if ($t.touchPosX === null || $t.touchPosY === null) return;
      var dx = $t.touchPosX - e.originalEvent.touches[0].pageX,
      dy = $t.touchPosY - e.originalEvent.touches[0].pageY,
      th = $t.outerHeight(),
      ts = ($t.get(0).scrollHeight - $t.scrollTop());
      if (c.hideOnSwipe) {
        var r = 0,
        b = 20,
        d = 50;
        switch (c.side) {
        case 'left':
          r = (dy < b && dy > -b) && (dx > d);
          break;
        case 'right':
          r = (dy < b && dy > -b) && (dx < -d);
          break;
        case 'top':
          r = (dx < b && dx > -b) && (dy > d);
          break;
        case 'bottom':
          r = (dx < b && dx > -b) && (dy < -d);
          break;
        default:
          break
        }
        if (r) {
          $t.touchPosX = null;
          $t.touchPosY = null;
          $t._hide();
          return 0
        }
      }
      if (($t.scrollTop() < 0 && dy < 0) || (ts > (th - 2) && ts < (th + 2) && dy > 0)) {
        e.preventDefault();
        e.stopPropagation()
      }
    }).on('click touchend touchstart touchmove',
    function(e) {
      e.stopPropagation()
    }).on('click', 'a[href="#' + id + '"]',
    function(e) {
      e.preventDefault();
      e.stopPropagation();
      c.target.removeClass(c.visibleClass)
    });
    $b.on('click touchend',
    function(e) {
      $t._hide(e)
    }).on('click', 'a[href="#' + id + '"]',
    function(e) {
      e.preventDefault();
      e.stopPropagation();
      c.target.toggleClass(c.visibleClass)
    });
    if (c.hideOnEscape) $w.on('keydown',
    function(e) {
      if (e.keyCode == 27) $t._hide(e)
    });
    return $t
  };
  $.fn.placeholder = function() {
    if (typeof(document.createElement('input')).placeholder != 'undefined') return $(this);
    if (this.length == 0) return $t;
    if (this.length > 1) {
      for (var i = 0; i < this.length; i++) $(this[i]).placeholder();
      return $t
    }
    var $t = $(this);
    $t.find('input[type=text],textarea').each(function() {
      var i = $(this);
      if (i.val() == '' || i.val() == i.attr('placeholder')) i.addClass('polyfill-placeholder').val(i.attr('placeholder'))
    }).on('blur',
    function() {
      var i = $(this);
      if (!i.attr('name').match(/-polyfill-field$/) && i.val() == '') i.addClass('polyfill-placeholder').val(i.attr('placeholder'))
    }).on('focus',
    function() {
      var i = $(this);
      if (!i.attr('name').match(/-polyfill-field$/) && i.val() == i.attr('placeholder')) i.removeClass('polyfill-placeholder').val('')
    });
    $t.find('input[type=password]').each(function() {
      var i = $(this),
      x = $($('<div>').append(i.clone()).remove().html().replace(/type="password"/i, 'type="text"').replace(/type=password/i, 'type=text'));
      if (i.attr('id') != '') x.attr('id', i.attr('id') + '-polyfill-field');
      if (i.attr('name') != '') x.attr('name', i.attr('name') + '-polyfill-field');
      x.addClass('polyfill-placeholder').val(x.attr('placeholder')).insertAfter(i);
      i.val() == '' ? i.hide() : x.hide();
      i.on('blur',
      function(e) {
        e.preventDefault();
        var x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');
        if (i.val() == '') {
          i.hide();
          x.show()
        }
      });
      x.on('focus',
      function(e) {
        e.preventDefault();
        var i = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');
        x.hide();
        i.show().focus()
      }).on('keypress',
      function(e) {
        e.preventDefault();
        x.val('')
      })
    });
    $t.on('submit',
    function() {
      $t.find('input[type=text],input[type=password],textarea').each(function(e) {
        var i = $(this);
        if (i.attr('name').match(/-polyfill-field$/)) i.attr('name', '');
        if (i.val() == i.attr('placeholder')) {
          i.removeClass('polyfill-placeholder');
          i.val('')
        }
      }
    }).on('reset',
    function(e) {
      e.preventDefault();
      $t.find('select').val($('option:first').val());
      $t.find('input,textarea').each(function() {
        var i = $(this),
        x;
        i.removeClass('polyfill-placeholder');
        switch (this.type) {
        case 'submit':
        case 'reset':
          break;
        case 'password':
          i.val(i.attr('defaultValue'));
          x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');
          i.val() == '' ? (i.hide(), x.show()) : (i.show(), x.hide());
          break;
        case 'checkbox':
        case 'radio':
          i.attr('checked', i.attr('defaultValue'));
          break;
        case 'text':
        case 'textarea':
          i.val(i.attr('defaultValue'));
          if (i.val() == '') {
            i.addClass('polyfill-placeholder');
            i.val(i.attr('placeholder'))
          }
          break;
        default:
          i.val(i.attr('defaultValue'));
          break
        }
      })
    });
    return $t
  };
  $.prioritize = function(e, c) {
    var k = '__prioritize';
    if (typeof e != 'jQuery') e = $(e);
    e.each(function() {
      var $e = $(this),
      $p,
      $pa = $e.parent();
      if ($pa.length == 0) return;
      if (!$e.data(k)) {
        if (!c) return;
        $p = $e.prev();
        if ($p.length == 0) return;
        $e.prependTo($pa);
        $e.data(k, $p)
      } else {
        if (c) return;
        $p = $e.data(k);
        $e.insertAfter($p);
        $e.removeData(k)
      }
    })
  })(jQuery);
