import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MParameters } from 'src/app/Models/MParameters';
import { ApiParameters } from 'src/app/Views/parameters/services/parameters/api.parameters';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Guid } from 'guid-typescript';
import Swal from 'sweetalert2';
import { ParametersComponent } from '../parameters/parameters.component';
import { StorageService } from 'src/app/Service/storage-service/storage.service';

@Component({
  selector: 'app-pop-up-create-parameter',
  templateUrl: './pop-up-create-parameter.component.html',
  styleUrls: ['./pop-up-create-parameter.component.css']
})
export class PopUpCreateParameterComponent {

  MParameter:MParameters;
  typeHour: number = 0;
  idCountry: string = "";
  limitDay = new FormControl('');
  limitWeek = new FormControl('');
  limitMonth = new FormControl('');
  limitYear = new FormControl('');

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopUpCreateParameterComponent>, private apiCreateParameter: ApiParameters,private observableParameters: StorageService) 
  {
    this.MParameter ={} as MParameters;
  }

  guardarCambios(){

    console.log(this.limitDay.value);
    console.log(this.limitMonth.value);
    console.log(this.limitWeek.value);
    console.log(this.limitYear.value);
    console.log(this.idCountry);
    console.log(this.typeHour)

    
    this.MParameter.targetTimeDay = Number(this.formatComma(this.limitDay.value!));
    this.MParameter.targetHourWeek = Number(this.formatComma(this. limitWeek.value!));
    this.MParameter.targetHourMonth = Number(this.formatComma(this.limitMonth.value!));
    this.MParameter.targetHourYear= Number(this.formatComma(this.limitYear.value!))
    this.MParameter.typeLimits = 0;
    this.MParameter.typeHours = this.typeHour;
    this.MParameter.countryEntityId = this.idCountry as unknown as Guid;

    console.log(this.MParameter.idParametersEntity);
    console.log(this.MParameter.countryEntityId);
    console.log(this.MParameter.typeHours);
    console.log(this.MParameter.targetTimeDay);

    if( this.MParameter.targetTimeDay > 24 ||
        this.MParameter.targetHourWeek > 168 ||
        this.MParameter.targetHourMonth > 744 ||
        this.MParameter.targetHourYear > 8928){
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: '¡Uno o más valores supera el límite máximo permitido, favor validar!',
        confirmButtonColor: '#0A6EBD',
      });
      return;
    }
    
    this.apiCreateParameter.PostCreateParameter(this.MParameter).subscribe(data=> {
      console.log(data);
      if (data.data) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios Guardados Correctamente',
          confirmButtonColor: '#0A6EBD',
        });
        this.observableParameters.observableParameters(this.idCountry as unknown as Guid);
        this.dialogRef.close();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error, los datos no se pudieron cambiar',
          confirmButtonColor: '#0A6EBD',
        });
      }
    }) ;

  }

  formatComma(n: string) {
    console.log(n);
    if(!isNaN(Number(n))) return Number(n);

    'use strict';
    n = n.replace(/\./g, '').replace(',', '.');
    console.log(n);
    return Number(n);
}

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    
   
    if(this.data.tipoHora == "standby"){
      this.typeHour = 0;
    }else{
      this.typeHour = 1;
    }

    this.idCountry = this.data.idCountry;
    
}

onKeyPressOnlyNumbers(event: KeyboardEvent): void {
  const inputValue = (event.target as HTMLInputElement).value;
  const isDotOrComma = inputValue.includes('.') || inputValue.includes(',');

  if (!/[\d.,]/.test(event.key) || (isDotOrComma && (event.key === '.' || event.key === ','))) {
    event.preventDefault();
  }
}

}
