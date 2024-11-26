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
  isAdmin: boolean = false; // Indica si el usuario actual es administrador

  constructor(
      private db: DatabaseService
    , private auth: AuthService
    , private scanner: ScannerService
    , private cdr: ChangeDetectorRef) { }

  ionViewWillEnter() {
    /*
    this.changeComponent('qrwebscanner');
    */
    this.checkUserRole();
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
    try {
      const authenticatedUser = await this.auth.readAuthUser();
  
      if (authenticatedUser) {
        this.user = authenticatedUser; 
        this.isAdmin = this.user.userName === 'admin'; // Verifica si es admin
  
        // Establece el componente inicial basado en el rol
        this.selectedComponent = this.isAdmin ? 'usuarios' : 'qrwebscanner';
  
        console.log(`Usuario identificado: ${this.user.userName}, isAdmin: ${this.isAdmin}`);
      } else {
        console.error('No se encontró un usuario autenticado.');
        this.selectedComponent = 'welcome'; // Componente por defecto si no hay usuario
      }
  
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al verificar el usuario logueado:', error);
      this.selectedComponent = 'welcome'; // Fallback en caso de error
    }
  }
  
  footerClick(button: string) {
    if (this.isAdmin && ['qrwebscanner', 'dinosaur'].includes(button)) {
      console.warn('El administrador no tiene acceso a este componente.');
      return; // Bloquea el acceso
    }
    this.selectedComponent = button;
  }

  changeComponent(name: string) {
    this.selectedComponent = name;
    this.footer.selectedButton = name;
  }

}

/*
  async checkUserRole() {
    try {
      // Obtén el usuario autenticado desde AuthService
      const authenticatedUser = await this.auth.readAuthUser();
  
      if (authenticatedUser) {
        this.user = authenticatedUser; // Asigna el usuario logueado
  
        if (this.user.userName === 'admin') {
          this.selectedComponent = 'usuarios'; // Componente especial para admin
          console.log('Usuario administrador identificado.');
        } else {
          this.selectedComponent = 'qrwebscanner'; // Componente estándar para otros usuarios
          console.log('Usuario común identificado:', this.user.userName);
        }
      } else {
        console.error('No se encontró un usuario autenticado.');
        this.selectedComponent = 'qrwebscanner'; // Componente por defecto si no hay usuario
      }
  
      this.cdr.detectChanges(); // Actualiza la vista
    } catch (error) {
      console.error('Error al verificar el usuario logueado:', error);
      this.selectedComponent = 'qrwebscanner'; // Fallback en caso de error
    }
  }
    */