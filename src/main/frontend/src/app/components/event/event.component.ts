import { ComponentPortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableComponent } from 'src/app/tools/table/table.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements AfterViewInit{

  portal: ComponentPortal<any> = null;

  ngAfterViewInit(): void {
   this.portal = new ComponentPortal(TableComponent, null, Injector.create({providers: [{provide: 'data', useValue: new MatTableDataSource([{test: 'xxx', value: 'test'}])}]}));
   let prot: TableComponent = this.portal.component.prototype;
   console.log(prot.testfn());
  //  prot.testfn();
  //  prot.dataSource =  new MatTableDataSource([{test: 'xxx', value: 'test'}]);
   
  }

}
