import {
  Component,
  HostListener,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  scrolled = false;
  isHome = false;
  menuOpen = false;

  private readonly darkRoutes = ['/', '/contacto'];
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private isDarkRoute(url: string): boolean {
    return this.darkRoutes.includes(url);
  }

  private getScrollY(): number {
    return this.isBrowser ? window.scrollY : 0;
  }

  constructor(private router: Router) {}

  ngOnInit() {
    this.isHome = this.isDarkRoute(this.router.url);

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.isHome = this.isDarkRoute(e.urlAfterRedirects);
        this.scrolled = this.getScrollY() > 40;
        this.menuOpen = false;
      });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu(): void {
    this.menuOpen = false;
  }

  private logoClicks = 0;
  private logoTimer: ReturnType<typeof setTimeout> | null = null;

  onLogoClick(): void {
    this.menuOpen = false;
    this.logoClicks++;
    if (this.logoTimer) clearTimeout(this.logoTimer);
    if (this.logoClicks >= 5) {
      this.logoClicks = 0;
      this.router.navigate(['/admin/login']);
      return;
    }
    this.logoTimer = setTimeout(() => {
      this.logoClicks = 0;
    }, 2000);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = this.getScrollY() > 40;
  }
}
