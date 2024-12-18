import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LocalStorageService } from '../services/local-storage.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private localStorageService: LocalStorageService,
  ) {}

  async ngOnInit() {
    const initialCredentials = this.localStorageService.getUserCredentials();
    if (!initialCredentials) {
      this.localStorageService.saveUserCredentials('admin', '1234');
    }
  }
  ionViewWillEnter() {
    this.username = '';
    this.password = '';
    const popoverController = document.querySelector('ion-popover');
    if (popoverController) {
      popoverController.dismiss(); 
    }
  }

  async login() {
    const savedCredentials = this.localStorageService.getUserCredentials();
    if (this.username && this.password) {
      if (
        savedCredentials &&
        savedCredentials.username === this.username &&
        savedCredentials.password === this.password
      ) {
        this.localStorageService.setUserToken('authenticated');
        await this.showAlert('Éxito', 'Inicio de sesión exitoso', 'success');
        this.router.navigate(['/home'], { state: { username: this.username } });
      } else {
        await this.showAlert('Error', 'Usuario o contraseña incorrectos', 'error');
      }
    } else {
      await this.showAlert('Error', 'Por favor, complete todos los campos', 'error');
    }
  }

  resetPassword() {
    this.router.navigate(['/reset-password']);
  }

  async showAlert(header: string, message: string, type: 'success' | 'error') {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: type === 'success' ? 'alert-success' : 'alert-error',
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas salir de la aplicación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'custom-alert-button', 
        },
        {
          text: 'Salir',
          handler: () => {
            const carritoActual = this.localStorageService.getCarrito();
            this.localStorageService.setCarrito(carritoActual);
              App.exitApp();
          },
          cssClass: 'custom-alert-button', 
        },
      ],
      cssClass: 'alert-logout', 
    });
    await alert.present();
  }
  

  openWhatsApp() {
    const phoneNumber = '+56225352615';
    const message = 'Hola, necesito ayuda con la aplicación.';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  }
}
