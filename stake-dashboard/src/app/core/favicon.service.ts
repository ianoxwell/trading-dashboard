import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class FaviconService {
  private readonly lightIco = 'assets/favicon-light.ico';
  private readonly darkIco = 'assets/favicon-dark.ico';

  private readonly lightPng16 = 'assets/favicon-light-16x16.png';
  private readonly lightPng32 = 'assets/favicon-light-32x32.png';
  private readonly darkPng16 = 'assets/favicon-dark-16x16.png';
  private readonly darkPng32 = 'assets/favicon-dark-32x32.png';

  private readonly linkRel = 'icon';

  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private mqListener?: (ev: MediaQueryListEvent) => void;

  constructor(@Inject(DOCUMENT) private doc: Document) {
    // Initialize to OS preference by default
    this.applyIcons(this.mediaQuery.matches);
    // Listen to OS preference changes
    this.mqListener = (e) => this.applyIcons(e.matches);
    this.mediaQuery.addEventListener('change', this.mqListener);
  }

  /**
   * Force favicon mode.
   * Pass true for dark mode, false for light mode, or undefined to revert to OS preference.
   */
  setMode(isDark?: boolean) {
    if (typeof isDark === 'boolean') {
      // Stop listening to OS changes while forced
      if (this.mqListener) this.mediaQuery.removeEventListener('change', this.mqListener);
      this.applyIcons(isDark);
    } else {
      // Revert to OS preference and resume listening
      this.applyIcons(this.mediaQuery.matches);
      if (this.mqListener) this.mediaQuery.addEventListener('change', this.mqListener);
    }
  }

  private applyIcons(dark: boolean) {
    // Update or create 16x16 PNG
    this.updateIconLink(`${dark ? this.darkPng16 : this.lightPng16}`, '16x16', 'image/png');
    // Update or create 32x32 PNG
    this.updateIconLink(`${dark ? this.darkPng32 : this.lightPng32}`, '32x32', 'image/png');
    // Update ICO fallback
    this.updateIconLink(`${dark ? this.darkIco : this.lightIco}`, undefined, 'image/x-icon');
    // Bump a cache-busting query to force refresh in some browsers
    this.bustFaviconCache();
  }

  private updateIconLink(href: string, sizes?: string, type?: string) {
    const selectorParts = [
      `link[rel="${this.linkRel}"]`,
      type ? `[type="${type}"]` : '',
      sizes ? `[sizes="${sizes}"]` : ''
    ].filter(Boolean);
    const selector = selectorParts.join('');
    let linkEl = this.doc.querySelector<HTMLLinkElement>(selector);
    if (!linkEl) {
      linkEl = this.doc.createElement('link');
      linkEl.rel = this.linkRel;
      if (type) linkEl.type = type;
      if (sizes) linkEl.sizes.value = sizes;
      this.doc.head.appendChild(linkEl);
    }
    linkEl.href = href;
  }

  private bustFaviconCache() {
    // Toggle rel to trick some browsers to reload the favicon
    const links = this.doc.querySelectorAll<HTMLLinkElement>(`link[rel="${this.linkRel}"]`);
    links.forEach((lnk) => {
      const tmp = lnk.rel;
      lnk.rel = 'shortcut icon';
      // Trigger reflow to ensure update
      void lnk.offsetHeight;
      lnk.rel = tmp;
    });
  }
}
