import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  isUserValid: any;
  isValidDriver: any;
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {

    const profile: any = localStorage.getItem('profileInfo')


  }

  goToMyData() {
    this.router.navigate(['update-user']);
  }

  goToMyDataCompany() {
    this.router.navigate(['update-company']);
  }

  goToUpdateAddress() {
    this.router.navigate(['update-address']);
  }



  CloseSession() {

    // pause 3 seconds and updateUser
    setTimeout(() => {
      localStorage.clear();
      window.location.href = '/login';
    }, 3000);

    // Refrescar la página

  }
}
