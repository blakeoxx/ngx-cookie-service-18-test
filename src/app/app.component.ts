import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformServer } from '@angular/common';
import { SsrCookieService as CookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly isServerContext: boolean;
  title = 'ssr-cookie-test';

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private cookieService: CookieService) {
    this.isServerContext = isPlatformServer(this.platformId);
  }

  ngOnInit() {
    const ssrCookieName = 'fromserver';

    const currentTime = Date.now();

    if (this.isServerContext) {
      const ssrCookieValue = this.cookieService.get(ssrCookieName);

      if (!this.cookieService.check(ssrCookieName)) {
        console.log('server cookie does not exist yet. It will be created');
      } else {
        console.log(`server cookie had value: ${ssrCookieValue}`);
      }

      this.cookieService.set(ssrCookieName, `${ssrCookieValue}, server time ${currentTime}`);
      console.log(`server cookie updated with timestamp ${currentTime}: ${this.cookieService.get(ssrCookieName)}`);
    } else {
      const ssrCookieValue = this.cookieService.get(ssrCookieName);

      if (!this.cookieService.check(ssrCookieName)) {
        // This should never happen
        console.error('server cookie does not exist. The cookie should have been set by SSR before this page loaded');
      } else {
        console.log(`server cookie had value (read by client): ${ssrCookieValue}`);
      }

      this.cookieService.set(ssrCookieName, `${ssrCookieValue}, client time ${currentTime}`);
      console.log(`server cookie updated with client timestamp ${currentTime}: ${this.cookieService.get(ssrCookieName)}`);
    }
  }
}
