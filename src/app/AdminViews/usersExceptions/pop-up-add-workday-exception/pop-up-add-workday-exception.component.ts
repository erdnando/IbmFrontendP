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
import { WorkdayExceptionService } from '../service/workdayExceptionService/workday-exception.service';

@Component({
  selector: 'app-pop-up-add-workday-exception',
  templateUrl: './pop-up-add-workday-exception.component.html',
  styleUrls: ['./pop-up-add-workday-exception.component.css']
})
export class PopUpAddWorkdayExceptionComponent {
  MUser: any;
  MListCountry: MCountryEntity[] = [];

  exceptionForm = new FormGroup({
    EmployeeCode: new FormControl('', [Validators.required]),
    EmployeeName: new FormControl('', [Validators.required]),
    CountryEntityId: new FormControl('', [Validators.required]),
    OriginalDate: new FormControl('', [Validators.required]),
    OriginalStartTime: new FormControl('', [Validators.required]),
    OriginalEndTime: new FormControl('', [Validators.required]),
    RealDate: new FormControl('', [Validators.required]),
    RealStartTime: new FormControl('', [Validators.required]),
    RealEndTime: new FormControl('', [Validators.required]),
    ReportType: new FormControl('', [Validators.required]),
    Justification: new FormControl('', [Validators.required]),
    ApprovingManager: new FormControl('', [Validators.required]),
  });
  
  constructor(
    public dialogRef: MatDialogRef<PopUpAddWorkdayExceptionComponent>, 
    private storageService: StorageService,
    private workdayExcepcionService: WorkdayExceptionService,
    private refresh: ObtenerlistaService,
  ) {}

  ngOnInit() {
    this.MUser = this.storageService.obtenerDatosMapeados();
    
    this.refresh.loadCountries().subscribe((countries) => {
      this.MListCountry = countries;

      /* const OptionSelectNew = countries;
      OptionSelectNew.push({
        idCounty: 'todoscoun-c9ac-4e43-a40a-000000000000',
        nameCountry: 'Todos'
      });

      this.MListCountry = OptionSelectNew; */
    });
  }

  onSubmit() {
    if (this.exceptionForm.invalid) return;

    let data = {
      EmployeeCode: this.exceptionForm.value.EmployeeCode,
      EmployeeName: this.exceptionForm.value.EmployeeName,
      CountryEntityId: this.exceptionForm.value.CountryEntityId,
      OriginalDate: this.exceptionForm.value.OriginalDate,
      OriginalStartTime: `${this.exceptionForm.value.OriginalStartTime}:00`,
      OriginalEndTime: `${this.exceptionForm.value.OriginalEndTime}:00`,
      RealDate: this.exceptionForm.value.RealDate,
      RealStartTime: `${this.exceptionForm.value.RealStartTime}:00`,
      RealEndTime: `${this.exceptionForm.value.RealEndTime}:00`,
      ReportType: this.exceptionForm.value.ReportType,
      Justification: this.exceptionForm.value.Justification,
      ApprovingManager: this.exceptionForm.value.ApprovingManager,
      UserEntityId: this.MUser.idUser,
    };
    this.workdayExcepcionService.addWorkdayException(data).subscribe(data=> {
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
