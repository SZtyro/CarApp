import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tile-picker',
  templateUrl: './tile-picker.component.html',
  styleUrl: './tile-picker.component.scss'
})
export class TilePickerComponent {

  tiles: any[];
  

  constructor(
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    
    data.data$.subscribe(response => this.tiles = response);
  }

  select(tile){
    this.dialog.close(tile);
  }
}
