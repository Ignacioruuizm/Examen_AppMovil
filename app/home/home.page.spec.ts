import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { MealService } from '../services/meal.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let mealServiceSpy: jasmine.SpyObj<MealService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MealService', ['getMeals']);
    
    await TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: MealService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    mealServiceSpy = TestBed.inject(MealService) as jasmine.SpyObj<MealService>;

    // Simulamos una respuesta para getMeals
    mealServiceSpy.getMeals.and.returnValue(of({
      meals: [
        { strMeal: 'Pizza', strMealThumb: 'pizza.jpg', idMeal: '1', price: 10000 },
        { strMeal: 'Burger', strMealThumb: 'burger.jpg', idMeal: '2', price: 15000 }
      ]
    }));

    fixture.detectChanges(); // Refresca la vista
  });

  it('deberia crearse', () => {
    expect(component).toBeTruthy();
  });

  it('deberia cargar los productos y mostrarlos', () => {
    expect(component.productos.length).toBe(2); // Verifica que se hayan cargado 2 productos

    // Verifica si los productos "Pizza" y "Burger" están presentes, sin depender del orden
    const productTitles = fixture.debugElement.queryAll(By.css('ion-card-title')).map(el => el.nativeElement.textContent);
    expect(productTitles).toContain('Pizza');
    expect(productTitles).toContain('Burger');
  });

  it('deberia agregar productos al carrito', () => {
    // Verificar que el carrito esté vacío al inicio
    component.carrito = [];
  
    const productoSeleccionado = component.productos.find(producto => producto.strMeal === 'Pizza');
    component.agregarAlCarrito(productoSeleccionado); // Agregar 'Pizza' al carrito
  
    expect(component.carrito.length).toBe(1); // Verificar que hay 1 producto en el carrito
    expect(component.carrito[0].strMeal).toBe('Pizza'); // Verificar que el producto agregado es 'Pizza'
  });
  
  
});
