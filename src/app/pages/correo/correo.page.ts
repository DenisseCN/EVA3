import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service'; 
import { trigger, state, style, transition, animate } from '@angular/animations';
import { checkboxOutline, colorWandOutline, fingerPrintOutline, logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule ],
  animations: [
    trigger('fadeInAnimation', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CorreoPage implements OnInit {
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  public correo: string = '';

  // Inyección de dependencias
  private animationController = inject(AnimationController);
  private alertController = inject(AlertController);
  private router = inject(Router);
  private databaseService = inject(DatabaseService);
  private authService = inject(AuthService); 

  constructor() {
    addIcons({ checkboxOutline, logOutOutline })
  }

  ngOnInit() {}

  public async validateSecretQuestion(): Promise<void> {
    if (!this.correo) {
      this.showAlert('Campo vacío', 'Por favor ingresa un correo.');
      return;
    }

    try {
      // Buscar el usuario en la base de datos usando el correo
      const foundUser = await this.databaseService.findUserByEmail(this.correo);

      if (foundUser) {
        // Guardar el usuario autenticado en el AuthService
        this.authService.saveAuthUser(foundUser);

        // Redirigir a la página de pregunta
        this.router.navigate(['/pregunta']);
      } else {
        this.router.navigate(['/incorrecto']);
      }
    } catch (error) {
      console.error('Error al verificar el correo:', error);
      this.showAlert('Error del Sistema', 'Ocurrió un error al buscar el usuario. Intenta nuevamente más tarde.');
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  ngAfterViewInit() {}

  salirAlogin() {
    this.authService.deleteAuthUser();
    this.router.navigate(['/login']);
  }

  private animateTitle() {
    this.animationController
      .create()
      .addElement(this.itemTitulo.nativeElement)
      .iterations(Infinity)
      .duration(9000)
      .fromTo('transform', 'translateX(-50%)', 'translateX(100%)')
      .fromTo('opacity', 0.5, 1)
      .play();
  }
}
