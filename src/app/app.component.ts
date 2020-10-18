import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {GoogleService, User} from './shared/google.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend-test';
  user: User;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private googleService: GoogleService) {
  }

  ngOnInit(): void {
    this.router
      .events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute.firstChild.snapshot.data.title)
    ).subscribe((title: string) => {
      this.title = title;
    });

    this.googleService.user$.subscribe(user =>  {
      this.user = user;
    });

    this.googleService.updateUserObject();
  }

  async logOut(): Promise<void> {
    await this.googleService.logOut();
    await this.router.navigate(['/login']);
  }
}
