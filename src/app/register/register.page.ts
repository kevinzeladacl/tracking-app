import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../supabase';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  async register() {
    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: this.email,
      password: this.password,
      options: {
        data: { name: this.name }
      }
    });
    if (error) {
      alert('Error en el registro: ' + error.message);
      return;
    }
    alert('Registro exitoso. Revisa tu correo para verificar la cuenta.');
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

