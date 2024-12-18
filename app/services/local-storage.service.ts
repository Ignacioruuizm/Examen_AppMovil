import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly USER_TOKEN_KEY = 'userToken';
  private readonly USER_CREDENTIALS_KEY = 'userCredentials';

  constructor() {}

  setUserToken(token: string) {
    localStorage.setItem(this.USER_TOKEN_KEY, token);
  }
  getUserToken(): string | null {
    return localStorage.getItem(this.USER_TOKEN_KEY);
  }

  clearUserToken() {
    localStorage.removeItem(this.USER_TOKEN_KEY);
  }

  saveUserCredentials(username: string, password: string) {
    const credentials = JSON.stringify({ username, password });
    localStorage.setItem(this.USER_CREDENTIALS_KEY, credentials);
  }

  getUserCredentials() {
    const credentials = localStorage.getItem(this.USER_CREDENTIALS_KEY);
    return credentials ? JSON.parse(credentials) : null;
  }
  setCarrito(carrito: any[]) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
  
  getCarrito(): any[] {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
  }
  
  clearCarrito() {
    localStorage.removeItem('carrito');
  }


  
  updateUserPassword(newPassword: string) {
    const credentials = this.getUserCredentials();
    if (credentials) {
      credentials.password = newPassword;
      localStorage.setItem(this.USER_CREDENTIALS_KEY, JSON.stringify(credentials));
    }
  }
}
