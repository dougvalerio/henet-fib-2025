import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isPopupOpen = false;
  passwordInput = '';
  isPasswordIncorrect = false;
  targetRoute = '';
  private readonly correctPassword = 'h3n3t';
  navigationSubscription: any;

  constructor(private router: Router) {
    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isMenuOpen = false;
        this.closePasswordPopup();
      });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  openPasswordPopup(route: string) {
    this.targetRoute = route;
    this.isPopupOpen = true;
    this.passwordInput = '';
    this.isPasswordIncorrect = false;
  }

  closePasswordPopup() {
    this.isPopupOpen = false;
    this.passwordInput = '';
    this.isPasswordIncorrect = false;
  }

  submitPassword() {
    if (this.passwordInput === this.correctPassword) {
      this.router.navigate([this.targetRoute]);
      this.closePasswordPopup();
    } else {
      this.isPasswordIncorrect = true;
      this.passwordInput = '';
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}