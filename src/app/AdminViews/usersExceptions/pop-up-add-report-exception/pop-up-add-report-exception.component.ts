import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { CountryCreateService } from 'src/app/AdminViews/AdminCountries/services/countryCreate/country-create.service';
import { ListCountryService } from 'src/app/AdminViews/AdminCountries/services/list-country/list-country.service';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { ApiParameters } from 'src/app/Views/parameters/services/parameters/api.parameters';
import Swal from 'sweetalert2';
import { ReportExceptionService } from '../service/reportExceptionService/report-exception.service';
import { StorageService } from 'src/app/Service/storage-service/storage.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';

@Component({
  selector: 'app-pop-up-add-report-exception',
  templateUrl: './pop-up-add-report-exception.component.html',
  styleUrls: ['./pop-up-add-report-exception.component.css']
})
export class PopUpAddReportExceptionComponent {
  MUser: any;
  reportForm = new FormGroup({
    report: new FormControl('', [Validators.required]),
  });
  
  constructor(
    public dialogRef: MatDialogRef<PopUpAddReportExceptionComponent>, 
    private storageService: StorageService,
    private reportExcepcionService: ReportExceptionService
  ) {}

  ngOnInit() {
    this.MUser = this.storageService.obtenerDatosMapeados();
  }

  onSubmit() {
    if (this.reportForm.invalid) return;

    let data = {
      report: this.reportForm.value.report,
      userEntityId: this.MUser.idUser,
    };
    this.reportExcepcionService.addReportException(data).subscribe(data=> {
      if (data.data) {
        Swal.fire({
          icon: 'success',
          title: 'Excepcion agregada correctamente',
          confirmButtonColor: '#0A6EBD',
        });
        this.dialogRef.close();

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error, los datos no se pudieron guardar',
          confirmButtonColor: '#0A6EBD',
        });
      }
    }) ;


  }

  onClose(): void {
    this.dialogRef.close();
  }

}
