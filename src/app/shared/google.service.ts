import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import BasicProfile = gapi.auth2.BasicProfile;
import GoogleAuth = gapi.auth2.GoogleAuth;

export interface User {
  isAuthorized: boolean;
  id?: string;
  name?: string;
  image?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  private clientId = '915265282911-nlhhekab7a1u6gm7cf2htkfhj8pnsbm6.apps.googleusercontent.com';
  private GoogleAuth: GoogleAuth;

  private user: BehaviorSubject<User> = new BehaviorSubject<User>({isAuthorized: false});
  public user$ = this.user.asObservable();

  constructor() {
  }

  async initGoogleAuth(): Promise<void> {
    return new Promise((resolve) => {
      gapi.load('auth2', resolve);
    }).then(async () => {
      await gapi.auth2
        .init({ client_id: this.clientId })
        .then(auth => {
          this.GoogleAuth = auth;
        });
    });
  }

  async login(): Promise<boolean> {
    if (!this.GoogleAuth) {
      await this.initGoogleAuth();
    }

    try {
      await this.GoogleAuth.signIn();
    } catch (error){
      console.error(error);
    }

    const user: User = this.updateUser();
    return user.isAuthorized;
  }

  async updateUserObject(): Promise<void> {
    if (!this.GoogleAuth) {
      await this.initGoogleAuth();
    }

    this.updateUser();
  }

  private updateUser(): User {
    let user: User = {
      isAuthorized: false,
    };

    if (this.GoogleAuth.isSignedIn.get()) {
      const profile: BasicProfile = this.GoogleAuth.currentUser.get().getBasicProfile();
      user = {
        isAuthorized: true,
        id: profile.getId(),
        name: profile.getName(),
        image: profile.getImageUrl(),
        email: profile.getEmail()
      };
    }

    this.user.next(user);
    return user;
  }

  async logOut(): Promise<void> {
    await this.GoogleAuth.signOut();
    await this.updateUserObject();
  }
}
