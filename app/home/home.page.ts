import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { AutenticacionService } from '../autenticacion.service';
import { MealService } from '../services/meal.service';
import { AlertController, ToastController } from '@ionic/angular';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  logueado: boolean = false;
  username: string = '';
  productos: any[] = [];
  productosFiltrados: any[] = [];
  carrito: any[] = [];
  cargando: boolean = true;
  menuAbierto: boolean = false; 
  menuEvento: any = null; 
  modalAbierto: boolean = false;
  productoSeleccionado: any = null;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    private authService: AutenticacionService,
    private router: Router,
    private mealService: MealService,
    private alertController: AlertController,
    private toastController: ToastController,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.verificarSesion();
    this.cargarProductos();
    this.cargarCarrito();  
  }
  ionViewWillEnter() {
    this.cargarCarrito(); 


    if (this.sidenav && this.sidenav.opened) {
      this.sidenav.close();
    }
  }

  verificarSesion(): void {
    const token = this.localStorageService.getUserToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.username = localStorage.getItem('username') || 'Usuario';
    const toastClass = this.username === 'admin' ? 'custom-toast' : 'success-toast';
    this.showToast(`Bienvenido ${this.username}`, toastClass);
  }

  async showToast(message: string, cssClass: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      cssClass: cssClass,
      position: 'bottom',
    });
    await toast.present();
  }

  cargarProductos(): void {
    this.mealService.getMeals().subscribe(
      (data) => {
        this.productos = this.shuffleArray(
          data.meals.map((meal: any) => ({ ...meal, price: 10000 }))
        );
        this.productosFiltrados = [...this.productos];
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.showToast('Error al cargar productos', 'danger');
      }
    );
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  filtrarProductos(event: any): void {
    const textoBusqueda = event.target.value.toLowerCase().trim();
    this.productosFiltrados = textoBusqueda
      ? this.productos.filter((producto) =>
          producto.strMeal.toLowerCase().includes(textoBusqueda)
        )
      : [...this.productos];
  }

  agregarAlCarrito(producto: any): void {
    const productoEnCarrito = this.carrito.find((item) => item.idMeal === producto.idMeal);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad += 1;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    this.localStorageService.setCarrito(this.carrito);
    this.showToast('Producto agregado al carrito', 'success-toast');
  }
  
  cargarCarrito(): void {

    this.carrito = this.localStorageService.getCarrito();
  }
  removerDelCarrito(item: any): void {
    this.carrito = this.carrito.filter((prod) => prod.idMeal !== item.idMeal);
    this.showToast('Producto eliminado del carrito', 'success-toast');
    this.localStorageService.setCarrito(this.carrito);
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  reducirCantidad(item: any): void {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
      this.localStorageService.setCarrito(this.carrito);
    }
  }

  incrementarCantidad(item: any): void {
    item.cantidad += 1;
    this.localStorageService.setCarrito(this.carrito);
  }

  calcularSubtotal(): number {
    return this.carrito.reduce((total, item) => total + item.price * item.cantidad, 0);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'custom-alert-button', 
        },
        {
          text: 'Cerrar sesión',
          handler: () => {

            this.localStorageService.setCarrito(this.carrito);
            this.localStorageService.clearUserToken(); 
            this.router.navigate(['/login']);
          },
          cssClass: 'custom-alert-button', 
        },
      ],
      cssClass: 'alert-logout', 
    });
    await alert.present();
  }
  
  abrirDetalles(producto: any): void {
    this.mealService.getMealById(producto.idMeal).subscribe(
      (data: any) => {
        if (data.meals && data.meals.length > 0) {
          const meal = data.meals[0];
          this.productoSeleccionado = {
            ...meal,
            ingredientes: this.obtenerIngredientes(meal),
          };
          this.modalAbierto = true;
        } else {
          this.showToast('No se encontraron detalles para este producto', 'danger');
        }
      },
      () => {
        this.showToast('Error al cargar detalles del producto', 'danger');
      }
    );
  }

  obtenerIngredientes(meal: any): string[] {
    const ingredientes: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingrediente = meal[`strIngredient${i}`];
      const medida = meal[`strMeasure${i}`];
      if (ingrediente?.trim()) {
        ingredientes.push(`${medida ? medida : ''} ${ingrediente}`.trim());
      }
    }
    return ingredientes;
  }

  cerrarDetalles(): void {
    this.modalAbierto = false;
    this.productoSeleccionado = null;
  }

  navegarAPago(): void {
    this.router.navigate(['/pago']);
  }

  mostrarMenu(event: any): void {
    this.menuAbierto = true;
    this.menuEvento = event;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
    this.menuEvento = null;
  }

  cerrarSesion(): void {
    this.logout();
  }

  irAMiPerfil(): void {
    this.cerrarMenu();
    this.router.navigate(['/perfil']);
  }
}