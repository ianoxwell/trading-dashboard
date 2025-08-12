import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FaviconService {
  private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private mqListener?: (ev: MediaQueryListEvent) => void;
  private isForced = false;

  private readonly darkModeSubject: BehaviorSubject<boolean>;
  /** Observable stream of the current dark mode state */
  readonly isDarkMode$: Observable<boolean>;

  constructor(@Inject(DOCUMENT) private doc: Document) {
    this.darkModeSubject = new BehaviorSubject<boolean>(this.mediaQuery.matches);
    this.isDarkMode$ = this.darkModeSubject.asObservable();

    this.cleanupStaticTags();
    this.applyTheme(this.darkModeSubject.value, false);

    this.mqListener = (e) => {
      if (!this.isForced) {
        this.updateMode(e.matches, false);
      }
    };
    this.mediaQuery.addEventListener('change', this.mqListener);
  }

  setMode(isDark?: boolean) {
    if (typeof isDark === 'boolean') {
      this.isForced = true;
      this.mediaQuery.removeEventListener('change', this.mqListener!);
      this.updateMode(isDark, true);
    } else {
      this.isForced = false;
      this.updateMode(this.mediaQuery.matches, false);
      this.mediaQuery.addEventListener('change', this.mqListener!);
    }
  }

  private updateMode(dark: boolean, forced: boolean) {
    this.darkModeSubject.next(dark);
    this.applyTheme(dark, forced);
  }

  private applyTheme(dark: boolean, forced: boolean) {
    this.updateFavicon(dark);
    this.updateMeta(dark);
    this.updateDocumentClasses(dark, forced);
  }

  private updateFavicon(dark: boolean) {
    const favicon = this.doc.querySelector<HTMLLinkElement>('link[rel="icon"]') || 
                   this.createFaviconLink();
    favicon.href = `assets/favicon-${dark ? 'dark' : 'light'}.ico?v=${Date.now()}`;
  }

  private createFaviconLink(): HTMLLinkElement {
    const link = this.doc.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    this.doc.head.appendChild(link);
    return link;
  }

  private updateMeta(dark: boolean) {
    this.setMeta('theme-color', dark ? '#0b0b0b' : '#ffffff');
    this.setMeta('color-scheme', dark ? 'dark' : 'light');
  }

  private setMeta(name: string, content: string) {
    let meta = this.doc.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
    if (!meta) {
      meta = this.doc.createElement('meta');
      meta.name = name;
      this.doc.head.appendChild(meta);
    }
    meta.content = content;
  }

  private updateDocumentClasses(dark: boolean, forced: boolean) {
    this.doc.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    this.doc.documentElement.setAttribute('data-theme-source', forced ? 'forced' : 'os');
    this.doc.body.classList.toggle('dark', dark);
    this.doc.documentElement.classList.toggle('ion-palette-dark', dark);
  }

  private cleanupStaticTags() {
    this.doc.querySelectorAll('link[rel="icon"]').forEach(el => el.remove());
    this.doc.querySelectorAll('meta[name="theme-color"]').forEach(el => el.remove());
    this.doc.querySelectorAll('meta[name="color-scheme"]').forEach(el => el.remove());
  }
}
