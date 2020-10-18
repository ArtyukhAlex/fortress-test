import {Component, OnInit} from '@angular/core';
import {GoogleService, User} from '../shared/google.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User;

  constructor(private googleService: GoogleService, private router: Router) {
  }

  ngOnInit(): void {
    this.googleService.user$.subscribe(user => this.user = user);
  }

  async login(): Promise<void> {
    const isAuthorized = await this.googleService.login();
    if (isAuthorized) {
      await this.router.navigate(['/details']);
    }
  }

  async logout(): Promise<void> {
    await this.googleService.logOut();
  }

  async logoutAndLogin(): Promise<void> {
    await this.logout();
    await this.login();
  }
}
