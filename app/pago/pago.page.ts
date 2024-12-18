import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { AlertController, ToastController } from '@ionic/angular'; 
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {
  carrito: any[] = [];
  total: number = 0;
  boletaAbierta = false;
  mensajeBoleta = '';

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.carrito = this.localStorageService.getCarrito();
  }

  ionViewWillEnter() {
    this.carrito = this.localStorageService.getCarrito();
    this.calcularTotal();
  }

  cargarCarrito(): void {
    this.carrito = this.localStorageService.getCarrito();
    this.calcularTotal();
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => total + item.price * item.cantidad, 0);
  }

  eliminarProducto(producto: any): void {
    this.carrito = this.carrito.filter((item) => item.idMeal !== producto.idMeal);
    this.localStorageService.setCarrito(this.carrito);
    this.calcularTotal();
  }

  incrementarCantidad(item: any) {
    item.cantidad++;
    this.localStorageService.setCarrito(this.carrito);
    this.calcularTotal();
  }

  verificarCarritoVacio(): void {
    if (this.carrito.length === 0) {
      this.router.navigate(['/home']); 
    }
  }

  removerDelCarrito(item: any): void {
    this.carrito = this.carrito.filter((i) => i !== item);
    this.localStorageService.setCarrito(this.carrito);
    this.calcularTotal();
    this.verificarCarritoVacio();
  }

  reducirCantidad(item: any): void {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.localStorageService.setCarrito(this.carrito);
    } else {
      this.removerDelCarrito(item); 
    }
    this.calcularTotal();
    this.verificarCarritoVacio(); 
  }

  async simularPago(): Promise<void> {
    if (this.carrito.length === 0) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El carrito está vacío. Por favor, agregar productos antes de realizar el pago.',
        buttons: [
          {
            text: 'OK',
            cssClass: 'custom-alert-button', 
          },
        ],
        cssClass: 'alert-logout', 
      });

      await alert.present();
      return; 
    }
    
    const total = this.calcularTotal();
    this.mensajeBoleta = `Compra realizada exitosamente. Total: ${total}`;
    this.boletaAbierta = true;

    const toast = await this.toastController.create({
      message: this.mensajeBoleta,
      duration: 5000,
      position: 'top'
    });
    toast.present();

    const alert = await this.alertController.create({
      header: 'Pago realizado',
      message: 'Redirigiendo a la página de inicio...',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.localStorageService.clearCarrito();
            this.carrito = [];
            this.router.navigate(['/home']);
          },
          cssClass: 'custom-alert-button',
        },
      ],
      cssClass: 'alert-logout',
    });

    await alert.present();
  }

  cerrarBoleta() {
    this.boletaAbierta = false;
  }
}
