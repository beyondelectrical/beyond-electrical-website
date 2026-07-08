/* ============================================================
   Intro animation sequencer.
   Plays once per browser session, skippable, and skipped
   entirely for reduced-motion users (handled in CSS) or repeat
   visits within the same session (handled here).
   ============================================================ */

(function () {
  var overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  var alreadySeen = sessionStorage.getItem('beyondIntroSeen') === '1';
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (alreadySeen || prefersReducedMotion) {
    overlay.classList.add('hidden');
    document.body.classList.remove('intro-lock');
    return;
  }

  document.body.classList.add('intro-lock');

  var logo = overlay.querySelector('.intro-logo');
  var cord = overlay.querySelector('.intro-cord');
  var character = overlay.querySelector('.intro-character');
  var skipBtn = overlay.querySelector('.intro-skip');

  var timers = [];
  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function finish() {
    clearTimers();
    overlay.classList.add('fade-out');
    sessionStorage.setItem('beyondIntroSeen', '1');
    setTimeout(function () {
      overlay.classList.add('hidden');
      document.body.classList.remove('intro-lock');
    }, 550);
  }

  function runSequence() {
    // Logo flickers on like a bulb warming up
    at(150, function () { logo.classList.add('flicker-on'); });
    // Cord fades in once the logo has settled
    at(1300, function () { cord.classList.add('visible'); });
    // Character walks in
    at(1500, function () { character.classList.add('walk-in'); });
    // Character reaches for the cord
    at(2250, function () { character.classList.add('reach'); });
    // Character pulls
    at(2600, function () {
      character.classList.add('pull');
      cord.classList.add('pulled');
      logo.classList.remove('flicker-on');
      logo.classList.add('flicker-off');
    });
    // Hold on black briefly, then reveal the page
    at(3150, finish);
  }

  skipBtn.addEventListener('click', finish);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) finish();
  });

  runSequence();
})();
