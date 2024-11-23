import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonAvatar, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { User } from 'src/app/model/user';
import { EducationalLevel } from 'src/app/model/educational-level';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { log } from 'src/app/tools/message-functions';
import { DatabaseService } from 'src/app/services/database.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrarme',
  templateUrl: './registrarme.page.html',
  styleUrls: ['./registrarme.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonTitle
    , IonItem, IonInput, IonLabel, IonSelect, IonSelectOption
    , IonAvatar, IonImg, IonButton, IonGrid, IonRow, IonCol
    , CommonModule, FormsModule
    , HeaderComponent, FooterComponent
    , TranslateModule, MatDatepickerModule, MatInputModule
    , MatNativeDateModule]
})
export class RegistrarmePage implements OnInit {

  user: User = new User();
  confirmarPassword: string = ''; // Campo adicional para confirmar contraseña
  educationalLevels: EducationalLevel[] = EducationalLevel.getLevels();
  dateOfBirth: any;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private db: DatabaseService
  ) { }

  ngOnInit() { }

  async Registrar(): Promise<void> {
    try {
      // Validar campos
      if (!this.validarCampos()) return;

      // Validar que el usuario no exista previamente
      const usuarioExistente = await this.db.findUserByUserName(this.user.userName);
      if (usuarioExistente) {
        await this.mostrarMensaje('Error', 'La cuenta ya está registrada. Por favor, usa otro nombre de usuario.');
        return;
      }

      // Guardar el nuevo usuario
      await this.db.saveUser(this.user);

      // Confirmar éxito al usuario
      await this.mostrarMensaje('Éxito', '¡Usuario registrado con éxito!');

      // Limpiar el formulario
      this.limpiar();
    } catch (error) {
      // Manejo de errores
      console.error('Error en Registrar():', error);
      await this.mostrarMensaje('Error', 'Ocurrió un problema al registrar el usuario. Por favor, inténtalo de nuevo más tarde.');
    }
  }

  private validarCampos(): boolean {
    // Validar campos vacíos
    if (!this.user.userName || !this.user.firstName || !this.user.email || !this.user.password || !this.confirmarPassword) {
      this.mostrarMensaje('Error', 'Por favor, completa todos los campos.');
      return false;
    }

    // Validar nombre solo con letras y espacios
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nombreRegex.test(this.user.firstName)) {
      this.mostrarMensaje('Error', 'El nombre solo puede contener letras y espacios.');
      return false;
    }

    // Validar longitud mínima de la contraseña
    if (this.user.password.length < 4) {
      this.mostrarMensaje('Error', 'La contraseña debe tener al menos 8 caracteres.');
      return false;
    }

    // Validar coincidencia de contraseñas
    if (this.user.password !== this.confirmarPassword) {
      this.mostrarMensaje('Error', 'Las contraseñas no coinciden.');
      return false;
    }

    return true;
  }

  public limpiar(): void {
    this.user.userName = '';
    this.user.firstName = '';
    this.user.lastName = '';
    this.user.email = '';
    this.user.secretQuestion = '';
    this.user.secretAnswer = '';
    this.user.password = '';
    this.confirmarPassword = ''; // Limpiar confirmación de contraseña
    this.user.educationalLevel = EducationalLevel.findLevel(1)!;
    this.user.dateOfBirth = new Date(0); // Fecha por defecto (epoch: 1970-01-01)
    this.user.address = '';
    this.user.image = '';
    log('RegistrarmePage', 'Formulario limpiado con valores iniciales.');
  }

  // Método para mostrar mensajes al usuario
  private async mostrarMensaje(titulo: string, mensaje: string): Promise<void> {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  /*
  // Método para mostrar el menú de selección
  public async mostrarOpcionesDeImagen() {
    const alert = await this.alertController.create({
      header: 'Seleccionar Imagen',
      buttons: [
        {
          text: 'Usar cámara',
          handler: () => {
            this.seleccionarImagenDesdeCamara();
          }
        },
        {
          text: 'Seleccionar desde galería',
          handler: () => {
            this.seleccionarImagenDesdeGaleria();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  // Método para seleccionar imagen desde la cámara
  private async seleccionarImagenDesdeCamara() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        source: CameraSource.Camera,  // Usamos la cámara
        resultType: CameraResultType.Uri
      });

      this.user.imagen = image.webPath!;
      console.log('Imagen tomada con la cámara:', image.webPath);
    } catch (error) {
      console.error('Error al tomar foto con la cámara:', error);
      await this.mostrarMensaje('Error', 'No se pudo tomar la foto. Por favor, inténtalo nuevamente.');
    }
  }

  // Método para seleccionar imagen desde la galería
  private async seleccionarImagenDesdeGaleria() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        source: CameraSource.Photos,  // Usamos solo la galería
        resultType: CameraResultType.Uri
      });

      this.user.imagen = image.webPath!;
      console.log('Imagen seleccionada de la galería:', image.webPath);
    } catch (error) {
      console.error('Error al seleccionar imagen desde la galería:', error);
      await this.mostrarMensaje('Error', 'No se pudo seleccionar la imagen. Por favor, inténtalo nuevamente.');
    }
  }
  */

  Ingreso() {
    this.router.navigate(['/login']);
  }
}
