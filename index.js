// Simple parallax engine using requestAnimationFrame
// Applies transform based on element's data-parallax-speed attribute
(function () {
  var ticking = false;
  var lastScrollY = 0;

  function getParallaxElements() {
    return Array.prototype.slice.call(
      document.querySelectorAll("[data-parallax-speed]")
    );
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function onScroll() {
    lastScrollY = window.scrollY || window.pageYOffset || 0;
    requestTick();
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(update);
    }
    ticking = true;
  }

  function update() {
    ticking = false;
    var elements = getParallaxElements();
    var viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var speedAttr = el.getAttribute("data-parallax-speed");
      var speed = parseFloat(speedAttr);
      if (!isFinite(speed)) continue;

      var rect = el.getBoundingClientRect();
      var elementCenterFromViewportTop = rect.top + rect.height / 2;
      var distanceFromViewportCenter =
        elementCenterFromViewportTop - viewportHeight / 2;

      // Normalize distance to [-1, 1]
      var normalized = clamp(
        distanceFromViewportCenter / (viewportHeight / 2),
        -1,
        1
      );

      // Translate on Y axis, scaled by speed and normalized distance
      var translateY = normalized * speed * 60; // 60px max at speed=1

      el.style.transform = "translate3d(0," + translateY.toFixed(2) + "px,0)";
      el.style.willChange = "transform";
    }
  }

  function onResize() {
    requestTick();
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Kick an initial update in case elements are in view on load
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
  });
})();

// Count-up animation for header stats
(function () {
  function animateCount(element, targetValue, durationMs) {
    var startTime = null;
    var prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || durationMs <= 0) {
      element.textContent = String(targetValue);
      return;
    }

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(1, elapsed / durationMs);
      // easeOutCubic for a nice finish
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * targetValue);
      element.textContent = String(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var counters = Array.prototype.slice.call(
      document.querySelectorAll("[data-count-to]")
    );
    if (!counters.length) return;

    // Initialize at 0 for visual consistency
    counters.forEach(function (el) {
      el.textContent = "0";
    });

    var hasRun = false;
    var container = document.querySelector("header");
    var observerTarget = container || counters[0];

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !hasRun) {
            hasRun = true;
            counters.forEach(function (el) {
              var toAttr = el.getAttribute("data-count-to");
              var to = parseInt(toAttr, 10);
              if (!isFinite(to)) return;
              animateCount(el, to, 1200);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(observerTarget);
  });
})();


// Typewriter effect for hero title
(function () {
  function typeText(element, fullText, options) {
    var idx = 0;
    element.textContent = "";
    var delay = options && options.delayMs != null ? options.delayMs : 50;

    return new Promise(function (resolve) {
      function step() {
        // Respect prefers-reduced-motion
        var prefersReduced =
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) {
          element.textContent = fullText;
          resolve();
          return;
        }

        element.textContent = fullText.slice(0, idx++);
        if (idx <= fullText.length) {
          window.setTimeout(step, delay);
        } else {
          resolve();
        }
      }
      step();
    });
  }

  function runSequence(container) {
    var spans = Array.prototype.slice.call(
      container.querySelectorAll("[data-typing-text]")
    );
    if (!spans.length) return Promise.resolve();

    // Store original texts
    var originals = spans.map(function (el) {
      return el.textContent || "";
    });
    spans.forEach(function (el) {
      el.textContent = "";
    });

    // Chain typings sequentially
    var p = Promise.resolve();
    spans.forEach(function (el, i) {
      p = p.then(function () {
        return typeText(el, originals[i], { delayMs: 40 });
      });
    });
    return p;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var container = document.querySelector("[data-typing-group]");
    if (!container) return;

    var didRun = false;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !didRun) {
            didRun = true;
            runSequence(container);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(container);
  });
})();

// Chat: show typing bubbles for 400ms, then type out first message
(function () {
  function createTypingBubbles() {
    var wrapper = document.createElement("span");
    wrapper.className = "typing-bubbles";
    for (var i = 0; i < 3; i++) {
      var dot = document.createElement("span");
      dot.className = "dot";
      wrapper.appendChild(dot);
    }
    return wrapper;
  }

  function typeTextInto(el, fullText, delayMs) {
    var i = 0;
    el.textContent = "";
    return new Promise(function (resolve) {
      function step() {
        var prefersReduced =
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) {
          el.textContent = fullText;
          resolve();
          return;
        }
        el.textContent = fullText.slice(0, i++);
        if (i <= fullText.length) {
          setTimeout(step, delayMs);
        } else {
          resolve();
        }
      }
      step();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var msg = document.querySelector("[data-chat-first-message]");
    if (!msg) return;

    var original = msg.textContent.trim();
    var hasRun = false;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !hasRun) {
            hasRun = true;

            // Show typing bubbles
            msg.textContent = "";
            var bubbles = createTypingBubbles();
            msg.appendChild(bubbles);

            setTimeout(function () {
              // Replace bubbles with typed text
              msg.textContent = "";
              typeTextInto(msg, original, 20);
            }, 1000);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(msg);
  });
})();

// Mobile menu toggle with animations
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("mobile-menu-toggle");
    var menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    // Initialize menu as hidden
    menu.classList.add("hidden");
    
    function setOpen(isOpen) {
      if (isOpen) {
        // Show menu with animation
        menu.classList.remove("hidden");
        toggle.classList.add("active");
        // Force reflow then add show class for animation
        menu.offsetHeight;
        menu.classList.add("show");
      } else {
        // Hide menu with animation
        menu.classList.remove("show");
        toggle.classList.remove("active");
        // Wait for animation to complete before hiding
        setTimeout(function() {
          menu.classList.add("hidden");
        }, 300);
      }
    }

    var open = false;
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      open = !open;
      setOpen(open);
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (open && !toggle.contains(e.target) && !menu.contains(e.target)) {
        open = false;
        setOpen(false);
      }
    });

    // Close menu on window resize to desktop size
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768 && open) {
        open = false;
        setOpen(false);
      }
    });
  });
})();
