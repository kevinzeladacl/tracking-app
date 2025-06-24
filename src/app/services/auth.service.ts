import { Injectable } from '@angular/core';
import { supabase } from '../supabase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  /**
   * Login con Supabase Auth
   * @param credentials { email, password }
   * @returns Promise con el usuario autenticado o error
   */
  async loginUser(credentials: { email: string; password: string }): Promise<any> {
    const { email, password } = credentials;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }
}
