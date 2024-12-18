import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MealService } from './meal.service';

describe('MealService', () => {
  let service: MealService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MealService],
    });
    service = TestBed.inject(MealService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener las comidas', () => {
    const dummyMeals = { meals: [{ id: '1', name: 'Pizza' }] };

    service.getMeals().subscribe((meals) => {
      expect(meals).toEqual(dummyMeals);
    });

    const req = httpMock.expectOne('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    expect(req.request.method).toBe('GET');
    req.flush(dummyMeals);
  });

  it('debería obtener la comida por ID', () => {
    const dummyMeal = { meals: [{ id: '1', name: 'Pizza' }] };

    service.getMealById('1').subscribe((meal) => {
      expect(meal).toEqual(dummyMeal);
    });

    const req = httpMock.expectOne('https://www.themealdb.com/api/json/v1/1/lookup.php?i=1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyMeal);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
