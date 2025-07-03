// import { EventService } from 'src/app/services/event.service';
// import { TireSummaryComponent } from './tire-summary.component';
// import { TestBed } from '@angular/core/testing';
// import { Injector } from '@angular/core';
// import { TireCompanyService } from 'src/app/services/tire-company.service';
// import { of } from 'rxjs';


// describe('Tire summary fn', () => {
//     let injector: Injector;

//     beforeEach(() => {
//         jasmine.clock().install();
//     });

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//           providers: [
//             {provide: EventService, useValue: {
//                 getEventTypes: () => of({})
//             }},
//             {provide: TireCompanyService, useValue: {
               
//             }}
//           ],
//         });
//         injector = TestBed.inject(Injector);
//       });

//     it('should return simplified data for stadard case', () => {

//         jasmine.clock().mockDate(new Date('2025-05-11'))
//         const component = new TireSummaryComponent(null, null, injector, null);

       
//         expect(component.today.getFullYear()).toEqual(2018);
//         component.lastEvents = [
//         {
//             mileage: 0,
//             date: new Date('2024.06.21'),
//             tires: [
//             { type: 'Summer', side: 'RR', company: { id: 99 } },
//             { type: 'Summer', side: 'RF',  company: { id: 99 } },
//             { type: 'Summer', side: 'LR', company: { id: 99 } },
//             { type: 'Summer', side: 'LF', company: { id: 99 }},
//             ],
//         },
//         {
//             mileage: 11000,
//             date: new Date('2024.11.01'),
//             tires: [
//             { type: 'Winter', side: 'RR', company: { id: 98 } },
//             { type: 'Winter', side: 'RF',  company: { id: 98 } },
//             { type: 'Winter', side: 'LR', company: { id: 98 } },
//             { type: 'Winter', side: 'LF', company: { id: 98 }},
//             ],
//         },
//         {
//             mileage: 14000,
//             date: new Date('2025.04.21'),
//             tires: [
//             { type: 'Summer', side: 'RR', company: { id: 99 } },
//             { type: 'Summer', side: 'RF',  company: { id: 99 } },
//             { type: 'Summer', side: 'LR', company: { id: 99 } },
//             { type: 'Summer', side: 'LF', company: { id: 99 }},
//             ],
//         },
//         ];

//         const summary = component.getTiresSummary();

//         expect(summary.type).toBe('Summer');
//         expect(summary.tireSets[0].logo).toBe('test-logo.png');
        
//     });
// });
