;(function () {
  'use strict'
  var open = document.getElementById('search-open')
  var close = document.getElementById('search-close')
  var searchBox = document.getElementById('search-input')
  var is404 = document.title.includes('Page Not Found')

  if (open !== null && close !== null) {
    open.addEventListener('click', function (e) {
      // NOTE: ignore event on pseudo-element
      if (e.currentTarget === e.target) return
      open.style.display = 'none'
      close.style.display = 'block'
      searchBox.style.display = 'block'
      searchBox.focus()
    })
    close.addEventListener('click', function (e) {
      // NOTE: ignore event on pseudo-element
      if (e.currentTarget === e.target) return
      open.style.display = 'block'
      close.style.display = 'none'
      searchBox.style.display = 'none'
      searchBox.blur()
    })
  }
})()
