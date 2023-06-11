import { ComponentPortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, Injector, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableComponent } from '../table/table.component';
import { Table } from '../model/table';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements AfterViewInit {
  portal: ComponentPortal<any> = null;

  @Input()
  field:Table<any>;
  
  ngAfterViewInit(): void {
    setTimeout(() => {
       
    this.portal = new ComponentPortal(
      this.field.componentType,
      null,
      Injector.create({
        providers: [
          {
            provide: 'data',
            useValue: this.field.options
          }
        ],
      })
    );
    }, 10);
    console.log('generataor', this.field);
   
    // let prot: TableComponent = this.portal.component.prototype;
    // console.log(prot.testfn());
    //  prot.testfn();
    //  prot.dataSource =  new MatTableDataSource([{test: 'xxx', value: 'test'}]);
  }
}
