export class ParallaxHero {
  constructor() {
    this.hero = document.querySelector('.hero');
    this.bg = document.querySelector('.hero-right');
    this.init();
  }

  init() {
    if (!this.hero || !this.bg) return;
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();
  }

  onScroll() {
    const scrollY = window.scrollY;
    const heroHeight = this.hero.offsetHeight;

    if (scrollY > heroHeight) return;

    const progress = scrollY / heroHeight;

    this.bg.style.transform = `translateY(${progress * 40}px) scale(${1 + progress * 0.05})`;
    this.bg.style.filter = `brightness(${1 - progress * 0.15})`;
  }
}
