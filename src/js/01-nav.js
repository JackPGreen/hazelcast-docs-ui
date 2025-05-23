/* eslint-disable no-inner-declarations */
;(function () {
  var SECT_CLASS_RX = /^sect(\d)$/
  const VERSION_PICKER_ACTIVE_TOGGLE_NAME = 'data-active-toggle'
  const VERSION_PICKER_TOGGLE_NAME = 'data-toggle-value'
  let currentNavToggleTimer = 0

  function versionPickerToggleHandler () {
    const value = this.getAttribute(VERSION_PICKER_TOGGLE_NAME)
    const versionPicker = document.getElementById('navVersionPicker')
    if (versionPicker.getAttribute(VERSION_PICKER_ACTIVE_TOGGLE_NAME) === value) {
      versionPicker.setAttribute(VERSION_PICKER_ACTIVE_TOGGLE_NAME, '')
    } else {
      versionPicker.setAttribute(VERSION_PICKER_ACTIVE_TOGGLE_NAME, value)
    }
  }

  function addVersionPickerEventListeners () {
    document.getElementById('navbarProductName').addEventListener('click', versionPickerToggleHandler)

    const navbarProductVersionEl = document.getElementById('navbarProductVersion')
    if (navbarProductVersionEl) {
      navbarProductVersionEl.addEventListener('click', versionPickerToggleHandler)
    }
  }

  function handleScroll () {
    const header = document.querySelector('.header')
    if (!header) return

    if (window.scrollY > 50) {
      header.classList.add('shrink')
    } else {
      header.classList.remove('shrink')
    }
  }

  // Listen for scroll events
  if (document.body.classList.contains('page-home')) {
    window.addEventListener('scroll', handleScroll)
    handleScroll() // run once on load
  } else {
    const header = document.querySelector('.header')
    if (header) header.classList.add('shrink')
  }

  if (document.getElementsByClassName('nav-container').length > 0) {
    var navContainer = document.querySelector('.nav-container')
    var navToggle = document.querySelector('.nav-toggle')

    navToggle.addEventListener('click', showNav)
    // NOTE don't let click events propagate outside of nav container
    navContainer.addEventListener('click', concealEvent)

    addVersionPickerEventListeners()

    var menuPanel = navContainer.querySelector('[data-panel=menu]')
    if (!menuPanel) return
    var nav = navContainer.querySelector('.nav')

    var currentPageItem = menuPanel.querySelector('.is-current-page')
    var originalPageItem = currentPageItem
    if (currentPageItem) {
      activateCurrentPath(currentPageItem)
      scrollItemToMidpoint(menuPanel, currentPageItem.querySelector('.nav-link'))
    } else {
      menuPanel.scrollTop = 0
    }

    find(menuPanel, '.nav-item-toggle').forEach(function (btn) {
      var li = btn.parentElement
      btn.addEventListener('click', toggleActive.bind(li))
      var navItemSpan = findNextElement(btn, '.nav-text')
      if (navItemSpan) {
        navItemSpan.style.cursor = 'pointer'
        navItemSpan.addEventListener('click', toggleActive.bind(li))
      }
    })

    find(menuPanel, '.nav-text').forEach(function (btn) {
      var li = btn.parentElement
      btn.addEventListener('click', toggleActive.bind(li))
      var navItemSpan = findNextElement(btn, '.nav-list')
      if (navItemSpan) {
        navItemSpan.style.cursor = 'pointer'
        navItemSpan.addEventListener('click', toggleActive.bind(li))
      }
    })

    find(menuPanel, '.nav-item.is-active').forEach(function (navItem) {
      const list = navItem.querySelector('.nav-list')
      if (list) {
        list.style.height = 'auto'
      }
    })

    // NOTE prevent text from being selected by double click
    menuPanel.addEventListener('mousedown', function (e) {
      if (e.detail > 1) e.preventDefault()
    })

    function onHashChange () {
      var navLink
      var hash = window.location.hash
      if (hash) {
        if (hash.indexOf('%')) hash = decodeURIComponent(hash)
        navLink = menuPanel.querySelector('.nav-link[href="' + hash + '"]')
        if (!navLink) {
          var targetNode = document.getElementById(hash.slice(1))
          if (targetNode) {
            var current = targetNode
            var ceiling = document.querySelector('article.doc')
            while ((current = current.parentNode) && current !== ceiling) {
              var id = current.id
              // NOTE: look for section heading
              if (!id && (id = current.className.match(SECT_CLASS_RX))) id = (current.firstElementChild || {}).id
              if (id && (navLink = menuPanel.querySelector('.nav-link[href="#' + id + '"]'))) break
            }
          }
        }
      }
      var navItem
      if (navLink) {
        navItem = navLink.parentNode
      } else if (originalPageItem) {
        navLink = (navItem = originalPageItem).querySelector('.nav-link')
      } else {
        return
      }
      if (navItem === currentPageItem) return
      find(menuPanel, '.nav-item.is-active').forEach(function (el) {
        el.classList.remove('is-active', 'is-current-path', 'is-current-page')
      })
      navItem.classList.add('is-current-page')
      currentPageItem = navItem
      activateCurrentPath(navItem)
      scrollItemToMidpoint(menuPanel, navLink)
    }

    if (menuPanel.querySelector('.nav-link[href^="#"]')) {
      if (window.location.hash) onHashChange()
      window.addEventListener('hashchange', onHashChange)
    }

    function activateCurrentPath (navItem) {
      var ancestorClasses
      var ancestor = navItem.parentNode
      while (!(ancestorClasses = ancestor.classList).contains('nav-menu')) {
        if (ancestor.tagName === 'LI' && ancestorClasses.contains('nav-item')) {
          ancestorClasses.add('is-active', 'is-current-path')
        }
        ancestor = ancestor.parentNode
      }
      navItem.classList.add('is-active')
    }

    function toggleActive () {
      clearTimeout(currentNavToggleTimer)

      this.classList.toggle('is-active')

      if (this.classList.contains('is-active')) {
        const list = this.querySelector('.nav-list')
        const height = list.scrollHeight
        list.style.height = `${height}px`

        // to support resizing
        currentNavToggleTimer = setTimeout(() => {
          if (this.classList.contains('is-active')) {
            list.style.height = 'auto'
          }
        }, 300)
      } else {
        const list = this.querySelector('.nav-list')
        const height = list.scrollHeight
        list.style.height = `${height}px`
        currentNavToggleTimer = setTimeout(() => {
          this.querySelector('.nav-list').style.height = ''
        }, 0)
      }
    }

    function showNav (e) {
      if (navToggle.classList.contains('is-active')) return hideNav(e)
      var html = document.documentElement
      html.classList.add('is-clipped--nav')
      navToggle.classList.add('is-active')
      navContainer.classList.add('is-active')
      html.addEventListener('click', hideNav)
      concealEvent(e)
    }

    function hideNav (e) {
      var html = document.documentElement
      html.classList.remove('is-clipped--nav')
      navToggle.classList.remove('is-active')
      navContainer.classList.remove('is-active')
      html.removeEventListener('click', hideNav)
      concealEvent(e)
    }

    // NOTE don't let event get picked up by window click listener
    function concealEvent (e) {
      e.stopPropagation()
    }

    function scrollItemToMidpoint (panel, el) {
      var rect = panel.getBoundingClientRect()
      var effectiveHeight = rect.height
      var navStyle = window.getComputedStyle(nav)
      if (navStyle.position === 'sticky') effectiveHeight -= rect.top - parseFloat(navStyle.top)
      panel.scrollTop = Math.max(0, (el.getBoundingClientRect().height - effectiveHeight) * 0.5 + el.offsetTop)
    }

    function find (from, selector) {
      return [].slice.call(from.querySelectorAll(selector))
    }

    function findNextElement (from, selector) {
      var el = from.nextElementSibling
      if (!el) return
      return selector ? el[el.matches ? 'matches' : 'msMatchesSelector'](selector) && el : el
    }
  }
})()
