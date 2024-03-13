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
  MFestivos: MFestivos[];
  guardar: StorageService;

  constructor(guardar: StorageService, public dialogRef: MatDialogRef<PopupFestivosComponent>){
    this.guardar = guardar
    this.MFestivos = [];
  }

  onDateChange(event: any) {
    console.log("on onDateChange");
    let date = new Date(this.date.value as unknown as Date);
    let day = date.getDate(); 
    let month = date.getMonth() + 1; 
    let year = date.getFullYear().toString();

    let dayStr = day < 10 ? '0' + day.toString() : day.toString();
    let monthStr = month < 10 ? '0' + month.toString() : month.toString();
    
   // this.dates.push(year+"-"+monthStr+"-"+dayStr);
    let festivo = {
      descripcion: "",
      diafestivo_DD_MM_YYYY: dayStr+"/"+monthStr+"/"+year,
      pais: "",
      ano: date.getFullYear().toString(),
    };
    let retorno = this.guardar.guardarDiasFestivos(festivo)
    if (!retorno) {
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
