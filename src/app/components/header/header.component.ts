import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { logOutOutline, qrCodeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common'; // Si necesitas saber la ruta actual

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
      CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule     // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule // CGV-Permite usar pipe 'translate'
  ]
})
export class HeaderComponent implements OnInit {

  MostrarBotonEscaneo: boolean = false;
  
  @Output() headerClick = new EventEmitter<string>();

  constructor(private location: Location, private navCtrl: NavController, private authService: AuthService) { 
    addIcons({ logOutOutline, qrCodeOutline });
  }

  sendClickEvent(buttonName: string) {
    this.headerClick.emit(buttonName);
  }

  ngOnInit() {
    if (this.location.path() === '/home') {
      this.MostrarBotonEscaneo = true;
    } else {
      this.MostrarBotonEscaneo = false;
    }
  }

  async logout() {
    await this.authService.deleteAuthUser();
    this.authService.logout();
  }

}
