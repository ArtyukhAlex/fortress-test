import { Component, OnInit } from '@angular/core';
import {GoogleService, User} from '../shared/google.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  user: User;

  constructor(private googleService: GoogleService, private router: Router) {}

  ngOnInit(): void {
    this.googleService.user$.subscribe(async user => {
      if (!user.isAuthorized) {
        await this.router.navigate(['/login']);
        return;
      }
      this.user = user;
    });
  }
}
