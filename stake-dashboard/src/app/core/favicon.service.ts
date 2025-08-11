import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FaviconService {
  private readonly lightIco = 'assets/favicon-light.ico';
  private readonly darkIco = 'assets/favicon-dark.ico';

  private readonly lightPng16 = 'assets/favicon-light-16x16.png';
  private readonly lightPng32 = 'assets/favicon-light-32x32.png';
  private readonly darkPng16 = 'assets/favicon-dark-16x16.png';
  private readonly darkPng32 = 'assets/favicon-dark-32x32.png';

  private readonly linkRel = 'icon';
  private readonly managedAttrName = 'data-favicon';
  private readonly managedAttrValue = 'managed';

  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private mqListener?: (ev: MediaQueryListEvent) => void;
  private isForced = false;

  private readonly darkModeSubject: BehaviorSubject<boolean>;
  /** Observable stream of the current dark mode state used for favicons */
  readonly isDarkMode$: Observable<boolean>;

  constructor(@Inject(DOCUMENT) private doc: Document) {
    // Initialize subject with OS preference by default
    this.darkModeSubject = new BehaviorSubject<boolean>(this.mediaQuery.matches);
    this.isDarkMode$ = this.darkModeSubject.asObservable();

  // Remove conflicting static tags so runtime-managed ones take effect
  this.cleanupHead();

  // Apply initial icons and theme
  const initialDark = this.darkModeSubject.value;
  this.applyIcons(initialDark);
  this.updateThemeColor(initialDark);
  this.updateColorScheme(initialDark);
  this.setDocumentTheme(initialDark, false);

    // Listen to OS preference changes when not forced
    this.mqListener = (e) => {
      if (!this.isForced) {
        const dark = e.matches;
        this.darkModeSubject.next(dark);
        this.applyIcons(dark);
        this.updateThemeColor(dark);
  this.updateColorScheme(dark);
        this.setDocumentTheme(dark, false);
      }
    };
    this.mediaQuery.addEventListener('change', this.mqListener);
  }

  /**
   * Force favicon mode.
   * Pass true for dark mode, false for light mode, or undefined to revert to OS preference.
   */
  setMode(isDark?: boolean) {
    if (typeof isDark === 'boolean') {
      // Force a specific mode and stop reacting to OS changes
      this.isForced = true;
      if (this.mqListener) this.mediaQuery.removeEventListener('change', this.mqListener);
      this.darkModeSubject.next(isDark);
      this.applyIcons(isDark);
  this.updateThemeColor(isDark);
  this.updateColorScheme(isDark);
  this.setDocumentTheme(isDark, true);
    } else {
      // Revert to OS preference and resume listening
      this.isForced = false;
      const dark = this.mediaQuery.matches;
      this.darkModeSubject.next(dark);
      this.applyIcons(dark);
  this.updateThemeColor(dark);
  this.updateColorScheme(dark);
  this.setDocumentTheme(dark, false);
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
      `[${this.managedAttrName}="${this.managedAttrValue}"]`,
      type ? `[type="${type}"]` : '',
      sizes ? `[sizes="${sizes}"]` : ''
    ].filter(Boolean);
    const selector = selectorParts.join('');
    let linkEl = this.doc.querySelector<HTMLLinkElement>(selector);
    if (!linkEl) {
      linkEl = this.doc.createElement('link');
      linkEl.rel = this.linkRel;
      linkEl.setAttribute(this.managedAttrName, this.managedAttrValue);
      if (type) linkEl.type = type;
      if (sizes) linkEl.sizes.value = sizes;
      this.doc.head.appendChild(linkEl);
    }
  // Add cache-busting query to ensure refresh
  const url = new URL(href, this.doc.baseURI || this.doc.URL);
  url.searchParams.set('v', Date.now().toString());
  linkEl.href = url.toString();
  }

  private bustFaviconCache() {
    // Toggle rel to trick some browsers to reload the favicon
  const links = this.doc.querySelectorAll<HTMLLinkElement>(`link[rel="${this.linkRel}"][${this.managedAttrName}="${this.managedAttrValue}"]`);
    links.forEach((lnk) => {
      const tmp = lnk.rel;
      lnk.rel = 'shortcut icon';
      // Trigger reflow to ensure update
      void lnk.offsetHeight;
      lnk.rel = tmp;
    });
  }

  private updateThemeColor(dark: boolean) {
    const selector = `meta[name="theme-color"][${this.managedAttrName}="${this.managedAttrValue}"]`;
    let meta = this.doc.querySelector<HTMLMetaElement>(selector);
    if (!meta) {
      meta = this.doc.createElement('meta');
      meta.name = 'theme-color';
      meta.setAttribute(this.managedAttrName, this.managedAttrValue);
      this.doc.head.appendChild(meta);
    }
    meta.content = dark ? '#0b0b0b' : '#ffffff';
  }

  private setDocumentTheme(dark: boolean, forced: boolean) {
    const root = this.doc.documentElement;
    // Always reflect current theme on the root for easier inspection and CSS targeting
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (forced) {
      root.setAttribute('data-theme-source', 'forced');
    } else {
      root.setAttribute('data-theme-source', 'os');
    }

    // Ionic recommended: toggle body class 'dark' for full component theming
    this.doc.body.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('ion-palette-dark', dark);
  }

  private updateColorScheme(dark: boolean) {
    const selector = `meta[name="color-scheme"][${this.managedAttrName}="${this.managedAttrValue}"]`;
    let meta = this.doc.querySelector<HTMLMetaElement>(selector);
    if (!meta) {
      meta = this.doc.createElement('meta');
      meta.name = 'color-scheme';
      meta.setAttribute(this.managedAttrName, this.managedAttrValue);
      this.doc.head.appendChild(meta);
    }
    meta.content = dark ? 'dark' : 'light';
  }

  private cleanupHead() {
    // Remove static favicon links to avoid browser caching a different one
    const staticIcons = this.doc.querySelectorAll<HTMLLinkElement>(
      `link[rel="${this.linkRel}"]:not([${this.managedAttrName}="${this.managedAttrValue}"])`
    );
    staticIcons.forEach((el) => el.parentElement?.removeChild(el));

    // Remove static theme-color metas (we will manage a single one)
    const staticThemeMetas = this.doc.querySelectorAll<HTMLMetaElement>(
      `meta[name="theme-color"]:not([${this.managedAttrName}="${this.managedAttrValue}"])`
    );
    staticThemeMetas.forEach((el) => el.parentElement?.removeChild(el));

    // Remove static color-scheme meta (we will manage this)
    const staticColorSchemeMetas = this.doc.querySelectorAll<HTMLMetaElement>(
      `meta[name="color-scheme"]:not([${this.managedAttrName}="${this.managedAttrValue}"])`
    );
    staticColorSchemeMetas.forEach((el) => el.parentElement?.removeChild(el));
  }
}
