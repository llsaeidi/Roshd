/* NUGET: BEGIN LICENSE TEXT
 *
 * Microsoft grants you the right to use these script files for the sole
 * purpose of either: (i) interacting through your browser with the Microsoft
 * website or online service, subject to the applicable licensing or use
 * terms; or (ii) using the files as included with a Microsoft product subject
 * to that product's license terms. Microsoft reserves all other rights to the
 * files not expressly granted by Microsoft, whether by implication, estoppel
 * or otherwise. Insofar as a script file is dual licensed under GPL,
 * Microsoft neither took the code under GPL nor distributes it thereunder but
 * under the terms set out in this paragraph. All notices and licenses
 * below are for informational purposes only.
 *
 * NUGET: END LICENSE TEXT */

/**
* bootstrap.js v3.0.0 by @fat and @mdo
* Copyright 2013 Twitter Inc.
* http://www.apache.org/licenses/LICENSE-2.0
*/
if (!jQuery) { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: secondthirdsecondmodal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#secondthirdsecondmodals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */

+function ($) {
    "use strict";

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Modal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Modal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Modal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move modals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for modal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Modal.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {
            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hideModal, this))
                .emulateTransitionEnd(300) :
              this.hideModal()
            }
       
    }

    Modal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Modal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Modal.prototype.hideModal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Modal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Modal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // MODAL PLUGIN DEFINITION
    // =======================

    var old = $.fn.modal

    $.fn.modal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.modal.Constructor = Modal


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function () {
        $.fn.modal = old
        return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .modal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);//ok
+function ($) {
    "use strict";

    // secondmodal CLASS DEFINITION
    // ======================

    var secondmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    secondmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    secondmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    secondmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="secondmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move secondmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for secondmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    secondmodal.prototype.hide = function (e) {
       
        if( confirm("آیا مایل به بستن  این پنجره هستید؟"))
        {
            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hidesecondmodal, this))
                .emulateTransitionEnd(300) :
              this.hidesecondmodal()
        }

       
    }

    secondmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    secondmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    secondmodal.prototype.hidesecondmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    secondmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    secondmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // secondmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.secondmodal

    $.fn.secondmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, secondmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new secondmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.secondmodal.Constructor = secondmodal


    // secondmodal NO CONFLICT
    // =================

    $.fn.secondmodal.noConflict = function () {
        $.fn.secondmodal = old
        return this
    }


    // secondmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="secondmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('secondmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .secondmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);//ok
+function ($) {
    "use strict";

    // thirdmodal CLASS DEFINITION
    // ======================

    var thirdmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    thirdmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    thirdmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    thirdmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="thirdmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move thirdmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for thirdmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    thirdmodal.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {
            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hidethirdmodal, this))
                .emulateTransitionEnd(300) :
              this.hidethirdmodal()
        }
       
    }

    thirdmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    thirdmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    thirdmodal.prototype.hidethirdmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    thirdmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    thirdmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // thirdmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.thirdmodal

    $.fn.thirdmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, thirdmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new thirdmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.thirdmodal.Constructor = thirdmodal


    // thirdmodal NO CONFLICT
    // =================

    $.fn.thirdmodal.noConflict = function () {
        $.fn.thirdmodal = old
        return this
    }


    // thirdmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="thirdmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('thirdmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .thirdmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);//ok
+function ($) {
    "use strict";

    // fourthmodal CLASS DEFINITION
    // ======================

    var fourthmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    fourthmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    fourthmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    fourthmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="fourthmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move fourthmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for fourthmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    fourthmodal.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {

            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hidefourthmodal, this))
                .emulateTransitionEnd(300) :
              this.hidefourthmodal()

        }
       
    }

    fourthmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    fourthmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    fourthmodal.prototype.hidefourthmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    fourthmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    fourthmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // fourthmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.fourthmodal

    $.fn.fourthmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, fourthmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new fourthmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.fourthmodal.Constructor = fourthmodal


    // fourthmodal NO CONFLICT
    // =================

    $.fn.fourthmodal.noConflict = function () {
        $.fn.fourthmodal = old
        return this
    }


    // fourthmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="fourthmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('fourthmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .fourthmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);
+function ($) {
    "use strict";

    // fivemodal CLASS DEFINITION
    // ======================

    var fivemodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    fivemodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    fivemodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    fivemodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="fivemodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move fivemodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for fivemodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    fivemodal.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {
            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hidefivemodal, this))
                .emulateTransitionEnd(300) :
              this.hidefivemodal()
        }

       
    }

    fivemodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    fivemodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    fivemodal.prototype.hidefivemodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    fivemodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    fivemodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // fivemodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.fivemodal

    $.fn.fivemodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, fivemodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new fivemodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.fivemodal.Constructor = fivemodal


    // fivemodal NO CONFLICT
    // =================

    $.fn.fivemodal.noConflict = function () {
        $.fn.fivemodal = old
        return this
    }


    // fivemodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="fivemodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('fivemodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .fivemodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);
+function ($) {
    "use strict";

    // sixmodal CLASS DEFINITION
    // ======================

    var sixmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    sixmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    sixmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    sixmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="sixmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move sixmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for sixmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    sixmodal.prototype.hide = function (e) {
        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {
            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hidesixmodal, this))
                .emulateTransitionEnd(300) :
              this.hidesixmodal()

        }


    }

    sixmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    sixmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    sixmodal.prototype.hidesixmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    sixmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    sixmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // sixmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.sixmodal

    $.fn.sixmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, sixmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new sixmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.sixmodal.Constructor = sixmodal


    // sixmodal NO CONFLICT
    // =================

    $.fn.sixmodal.noConflict = function () {
        $.fn.sixmodal = old
        return this
    }


    // sixmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="sixmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('sixmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .sixmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);
+function ($) {
    "use strict";

    // sevenmodal CLASS DEFINITION
    // ======================

    var sevenmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    sevenmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    sevenmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    sevenmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="sevenmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move sevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for sevenmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    sevenmodal.prototype.hide = function (e) {
        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hidesevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hidesevenmodal()
    }

    sevenmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    sevenmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    sevenmodal.prototype.hidesevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    sevenmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    sevenmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // sevenmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.sevenmodal

    $.fn.sevenmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, sevenmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new sevenmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.sevenmodal.Constructor = sevenmodal


    // sevenmodal NO CONFLICT
    // =================

    $.fn.sevenmodal.noConflict = function () {
        $.fn.sevenmodal = old
        return this
    }


    // sevenmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="sevenmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('sevenmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .sevenmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);
+function ($) {
    "use strict";

    // eghitmodal CLASS DEFINITION
    // ======================

    var eghitmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    eghitmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    eghitmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    eghitmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="eghitmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move eghitmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for eghitmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    eghitmodal.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {

            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hideeghitmodal, this))
                .emulateTransitionEnd(300) :
              this.hideeghitmodal()

            }

     
    }

    eghitmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    eghitmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    eghitmodal.prototype.hideeghitmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    eghitmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    eghitmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // eghitmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.eghitmodal

    $.fn.eghitmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, eghitmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new eghitmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.eghitmodal.Constructor = eghitmodal


    // eghitmodal NO CONFLICT
    // =================

    $.fn.eghitmodal.noConflict = function () {
        $.fn.eghitmodal = old
        return this
    }


    // eghitmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="eghitmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('eghitmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .eghitmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);
+function ($) {
    "use strict";

    // ninemodal CLASS DEFINITION
    // ======================

    var ninemodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    ninemodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    ninemodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    ninemodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="ninemodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move ninemodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for ninemodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    ninemodal.prototype.hide = function (e) {
        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {


        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideninemodal, this))
            .emulateTransitionEnd(300) :
          this.hideninemodal()
       }
    }

    ninemodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    ninemodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    ninemodal.prototype.hideninemodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    ninemodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    ninemodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // ninemodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.ninemodal

    $.fn.ninemodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, ninemodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new ninemodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.ninemodal.Constructor = ninemodal


    // ninemodal NO CONFLICT
    // =================

    $.fn.ninemodal.noConflict = function () {
        $.fn.ninemodal = old
        return this
    }


    // ninemodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="ninemodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('ninemodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .ninemodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);
+function ($) {
    "use strict";

    // tenmodal CLASS DEFINITION
    // ======================

    var tenmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    tenmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    tenmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    tenmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="tenmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move tenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for tenmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    tenmodal.prototype.hide = function (e) {
        

            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hidetenmodal, this))
                .emulateTransitionEnd(300) :
              this.hidetenmodal()


       
       


    }

    tenmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    tenmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    tenmodal.prototype.hidetenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    tenmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    tenmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // tenmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.tenmodal

    $.fn.tenmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, tenmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new tenmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.tenmodal.Constructor = tenmodal


    // tenmodal NO CONFLICT
    // =================

    $.fn.tenmodal.noConflict = function () {
        $.fn.tenmodal = old
        return this
    }


    // tenmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="tenmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('tenmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .tenmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // elevenmodal CLASS DEFINITION
    // ======================

    var elevenmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    elevenmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    elevenmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    elevenmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="elevenmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for elevenmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    elevenmodal.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {

            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
                .emulateTransitionEnd(300) :
              this.hideelevenmodal()
        }
    }

    elevenmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    elevenmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    elevenmodal.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    elevenmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    elevenmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // elevenmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.elevenmodal

    $.fn.elevenmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, elevenmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new elevenmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.elevenmodal.Constructor = elevenmodal


    // elevenmodal NO CONFLICT
    // =================

    $.fn.elevenmodal.noConflict = function () {
        $.fn.elevenmodal = old
        return this
    }


    // elevenmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="elevenmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('elevenmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .elevenmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // Twelvemodal CLASS DEFINITION
    // ======================

    var Twelvemodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Twelvemodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Twelvemodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Twelvemodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Twelvemodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Twelvemodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Twelvemodal.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {

            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
                .emulateTransitionEnd(300) :
              this.hideelevenmodal()
        }
    }

    Twelvemodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Twelvemodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Twelvemodal.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Twelvemodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Twelvemodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Twelvemodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.Twelvemodal

    $.fn.Twelvemodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Twelvemodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Twelvemodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Twelvemodal.Constructor = Twelvemodal


    // Twelvemodal NO CONFLICT
    // =================

    $.fn.Twelvemodal.noConflict = function () {
        $.fn.Twelvemodal = old
        return this
    }


    // Twelvemodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Twelvemodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Twelvemodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Twelvemodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // Thirteenmodal CLASS DEFINITION
    // ======================

    var Thirteenmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Thirteenmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Thirteenmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Thirteenmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Thirteenmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Thirteenmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Thirteenmodal.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {

            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
                .emulateTransitionEnd(300) :
              this.hideelevenmodal()
        }
    }

    Thirteenmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Thirteenmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Thirteenmodal.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Thirteenmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Thirteenmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Thirteenmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.Thirteenmodal

    $.fn.Thirteenmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Thirteenmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Thirteenmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Thirteenmodal.Constructor = Thirteenmodal


    // Thirteenmodal NO CONFLICT
    // =================

    $.fn.Thirteenmodal.noConflict = function () {
        $.fn.Thirteenmodal = old
        return this
    }


    // Thirteenmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Thirteenmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Thirteenmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Thirteenmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // Fourteenmodal CLASS DEFINITION
    // ======================

    var Fourteenmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Fourteenmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Fourteenmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Fourteenmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Fourteenmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Fourteenmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Fourteenmodal.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {

            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
                .emulateTransitionEnd(300) :
              this.hideelevenmodal()
        }
    }

    Fourteenmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Fourteenmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Fourteenmodal.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Fourteenmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Fourteenmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Fourteenmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.Fourteenmodal

    $.fn.Fourteenmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Fourteenmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Fourteenmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Fourteenmodal.Constructor = Fourteenmodal


    // Fourteenmodal NO CONFLICT
    // =================

    $.fn.Fourteenmodal.noConflict = function () {
        $.fn.Fourteenmodal = old
        return this
    }


    // Fourteenmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Fourteenmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Fourteenmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Fourteenmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // Fifteenmodal CLASS DEFINITION
    // ======================

    var Fifteenmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Fifteenmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Fifteenmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Fifteenmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Fifteenmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Fifteenmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Fifteenmodal.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {

            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
                .emulateTransitionEnd(300) :
              this.hideelevenmodal()
        }
    }

    Fifteenmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Fifteenmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Fifteenmodal.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Fifteenmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Fifteenmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Fifteenmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.Fifteenmodal

    $.fn.Fifteenmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Fifteenmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Fifteenmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Fifteenmodal.Constructor = Fifteenmodal


    // Fifteenmodal NO CONFLICT
    // =================

    $.fn.Fifteenmodal.noConflict = function () {
        $.fn.Fifteenmodal = old
        return this
    }


    // Fifteenmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Fifteenmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Fifteenmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Fifteenmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // sixteenmodal CLASS DEFINITION
    // ======================

    var sixteenmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    sixteenmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    sixteenmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    sixteenmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="sixteenmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for sixteenmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    sixteenmodal.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {

            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
                .emulateTransitionEnd(300) :
              this.hideelevenmodal()
        }
    }

    sixteenmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    sixteenmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    sixteenmodal.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    sixteenmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    sixteenmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // sixteenmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.sixteenmodal

    $.fn.sixteenmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, sixteenmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new sixteenmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.sixteenmodal.Constructor = sixteenmodal


    // sixteenmodal NO CONFLICT
    // =================

    $.fn.sixteenmodal.noConflict = function () {
        $.fn.sixteenmodal = old
        return this
    }


    // sixteenmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="sixteenmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('sixteenmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .sixteenmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);



+function ($) {
    "use strict";

    // sixteenmodaltwo CLASS DEFINITION
    // ======================

    var sixteenmodaltwo = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    sixteenmodaltwo.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    sixteenmodaltwo.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    sixteenmodaltwo.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="sixteenmodaltwo"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for sixteenmodaltwo to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    sixteenmodaltwo.prototype.hide = function (e) {

      

            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
                .emulateTransitionEnd(300) :
              this.hideelevenmodal()
         
    }

    sixteenmodaltwo.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    sixteenmodaltwo.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    sixteenmodaltwo.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    sixteenmodaltwo.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    sixteenmodaltwo.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // sixteenmodaltwo PLUGIN DEFINITION
    // =======================

    var old = $.fn.sixteenmodaltwo

    $.fn.sixteenmodaltwo = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, sixteenmodaltwo.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new sixteenmodaltwo(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.sixteenmodaltwo.Constructor = sixteenmodaltwo


    // sixteenmodaltwo NO CONFLICT
    // =================

    $.fn.sixteenmodaltwo.noConflict = function () {
        $.fn.sixteenmodaltwo = old
        return this
    }


    // sixteenmodaltwo DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="sixteenmodaltwo"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('sixteenmodaltwo') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .sixteenmodaltwo(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);



+function ($) {
    "use strict";

    // Seventeenmodal CLASS DEFINITION
    // ======================

    var Seventeenmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Seventeenmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Seventeenmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Seventeenmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Seventeenmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Seventeenmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Seventeenmodal.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {

            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
                .emulateTransitionEnd(300) :
              this.hideelevenmodal()
        }
    }

    Seventeenmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Seventeenmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Seventeenmodal.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Seventeenmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Seventeenmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Seventeenmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.Seventeenmodal

    $.fn.Seventeenmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Seventeenmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Seventeenmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Seventeenmodal.Constructor = Seventeenmodal


    // Seventeenmodal NO CONFLICT
    // =================

    $.fn.Seventeenmodal.noConflict = function () {
        $.fn.Seventeenmodal = old
        return this
    }


    // Seventeenmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Seventeenmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Seventeenmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Seventeenmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);


+function ($) {
    "use strict";

    // Eighteenmodal CLASS DEFINITION
    // ======================

    var Eighteenmodal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Eighteenmodal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Eighteenmodal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Eighteenmodal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Eighteenmodal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Eighteenmodal to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Eighteenmodal.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {

            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
                .emulateTransitionEnd(300) :
              this.hideelevenmodal()
        }
    }

    Eighteenmodal.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Eighteenmodal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Eighteenmodal.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Eighteenmodal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Eighteenmodal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Eighteenmodal PLUGIN DEFINITION
    // =======================

    var old = $.fn.Eighteenmodal

    $.fn.Eighteenmodal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Eighteenmodal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Eighteenmodal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Eighteenmodal.Constructor = Eighteenmodal


    // Eighteenmodal NO CONFLICT
    // =================

    $.fn.Eighteenmodal.noConflict = function () {
        $.fn.Eighteenmodal = old
        return this
    }


    // Eighteenmodal DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Eighteenmodal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Eighteenmodal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Eighteenmodal(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);


+function ($) {
    "use strict";

    // Nineteenmodel CLASS DEFINITION
    // ======================

    var Nineteenmodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Nineteenmodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Nineteenmodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Nineteenmodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Nineteenmodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Nineteenmodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Nineteenmodel.prototype.hide = function (e) {
      
        

        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()
   
    }

    Nineteenmodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Nineteenmodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Nineteenmodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Nineteenmodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Nineteenmodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Nineteenmodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.Nineteenmodel

    $.fn.Nineteenmodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Nineteenmodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Nineteenmodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Nineteenmodel.Constructor = Nineteenmodel


    // Nineteenmodel NO CONFLICT
    // =================

    $.fn.Nineteenmodel.noConflict = function () {
        $.fn.Nineteenmodel = old
        return this
    }


    // Nineteenmodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Nineteenmodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Nineteenmodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Nineteenmodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // Twentymodel CLASS DEFINITION
    // ======================

    var Twentymodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Twentymodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Twentymodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Twentymodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Twentymodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Twentymodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Twentymodel.prototype.hide = function (e) {

        if (confirm("آیا مایل به بستن  این پنجره هستید؟")) {

            if (e) e.preventDefault()

            e = $.Event('hide.bs.modal')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.bs.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)
              .off('click.dismiss.modal')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$element
                .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
                .emulateTransitionEnd(300) :
              this.hideelevenmodal()
        }
    }

    Twentymodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Twentymodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Twentymodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Twentymodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Twentymodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Twentymodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.Twentymodel

    $.fn.Twentymodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Twentymodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Twentymodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Twentymodel.Constructor = Twentymodel


    // Twentymodel NO CONFLICT
    // =================

    $.fn.Twentymodel.noConflict = function () {
        $.fn.Twentymodel = old
        return this
    }


    // Twentymodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Twentymodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Twentymodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Twentymodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);



+function ($) {
    "use strict";

    // Twentyonemodel CLASS DEFINITION
    // ======================

    var Twentyonemodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Twentyonemodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Twentyonemodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Twentyonemodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Twentyonemodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Twentyonemodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Twentyonemodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    Twentyonemodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Twentyonemodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Twentyonemodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Twentyonemodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Twentyonemodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Twentyonemodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.Twentyonemodel

    $.fn.Twentyonemodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Twentyonemodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Twentyonemodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Twentyonemodel.Constructor = Twentyonemodel


    // Twentyonemodel NO CONFLICT
    // =================

    $.fn.Twentyonemodel.noConflict = function () {
        $.fn.Twentyonemodel = old
        return this
    }


    // Twentyonemodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Twentyonemodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Twentyonemodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Twentyonemodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // Twentytwomodel CLASS DEFINITION
    // ======================

    var Twentytwomodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Twentytwomodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Twentytwomodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Twentytwomodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Twentytwomodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Twentytwomodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Twentytwomodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    Twentytwomodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Twentytwomodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Twentytwomodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Twentytwomodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Twentytwomodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Twentytwomodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.Twentytwomodel

    $.fn.Twentytwomodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Twentytwomodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Twentytwomodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Twentytwomodel.Constructor = Twentytwomodel


    // Twentytwomodel NO CONFLICT
    // =================

    $.fn.Twentytwomodel.noConflict = function () {
        $.fn.Twentytwomodel = old
        return this
    }


    // Twentytwomodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Twentytwomodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Twentytwomodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Twentytwomodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);



+function ($) {
    "use strict";

    // Twentythreemodel CLASS DEFINITION
    // ======================

    var Twentythreemodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Twentythreemodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Twentythreemodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Twentythreemodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Twentythreemodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Twentythreemodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Twentythreemodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    Twentythreemodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Twentythreemodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Twentythreemodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Twentythreemodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Twentythreemodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Twentythreemodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.Twentythreemodel

    $.fn.Twentythreemodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Twentythreemodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Twentythreemodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Twentythreemodel.Constructor = Twentythreemodel


    // Twentythreemodel NO CONFLICT
    // =================

    $.fn.Twentythreemodel.noConflict = function () {
        $.fn.Twentythreemodel = old
        return this
    }


    // Twentythreemodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Twentythreemodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Twentythreemodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Twentythreemodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // Twentyfouremodel CLASS DEFINITION
    // ======================

    var Twentyfouremodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Twentyfouremodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Twentyfouremodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Twentyfouremodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Twentyfouremodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Twentyfouremodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Twentyfouremodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    Twentyfouremodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Twentyfouremodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Twentyfouremodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Twentyfouremodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Twentyfouremodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Twentyfouremodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.Twentyfouremodel

    $.fn.Twentyfouremodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Twentyfouremodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Twentyfouremodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Twentyfouremodel.Constructor = Twentyfouremodel


    // Twentyfouremodel NO CONFLICT
    // =================

    $.fn.Twentyfouremodel.noConflict = function () {
        $.fn.Twentyfouremodel = old
        return this
    }


    // Twentyfouremodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Twentyfouremodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Twentyfouremodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Twentyfouremodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // Twentyfivemodel CLASS DEFINITION
    // ======================

    var Twentyfivemodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Twentyfivemodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Twentyfivemodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Twentyfivemodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Twentyfivemodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Twentyfivemodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Twentyfivemodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    Twentyfivemodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Twentyfivemodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Twentyfivemodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Twentyfivemodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Twentyfivemodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Twentyfivemodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.Twentyfivemodel

    $.fn.Twentyfivemodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Twentyfivemodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Twentyfivemodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Twentyfivemodel.Constructor = Twentyfivemodel


    // Twentyfivemodel NO CONFLICT
    // =================

    $.fn.Twentyfivemodel.noConflict = function () {
        $.fn.Twentyfivemodel = old
        return this
    }


    // Twentyfivemodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Twentyfivemodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Twentyfivemodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Twentyfivemodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // Twentysixmodel CLASS DEFINITION
    // ======================

    var Twentysixmodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Twentysixmodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Twentysixmodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Twentysixmodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Twentysixmodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Twentysixmodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Twentysixmodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    Twentysixmodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Twentysixmodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Twentysixmodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Twentysixmodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Twentysixmodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Twentysixmodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.Twentysixmodel

    $.fn.Twentysixmodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Twentysixmodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Twentysixmodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Twentysixmodel.Constructor = Twentysixmodel


    // Twentysixmodel NO CONFLICT
    // =================

    $.fn.Twentysixmodel.noConflict = function () {
        $.fn.Twentysixmodel = old
        return this
    }


    // Twentysixmodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Twentysixmodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Twentysixmodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Twentysixmodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);
+function ($) {
    "use strict";

    // Twentysevenmodel CLASS DEFINITION
    // ======================

    var Twentysevenmodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Twentysevenmodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Twentysevenmodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Twentysevenmodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Twentysevenmodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Twentysevenmodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Twentysevenmodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    Twentysevenmodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Twentysevenmodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Twentysevenmodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Twentysevenmodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Twentysevenmodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Twentysevenmodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.Twentysevenmodel

    $.fn.Twentysevenmodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Twentysevenmodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Twentysevenmodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Twentysevenmodel.Constructor = Twentysevenmodel


    // Twentysevenmodel NO CONFLICT
    // =================

    $.fn.Twentysevenmodel.noConflict = function () {
        $.fn.Twentysevenmodel = old
        return this
    }


    // Twentysevenmodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Twentysevenmodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Twentysevenmodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Twentysevenmodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // Twentyeightmodel CLASS DEFINITION
    // ======================

    var Twentyeightmodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Twentyeightmodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Twentyeightmodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Twentyeightmodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Twentyeightmodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Twentyeightmodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Twentyeightmodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    Twentyeightmodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Twentyeightmodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Twentyeightmodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Twentyeightmodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Twentyeightmodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Twentyeightmodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.Twentyeightmodel

    $.fn.Twentyeightmodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Twentyeightmodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Twentyeightmodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Twentyeightmodel.Constructor = Twentyeightmodel


    // Twentyeightmodel NO CONFLICT
    // =================

    $.fn.Twentyeightmodel.noConflict = function () {
        $.fn.Twentyeightmodel = old
        return this
    }


    // Twentyeightmodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Twentyeightmodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Twentyeightmodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Twentyeightmodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);


+function ($) {
    "use strict";

    // Twentyninemodel CLASS DEFINITION
    // ======================

    var Twentyninemodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Twentyninemodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Twentyninemodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Twentyninemodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Twentyninemodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Twentyninemodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Twentyninemodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    Twentyninemodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Twentyninemodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Twentyninemodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Twentyninemodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Twentyninemodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Twentyninemodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.Twentyninemodel

    $.fn.Twentyninemodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Twentyninemodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Twentyninemodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Twentyninemodel.Constructor = Twentyninemodel


    // Twentyninemodel NO CONFLICT
    // =================

    $.fn.Twentyninemodel.noConflict = function () {
        $.fn.Twentyninemodel = old
        return this
    }


    // Twentyninemodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Twentyninemodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Twentyninemodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Twentyninemodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // Thirtymodel CLASS DEFINITION
    // ======================

    var Thirtymodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    Thirtymodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Thirtymodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Thirtymodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="Thirtymodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for Thirtymodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    Thirtymodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    Thirtymodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    Thirtymodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    Thirtymodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Thirtymodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Thirtymodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // Thirtymodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.Thirtymodel

    $.fn.Thirtymodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Thirtymodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Thirtymodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.Thirtymodel.Constructor = Thirtymodel


    // Thirtymodel NO CONFLICT
    // =================

    $.fn.Thirtymodel.noConflict = function () {
        $.fn.Thirtymodel = old
        return this
    }


    // Thirtymodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="Thirtymodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('Thirtymodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .Thirtymodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // ThirtyOnemodel CLASS DEFINITION
    // ======================

    var ThirtyOnemodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    ThirtyOnemodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    ThirtyOnemodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    ThirtyOnemodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="ThirtyOnemodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for ThirtyOnemodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    ThirtyOnemodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    ThirtyOnemodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    ThirtyOnemodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    ThirtyOnemodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    ThirtyOnemodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    ThirtyOnemodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // ThirtyOnemodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.ThirtyOnemodel

    $.fn.ThirtyOnemodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, ThirtyOnemodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new ThirtyOnemodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.ThirtyOnemodel.Constructor = ThirtyOnemodel


    // ThirtyOnemodel NO CONFLICT
    // =================

    $.fn.ThirtyOnemodel.noConflict = function () {
        $.fn.ThirtyOnemodel = old
        return this
    }


    // ThirtyOnemodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="ThirtyOnemodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('ThirtyOnemodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .ThirtyOnemodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // ThirtyTwomodel CLASS DEFINITION
    // ======================

    var ThirtyTwomodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    ThirtyTwomodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    ThirtyTwomodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    ThirtyTwomodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="ThirtyTwomodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for ThirtyTwomodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    ThirtyTwomodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    ThirtyTwomodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    ThirtyTwomodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    ThirtyTwomodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    ThirtyTwomodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    ThirtyTwomodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // ThirtyTwomodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.ThirtyTwomodel

    $.fn.ThirtyTwomodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, ThirtyTwomodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new ThirtyTwomodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.ThirtyTwomodel.Constructor = ThirtyTwomodel


    // ThirtyTwomodel NO CONFLICT
    // =================

    $.fn.ThirtyTwomodel.noConflict = function () {
        $.fn.ThirtyTwomodel = old
        return this
    }


    // ThirtyTwomodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="ThirtyTwomodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('ThirtyTwomodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .ThirtyTwomodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // ThirtyThreemodel CLASS DEFINITION
    // ======================

    var ThirtyThreemodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    ThirtyThreemodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    ThirtyThreemodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    ThirtyThreemodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="ThirtyThreemodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for ThirtyThreemodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    ThirtyThreemodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    ThirtyThreemodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    ThirtyThreemodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    ThirtyThreemodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    ThirtyThreemodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    ThirtyThreemodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // ThirtyThreemodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.ThirtyThreemodel

    $.fn.ThirtyThreemodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, ThirtyThreemodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new ThirtyThreemodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.ThirtyThreemodel.Constructor = ThirtyThreemodel


    // ThirtyThreemodel NO CONFLICT
    // =================

    $.fn.ThirtyThreemodel.noConflict = function () {
        $.fn.ThirtyThreemodel = old
        return this
    }


    // ThirtyThreemodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="ThirtyThreemodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('ThirtyThreemodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .ThirtyThreemodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // ThirtyFourmodel CLASS DEFINITION
    // ======================

    var ThirtyFourmodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    ThirtyFourmodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    ThirtyFourmodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    ThirtyFourmodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="ThirtyFourmodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for ThirtyFourmodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    ThirtyFourmodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    ThirtyFourmodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    ThirtyFourmodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    ThirtyFourmodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    ThirtyFourmodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    ThirtyFourmodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // ThirtyFourmodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.ThirtyFourmodel

    $.fn.ThirtyFourmodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, ThirtyFourmodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new ThirtyFourmodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.ThirtyFourmodel.Constructor = ThirtyFourmodel


    // ThirtyFourmodel NO CONFLICT
    // =================

    $.fn.ThirtyFourmodel.noConflict = function () {
        $.fn.ThirtyFourmodel = old
        return this
    }


    // ThirtyFourmodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="ThirtyFourmodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('ThirtyFourmodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .ThirtyFourmodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // ThirtyFivemodel CLASS DEFINITION
    // ======================

    var ThirtyFivemodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    ThirtyFivemodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    ThirtyFivemodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    ThirtyFivemodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="ThirtyFivemodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for ThirtyFivemodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    ThirtyFivemodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    ThirtyFivemodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    ThirtyFivemodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    ThirtyFivemodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    ThirtyFivemodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    ThirtyFivemodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // ThirtyFivemodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.ThirtyFivemodel

    $.fn.ThirtyFivemodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, ThirtyFivemodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new ThirtyFivemodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.ThirtyFivemodel.Constructor = ThirtyFivemodel


    // ThirtyFivemodel NO CONFLICT
    // =================

    $.fn.ThirtyFivemodel.noConflict = function () {
        $.fn.ThirtyFivemodel = old
        return this
    }


    // ThirtyFivemodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="ThirtyFivemodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('ThirtyFivemodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .ThirtyFivemodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // ThirtySixmodel CLASS DEFINITION
    // ======================

    var ThirtySixmodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    ThirtySixmodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    ThirtySixmodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    ThirtySixmodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="ThirtySixmodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for ThirtySixmodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    ThirtySixmodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    ThirtySixmodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    ThirtySixmodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    ThirtySixmodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    ThirtySixmodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    ThirtySixmodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // ThirtySixmodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.ThirtySixmodel

    $.fn.ThirtySixmodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, ThirtySixmodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new ThirtySixmodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.ThirtySixmodel.Constructor = ThirtySixmodel


    // ThirtySixmodel NO CONFLICT
    // =================

    $.fn.ThirtySixmodel.noConflict = function () {
        $.fn.ThirtySixmodel = old
        return this
    }


    // ThirtySixmodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="ThirtySixmodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('ThirtySixmodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .ThirtySixmodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // ThirtySevenmodel CLASS DEFINITION
    // ======================

    var ThirtySevenmodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    ThirtySevenmodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    ThirtySevenmodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    ThirtySevenmodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="ThirtySevenmodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for ThirtySevenmodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    ThirtySevenmodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    ThirtySevenmodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    ThirtySevenmodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    ThirtySevenmodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    ThirtySevenmodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    ThirtySevenmodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // ThirtySevenmodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.ThirtySevenmodel

    $.fn.ThirtySevenmodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, ThirtySevenmodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new ThirtySevenmodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.ThirtySevenmodel.Constructor = ThirtySevenmodel


    // ThirtySevenmodel NO CONFLICT
    // =================

    $.fn.ThirtySevenmodel.noConflict = function () {
        $.fn.ThirtySevenmodel = old
        return this
    }


    // ThirtySevenmodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="ThirtySevenmodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('ThirtySevenmodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .ThirtySevenmodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // ThirtyEightmodel CLASS DEFINITION
    // ======================

    var ThirtyEightmodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    ThirtyEightmodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    ThirtyEightmodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    ThirtyEightmodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="ThirtyEightmodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for ThirtyEightmodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    ThirtyEightmodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    ThirtyEightmodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    ThirtyEightmodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    ThirtyEightmodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    ThirtyEightmodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    ThirtyEightmodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // ThirtyEightmodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.ThirtyEightmodel

    $.fn.ThirtyEightmodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, ThirtyEightmodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new ThirtyEightmodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.ThirtyEightmodel.Constructor = ThirtyEightmodel


    // ThirtyEightmodel NO CONFLICT
    // =================

    $.fn.ThirtyEightmodel.noConflict = function () {
        $.fn.ThirtyEightmodel = old
        return this
    }


    // ThirtyEightmodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="ThirtyEightmodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('ThirtyEightmodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .ThirtyEightmodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

+function ($) {
    "use strict";

    // ThirtyNinemodel CLASS DEFINITION
    // ======================

    var ThirtyNinemodel = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop =
        this.isShown = null

        if (this.options.remote) this.$element.load(this.options.remote)
    }

    ThirtyNinemodel.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    ThirtyNinemodel.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    ThirtyNinemodel.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.$element.on('click.dismiss.modal', '[data-dismiss="ThirtyNinemodel"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) // don't move elevenmodals dom position
            }

            that.$element.show()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
              that.$element.find('.modal-dialog') // wait for ThirtyNinemodel to slide in
                .one($.support.transition.end, function () {
                    that.$element.focus().trigger(e)
                })
                .emulateTransitionEnd(300) :
              that.$element.focus().trigger(e)
        })
    }

    ThirtyNinemodel.prototype.hide = function (e) {



        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)
          .off('click.dismiss.modal')

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element
            .one($.support.transition.end, $.proxy(this.hideelevenmodal, this))
            .emulateTransitionEnd(300) :
          this.hideelevenmodal()

    }

    ThirtyNinemodel.prototype.enforceFocus = function () {
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
              if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                  this.$element.focus()
              }
          }, this))
    }

    ThirtyNinemodel.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal')
        }
    }

    ThirtyNinemodel.prototype.hideelevenmodal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    ThirtyNinemodel.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    ThirtyNinemodel.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$element.on('click.dismiss.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static'
                  ? this.$element[0].focus.call(this.$element[0])
                  : this.hide.call(this)
            }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade') ?
              this.$backdrop
                .one($.support.transition.end, callback)
                .emulateTransitionEnd(150) :
              callback()

        } else if (callback) {
            callback()
        }
    }


    // ThirtyNinemodel PLUGIN DEFINITION
    // =======================

    var old = $.fn.ThirtyNinemodel

    $.fn.ThirtyNinemodel = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, ThirtyNinemodel.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new ThirtyNinemodel(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    $.fn.ThirtyNinemodel.Constructor = ThirtyNinemodel


    // ThirtyNinemodel NO CONFLICT
    // =================

    $.fn.ThirtyNinemodel.noConflict = function () {
        $.fn.ThirtyNinemodel = old
        return this
    }


    // ThirtyNinemodel DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="ThirtyNinemodel"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        var option = $target.data('ThirtyNinemodel') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .ThirtyNinemodel(option, this)
          .one('hide', function () {
              $this.is(':visible') && $this.focus()
          })
    })

    $(document)
      .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);






 


/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(window.jQuery);
