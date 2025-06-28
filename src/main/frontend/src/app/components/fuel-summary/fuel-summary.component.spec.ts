import { Injector } from '@angular/core';
import { FuelSummary } from './fuel-summary.component';
import { TestBed } from '@angular/core/testing';
import { EventService } from 'src/app/services/event.service';
import { of } from 'rxjs';

describe('FuelSummary', () => {
  let component: FuelSummary;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: EventService,
          useValue: {
            getEventTypes: () => of({}),
          },
        },
      ],
    });
    injector = TestBed.inject(Injector);
    component = new FuelSummary(null, null, injector, null);
    // Mock formRef structure
    (component as any).formRef = {
      object: {
        previousEvent: {},
      },
    };
  });

  it('should return "0" if mileage difference is zero (division by zero)', () => {
    (component as any).formRef.object.amountOfFuel = 40;
    (component as any).formRef.object.mileage = 1000;
    (component as any).formRef.object.previousEvent.mileage = 1000;
    expect(component.calculate()).toBe('0');
  });

  it('should return "?" if amountOfFuel is undefined', () => {
    (component as any).formRef.object.amountOfFuel = undefined;
    (component as any).formRef.object.mileage = 1200;
    (component as any).formRef.object.previousEvent.mileage = 1000;
    expect(component.calculate()).toBe('?');
  });

  it('should return "?" if mileage is undefined', () => {
    (component as any).formRef.object.amountOfFuel = 30;
    (component as any).formRef.object.mileage = undefined;
    (component as any).formRef.object.previousEvent.mileage = 1000;
    expect(component.calculate()).toBe('?');
  });

  it('should calculate value correctly when valid data is provided', () => {
    (component as any).formRef.object.amountOfFuel = 40;
    (component as any).formRef.object.mileage = 1200;
    (component as any).formRef.object.previousEvent.mileage = 1000;
    expect(component.calculate()).toBe('20.00');
  });

  it('should return "?" as previous mileage if previousEvent is missing', () => {
    (component as any).formRef.object.amountOfFuel = 50;
    (component as any).formRef.object.mileage = 500;
    (component as any).formRef.object.previousEvent = undefined;
    expect(component.calculate()).toBe('?');
  });

  it('should return "?" if result is NaN', () => {
    (component as any).formRef.object.amountOfFuel = 'not a number';
    (component as any).formRef.object.mileage = 1200;
    (component as any).formRef.object.previousEvent.mileage = 1000;
    expect(component.calculate()).toBe('?');
  });

  it('should return correct value', () => {
    (component as any).formRef.object.amountOfFuel = 39;
    (component as any).formRef.object.mileage = 186582;
    (component as any).formRef.object.previousEvent.mileage = 186185; //diff: 397km
    expect(component.calculate()).toBe('9.82');
  });
});
