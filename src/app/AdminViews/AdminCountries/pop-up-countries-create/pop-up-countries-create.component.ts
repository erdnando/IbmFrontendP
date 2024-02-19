import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { CountryCreateService } from 'src/app/AdminViews/AdminCountries/services/countryCreate/country-create.service';
import { ListCountryService } from 'src/app/AdminViews/AdminCountries/services/list-country/list-country.service';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { ApiParameters } from 'src/app/Views/parameters/services/parameters/api.parameters';
import Swal from 'sweetalert2';
import { StorageService } from 'src/app/Service/storage-service/storage.service';

@Component({
  selector: 'app-pop-up-countries-create',
  templateUrl: './pop-up-countries-create.component.html',
  styleUrls: ['./pop-up-countries-create.component.css']
})
export class PopUpCountriesCreateComponent {

  MCountry: MCountryEntity;
  MUserAuthenticated: any;

  userForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
  });
  
  constructor(public dialogRef: MatDialogRef<PopUpCountriesCreateComponent>, private apiCreateCountry: CountryCreateService, 
    private apiListCountry: ListCountryService, private refresh: ObtenerlistaService,private storageData: StorageService) {
    this.MCountry = {} as MCountryEntity;
    this.MUserAuthenticated = this.storageData.obtenerDatosMapeados();
  }

  onSubmit() {
    
    
    this.MCountry.nameCountry = this.userForm.value.nombre as unknown as string;
    this.MCountry.idUserEntiyId=this.MUserAuthenticated!.idUser;
    console.log(this.MCountry.nameCountry);
    
    this.apiCreateCountry.PostCreateCountry(this.MCountry).subscribe(data=> {
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

}
