document.addEventListener('DOMContentLoaded', function () {
  var src = document.querySelector('.nav-social-source .social-icons');
  var logo = document.querySelector('header.header .logo');
  if (!src || !logo) return;
  src.classList.add('social-icons-nav');
  var switches = logo.querySelector('.logo-switches');
  logo.insertBefore(src, switches || null);
  var holder = document.querySelector('.nav-social-source');
  if (holder) holder.remove();
});
