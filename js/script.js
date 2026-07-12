// ============================================
// 1. 顶部滚动进度条
// ============================================
const scrollBar = document.getElementById('scrollBar');
function updateScrollBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollBar.style.width = percent + '%';
}
window.addEventListener('scroll', updateScrollBar);
updateScrollBar();

// ============================================
// 2. 导航栏滚动样式切换
// ============================================
const nav = document.getElementById('nav');
function updateNavStyle() {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNavStyle);
updateNavStyle();

// ============================================
// 3. 移动端菜单开关
// ============================================
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

navBurger.addEventListener('click', () => {
  navBurger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    navBurger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ============================================
// 4. 滚动进入视口时的淡入动画（轻微上移）
// ============================================
const revealTargets = document.querySelectorAll(
  '.about-text-block, .stats-grid li, .skills-list li, .video-carousel, .research-card, .photo-item, .timeline-item, .contact-inner'
);

revealTargets.forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach((el) => observer.observe(el));

// ============================================
// 5. 视频轮播（Music 板块）
// ============================================
const videoDataEl = document.getElementById('videoData');
if (videoDataEl) {
  const slides = JSON.parse(videoDataEl.textContent);
  let currentSlide = 0;

  const videoHint = document.getElementById('videoHint');
  const videoTitle = document.getElementById('videoTitle');
  const videoDesc = document.getElementById('videoDesc');
  const videoPlayer = document.getElementById('videoPlayer');
  const videoPlaceholder = document.getElementById('videoPlaceholder');
  const videoPosterNum = document.getElementById('videoPosterNum');
  const videoPosterTitle = document.getElementById('videoPosterTitle');
  const dots = document.querySelectorAll('.video-dot');
  const prevBtn = document.getElementById('videoPrev');
  const nextBtn = document.getElementById('videoNext');

  videoPlayer.addEventListener('error', () => {
    videoHint.textContent = `Video not found — add it at ${slides[currentSlide].file}`;
    videoPlayer.style.display = 'none';
    videoPlaceholder.style.display = 'flex';
  });

  videoPlayer.addEventListener('ended', () => {
    videoPlayer.style.display = 'none';
    videoPlaceholder.style.display = 'flex';
  });

  function resetToPlaceholder(index) {
    const slide = slides[index];
    videoPlayer.pause();
    videoPlayer.removeAttribute('src');
    videoPlayer.style.display = 'none';
    videoPlaceholder.style.display = 'flex';
    videoPosterNum.textContent = String(index + 1).padStart(2, '0');
    videoPosterTitle.textContent = slide.title;
    videoHint.textContent = 'Click to play';
  }

  function renderSlide(index) {
    const slide = slides[index];
    videoTitle.textContent = slide.title;
    videoDesc.textContent = slide.desc;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    resetToPlaceholder(index);
  }

  // Only load and play the video once the person clicks the play button.
  videoPlaceholder.addEventListener('click', () => {
    const slide = slides[currentSlide];
    videoPlayer.src = slide.file;
    videoPlayer.style.display = 'block';
    videoPlaceholder.style.display = 'none';
    videoPlayer.play().catch(() => {
      // Autoplay was blocked or the file failed — the controls still let
      // the person press play manually, or the 'error' listener above
      // will fall back to the placeholder if the file truly doesn't exist.
    });
  });

  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    renderSlide(currentSlide);
  });

  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    renderSlide(currentSlide);
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      currentSlide = parseInt(dot.dataset.index, 10);
      renderSlide(currentSlide);
    });
  });

  renderSlide(currentSlide);
}