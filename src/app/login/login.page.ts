import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    if (localStorage.getItem('data')) {
      this.router.navigate(['/tabs/home'], { replaceUrl: true });
    }
  }

  // Método para realizar el login llamando al endpoint del AuthService
  async login() {
    const credentials = { email: this.email, password: this.password };
    try {
      const res: any = await this.authService.loginUser(credentials);
      console.log("Login exitoso:", res);
      const toast = await this.toastController.create({
        message: 'Autenticación exitosa',
        duration: 2000,
        color: 'success'
      });
      toast.present();

      // Guardar token y datos de usuario
      if (res && res.session && res.session.access_token) {
        localStorage.setItem('access_token', res.session.access_token);
      }
      if (res && res.user) {
        localStorage.setItem('user_data', JSON.stringify(res.user));
      }

      // Navegar a la página principal (o dashboard) tras el login exitoso
      this.router.navigate(['/tabs/home'], { replaceUrl: true });
    } catch (error: any) {
      console.error("Error en el login:", error);
      // Supabase error message may be in error.message
      if (error.message && error.message.includes('correo electrónico no ha sido verificado')) {
        this.router.navigate(['register-6']);
        const toast = await this.toastController.create({
          message: 'El correo electrónico no ha sido verificado. Por favor verifica tu correo antes de iniciar sesión.',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      } else {
        const toast = await this.toastController.create({
          message: 'Error en el login. Por favor, revisa tus credenciales.',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    }
  }

  goToRegister() {
    console.log("Register");
    this.router.navigate(['/register']);
  }
}