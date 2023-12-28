import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { MMenu } from 'src/app/Models/MMenu';

@Component({
  selector: 'app-sublevel-menu',
  template: `
    <p>parrafos</p>
  `,
  styleUrls: ['./sidenav.component.css'],
  animations:[
    trigger('submenu', [
      state('hidden', style({ 
        height: '0',
        overflow: 'hidden'
      })),
      state('visible', style({ 
        height: '*'
      })),
      transition('visible <=> hidden', [style({overflow: 'hidden'}), 
        animate('{{transitionParams}}')]),
      transition('void => *', animate(0))
    ])
  ]
})
export class SublevelMenuComponent implements OnInit {

  @Input() data: MMenu = {
    idMenu: '' as unknown as Guid,
    nameMenu: '',
    path: '',
    icon: '',
    
  }


  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple = false;

  constructor(){}

  ngOnInit(): void {
  }

 

}
