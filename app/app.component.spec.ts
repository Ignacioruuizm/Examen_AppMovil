import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component'; 
import { ActivatedRoute } from '@angular/router'; 
import { of } from 'rxjs'; 

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], 
      providers: [
        {
          provide: ActivatedRoute, 
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'mockValue', 
              },
            },
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();
  });

  it('Deberia crear la App', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
