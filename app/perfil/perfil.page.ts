import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  user = {
    nombre: 'John Doe',
    edad: 28,
    telefono: '+56 9 1234 5678',
    imagen: 'assets/img/profile.jpg', 
  };

  constructor() {}

  ngOnInit() {
    this.cargarDatosUsuario();
  } 
  
  ionViewWillEnter() {
    const popoverController = document.querySelector('ion-popover');
    if (popoverController) {
      popoverController.dismiss(); 
    }
  }

  cargarDatosUsuario() {
    const datosGuardados = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (datosGuardados.nombre) {
      this.user = datosGuardados;
    }
  }

  editarPerfil() {
    console.log('funcionando editar perfil');
  }
}
