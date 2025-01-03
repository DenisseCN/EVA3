import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { gridOutline, homeOutline, pawOutline, pencilOutline, qrCodeOutline, schoolOutline, peopleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
      CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , TranslateModule // CGV-Permite usar pipe 'translate'
    , IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon
  ]
})
export class FooterComponent {
  @Input() isAdmin = false; // Indicador del rol de administrador
  selectedButton = 'welcome'; // Botón seleccionado por defecto
  @Output() footerClick = new EventEmitter<string>();

  constructor() { 
    addIcons({qrCodeOutline,schoolOutline,pencilOutline,gridOutline,peopleOutline,homeOutline,pawOutline});
  }

  sendClickEvent($event: any) {
    this.footerClick.emit(this.selectedButton);
  }
}
