import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './autenticacion.guard';


describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Configura el mock de Router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy } // Reemplaza Router con el mock
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('debería crearse', () => {
    expect(guard).toBeTruthy();
  });

  it('debería permitir la entrada si userToken existe en localStorage', () => {
    // Mock localStorage para que devuelva un token
    spyOn(localStorage, 'getItem').and.returnValue('fakeToken');

    const result = guard.canActivate();

    expect(result).toBeTrue(); // Debe retornar true
    expect(routerSpy.navigate).not.toHaveBeenCalled(); // No debe redirigir
  });

  it('debería bloquear la entrada y navegar al login si userToken no existe', () => {
    // Mock localStorage para que devuelva null
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const result = guard.canActivate();

    expect(result).toBeFalse(); // Debe retornar false
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']); // Debe redirigir a /login
  });
});
