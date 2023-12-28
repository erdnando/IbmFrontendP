import { Component } from '@angular/core';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent {

  idUsuario: string = "";

  onIdChange(value: any) {
    // Aquí puedes asignar el valor a la variable que desees
    this.idUsuario = value.target.value;

    console.log(this.idUsuario)
}



}
