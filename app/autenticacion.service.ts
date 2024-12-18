import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
  export class AutenticacionService {
    private usuarioLogueado: boolean =false;
    constructor (){}
    estaLogueado(): boolean{
        return this.usuarioLogueado;
    }
    iniciarSecion(){
        this.usuarioLogueado = true;
    }
    cerrarSecion(){
        this.usuarioLogueado = false;
    }


}