import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.page.html',
  styleUrls: ['./update-user.page.scss'],
})
export class UpdateUserPage implements OnInit {

  dataUser: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    // Obtener los datos del usuario desde localStorage
    const userData = JSON.parse(localStorage.getItem('data') ?? '{}');
    if (userData && userData.user && userData.user.id) {
      // Llamada al servicio para obtener el perfil del usuario
      this.authService.getProfileUser(userData.user.id).subscribe(
        (response: any) => {
          console.log('Datos del usuario:', response);
          this.dataUser = response;
        },
        (error: any) => {
          console.error('Error al obtener los datos del usuario:', error);
        }
      );
    }
  }

  updateUser() {
    // Llamada al servicio para actualizar el perfil del usuario
    console.log('Datos del usuario a actualizar:', this.dataUser);

    delete this.dataUser.email_verified_at;
    this.authService.updateProfileUser(this.dataUser.id, this.dataUser).subscribe(
      (response: any) => {
        console.log('Usuario actualizado:', response);
        this.getUserData();
      },
      (error: any) => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }
}
