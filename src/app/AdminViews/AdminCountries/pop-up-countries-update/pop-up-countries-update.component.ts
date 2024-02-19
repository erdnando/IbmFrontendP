import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { CountryUpdateService } from 'src/app/AdminViews/AdminCountries/services/countryUpdate/country-update.service';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Guid } from 'guid-typescript';
import { StorageService } from 'src/app/Service/storage-service/storage.service';

@Component({
  selector: 'app-pop-up-countries-update',
  templateUrl: './pop-up-countries-update.component.html',
  styleUrls: ['./pop-up-countries-update.component.css']
})
export class PopUpCountriesUpdateComponent {

  MCountry: MCountryEntity;
  idCountry: string = "";
  nameCountry: string = "";
  MUserAuthenticated: any;

  userForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopUpCountriesUpdateComponent>, 
  private apiUpdateCountry: CountryUpdateService, private refresh: ObtenerlistaService,
  private storageData: StorageService ) {
    this.MCountry = {} as MCountryEntity
    this.MUserAuthenticated = this.storageData.obtenerDatosMapeados();
  }

  onSubmit() {
    
    this.MCountry.idCounty = this.idCountry as unknown as Guid;
    this.MCountry.nameCountry = this.userForm.value.nombre as unknown as string;
    this.MCountry.idUserEntiyId=this.MUserAuthenticated!.idUser;

    console.log(this.MCountry.idCounty);
    console.log(this.MCountry.nameCountry);
    
    this.apiUpdateCountry.PostUpdateCountry(this.MCountry).subscribe(data=> {
      console.log(data);
      if (data.data) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios Guardados Correctamente',
          confirmButtonColor: '#0A6EBD',
        });
        this.refresh.loadCountriesRefresh();
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


  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

    this.idCountry = this.data.idCountry;
    this.nameCountry = this.data.nameCountry;
  }

}
