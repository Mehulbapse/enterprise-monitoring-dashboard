

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly THEME_KEY = 'dashboard-theme';

  private themeSubject: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(this.getStoredTheme());
  theme$: Observable<Theme> = this.themeSubject.asObservable();


  constructor() {
    this.applyTheme(this.themeSubject.getValue());
  }


  toggleTheme() {
    const newTheme: Theme = this.themeSubject.getValue() === 'light' ? 'dark' : 'light';
    this.themeSubject.next(newTheme);
    this.applyTheme(newTheme);
    localStorage.setItem(this.THEME_KEY, newTheme);
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }



  private applyTheme(theme: Theme): void {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }
}