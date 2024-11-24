import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DinosaurComponent } from 'src/app/components/dinosaur/dinosaur.component';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent } from '@ionic/angular/standalone'
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { QrWebScannerComponent } from 'src/app/components/qr-web-scanner/qr-web-scanner.component';
import { Dinosaur } from 'src/app/model/dinosaur';
import { Capacitor } from '@capacitor/core';
import { ScannerService } from 'src/app/services/scanner.service';
import { WelcomeComponent } from 'src/app/components/welcome/welcome.component';
import { ForumComponent } from 'src/app/components/forum/forum.component';
import { MisdatosComponent } from 'src/app/components/misdatos/misdatos.component';
import { UsuariosComponent } from 'src/app/components/usuarios/usuarios.component';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/model/user';
import { log } from 'src/app/tools/message-functions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
      CommonModule, FormsModule, TranslateModule, IonContent
    , HeaderComponent, FooterComponent
    , WelcomeComponent, QrWebScannerComponent, DinosaurComponent
    , ForumComponent, MisdatosComponent, UsuariosComponent
  ]
})
export class HomePage {
  
  @ViewChild(FooterComponent) footer!: FooterComponent;
  selectedComponent = 'welcome';

  user: User | undefined;

  constructor(
      private db: DatabaseService
    , private auth: AuthService
    , private scanner: ScannerService
    , private cdr: ChangeDetectorRef) { }

  ionViewWillEnter() {
    this.changeComponent('qrwebscanner');
  }

  async headerClick(button: string) {

    if (button === 'testqr')
      this.showDinoComponent(Dinosaur.jsonDinoExample);

    if (button === 'scan' && Capacitor.getPlatform() === 'web')
      this.selectedComponent = 'qrwebscanner';

    if (button === 'scan' && Capacitor.getPlatform() !== 'web')
        this.showDinoComponent(await this.scanner.scan());
  }

  webQrScanned(qr: string) {
    this.showDinoComponent(qr);
  }

  webQrStopped() {
    this.changeComponent('welcome');
  }

  showDinoComponent(qr: string) {

    if (Dinosaur.isValidDinosaurQrCode(qr)) {
      this.auth.qrCodeData.next(qr);
      this.changeComponent('dinosaur');
      return;
    }
    
    this.changeComponent('welcome');
  }
  // Verifica si el usuario es admin
  async checkUserRole() {
    this.user = await this.db.getLoggedInUser();

    if (this.user?.userName === 'admin') {
      debugger
      // Si es admin, mostramos el componente de usuarios
      this.selectedComponent = 'usuarios';
      console.log('ingresado como admin');
      console.log('Selected Component:', this.selectedComponent);
    } else {
      // Si no es admin, muestra el componente QR
      this.selectedComponent = 'qrwebscanner';
      console.log('ingresado como usuario común');
      console.log('Selected Component:', this.selectedComponent);
    }
  
    // Forzar la detección de cambios
    this.cdr.detectChanges();
  }

  footerClick(button: string) {
    this.selectedComponent = button;
  }

  changeComponent(name: string) {
    this.selectedComponent = name;
    this.footer.selectedButton = name;
  }

}