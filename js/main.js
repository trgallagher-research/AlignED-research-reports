/**
 * AlignED Research Reports — Main JavaScript
 * Handles mobile navigation toggle only.
 */
document.addEventListener('DOMContentLoaded', function() {
  /* Mobile nav toggle */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  }

  /* Close nav when clicking outside */
  document.addEventListener('click', function(e) {
    if (nav && nav.classList.contains('active') &&
        !nav.contains(e.target) &&
        navToggle && !navToggle.contains(e.target)) {
      nav.classList.remove('active');
    }
  });
});
