// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('userToken'); 

    if (isAuthenticated) {
      return true; 
    } else {
      this.router.navigate(['/login']); 
      return false;
    }
  }
}
