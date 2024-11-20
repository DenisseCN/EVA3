import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { checkboxOutline, colorWandOutline, fingerPrintOutline, logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule ],
})
export class PreguntaPage implements OnInit {
  public user: any;  // Usuario cargado
  public respuesta: string = '';  // Respuesta ingresada por el usuario

  private authService = inject(AuthService);
  private toastController = inject(ToastController);
  private router = inject(Router);

  constructor() {
    addIcons({ checkboxOutline, logOutOutline })
  }

  async ngOnInit() {
    // Cargar el usuario desde `Storage` usando `AuthService`
    this.user = await this.authService.readAuthUser();
    if (!this.user) {
      this.showToast('Usuario no encontrado. Redirigiendo al inicio de sesión.');
      this.router.navigate(['/login']);
    }
  }


  salirAlogin() {
    this.authService.deleteAuthUser();
    this.router.navigate(['/login']);
  }

  public async validarRespuestaSecreta(): Promise<void> {
    if (this.user && this.user.secretAnswer.toLowerCase() === this.respuesta.toLowerCase()) {
      this.router.navigate(['/correcto']);
    } else {
      this.authService.deleteAuthUser();
      this.router.navigate(['/incorrecto']);
      
    }
  }

  
  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  

}
