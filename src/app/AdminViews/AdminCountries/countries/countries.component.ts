import { Component } from '@angular/core';
import { PopUpCountriesUpdateComponent } from '../pop-up-countries-update/pop-up-countries-update.component';
import { PopUpCountriesCreateComponent } from '../pop-up-countries-create/pop-up-countries-create.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from 'src/app/AdminViews/AdminClients/services/client/client.service';
import { MClientEntity } from 'src/app/Models/MClienteEntity';
import { map } from 'rxjs';
import { MCountryEntity } from 'src/app/Models/MCountryEntiry';
import { ListCountryService } from 'src/app/AdminViews/AdminCountries/services/list-country/list-country.service';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { MUserEntity } from 'src/app/Models/MUserEntity';
import { StorageService } from 'src/app/Service/storage-service/storage.service';

interface MiObjeto {
  [key: string]: any;
}

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
})
export class CountriesComponent {
  Datos = [{ nombre: 'Pais' }];

  columnasAMostrar = ['nombre'];

  columnas = [{ nombre: 'nombre', titulo: 'Nombre' }];

  MCountry: MCountryEntity[];
  MUser: MUserEntity;
  Approving: boolean = false;

  constructor(
    public dialog: MatDialog,
    private serviceLists: ObtenerlistaService,
    private storageService: StorageService
  ) {
    this.MCountry = [];
    this.MUser = this.storageService.obtenerDatosMapeados();
  }

  openDialog(id: string, nameClient: string) {
    this.dialog.open(PopUpCountriesUpdateComponent, {
      data: {
        // Aquí puedes agregar los datos que quieras enviar
        idCountry: id,
        nameCountry: nameClient,
      },
    });
  }

  crearUsuario() {
    this.dialog.open(PopUpCountriesCreateComponent);
  }

  ngOnInit(): void {this.validateRole();this.serviceLists.loadCountries().subscribe((countries) => {
      this.MCountry = countries;
      console.log(this.MCountry);
      console.log(typeof this.MCountry[0].idCounty + ' verificacion');
    });

    this.serviceLists.refreshCountries$.subscribe((lista) => {
      this.MCountry = lista;
    });
  }

  validateRole() {
    if (
      this.MUser.rolEntity.nameRole == 'Administrador' ||this.MUser.rolEntity.nameRole == 'Super Administrador') {
      this.Approving = true;
    }
  }
}
