import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/autenticacion.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'reset-password', loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard] },
  { path: 'perfil', loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule), canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: () => import('./admin/usuarios/usuarios.module').then(m => m.UsuariosPageModule) },
  { path: 'pago', loadChildren: () => import('./pago/pago.module').then(m => m.PagoPageModule) },
  { path: '**', loadChildren: () => import('./no-encontrado/no-encontrado.module').then(m => m.NoEncontradoPageModule) },
  
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
