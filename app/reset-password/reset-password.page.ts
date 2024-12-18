import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  username: string = '';
  newPassword: string = '';

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private alertController: AlertController
  ) {}

  async resetPassword() {
    if (this.newPassword) {
      this.localStorageService.updateUserPassword(this.newPassword);
      await this.showAlert('Éxito', 'Contraseña actualizada', 'success');
      this.router.navigate(['/login']);
    } else {
      await this.showAlert('Error', 'Por favor, ingrese una nueva contraseña', 'error');
    }
  }

  async showAlert(header: string, message: string, type: 'success' | 'error') {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: type === 'success' ? 'alert-success' : 'alert-error'
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

