import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MFestivos } from 'src/app/Models/MFestivos';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-popup-festivos',
  templateUrl: './popup-festivos.component.html',
  styleUrls: ['./popup-festivos.component.css']
})
export class PopupFestivosComponent {

  date = new FormControl(null);
  dates:string [] = [];
  MFestivos: MFestivos[];
  guardar: StorageService;

  constructor(guardar: StorageService, public dialogRef: MatDialogRef<PopupFestivosComponent>){
    this.guardar = guardar
    this.MFestivos = [];
  }

  onDateChange(event: any) {

    this.dates= [];
    console.log("on onDateChange");
    let date = new Date(this.date.value as unknown as Date);
    let day = date.getDate(); 
    let month = date.getMonth() + 1; 
    let year = date.getFullYear().toString();

    let dayStr = day < 10 ? '0' + day.toString() : day.toString();
let monthStr = month < 10 ? '0' + month.toString() : month.toString();
    

    this.dates.push(year+"-"+monthStr+"-"+dayStr);
    this.dates.push(year)
    let retorno = this.guardar.guardarDiasFestivos(this.dates)
    if (retorno){
      console.log(this.dates+" esto es en el popUp");
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Estos datos ya existen',
        confirmButtonColor: '#0A6EBD',
      });
    }
    
  }

  onClose(): void {
    this.dialogRef.close();
  }
  


}
