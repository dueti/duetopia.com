document.addEventListener('DOMContentLoaded', function () {
  var src = document.querySelector('.home-info-compact .social-icons');
  var logo = document.querySelector('header.header .logo');
  if (!src || !logo) return;
  src.classList.add('social-icons-nav');
  var switches = logo.querySelector('.logo-switches');
  if (switches) {
    logo.insertBefore(src, switches);
  } else {
    logo.appendChild(src);
  }
  var compact = document.querySelector('.home-info-compact');
  if (compact) compact.remove();
});
