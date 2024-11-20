import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { User } from 'src/app/model/user';
import { EducationalLevel } from 'src/app/model/educational-level';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { showToast } from 'src/app/tools/message-functions';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { checkboxOutline, checkmarkDoneCircleOutline, logOutOutline, thumbsUpOutline } from 'ionicons/icons';

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class MisdatosComponent implements OnInit {
  user: User = new User();
  educationalLevels: EducationalLevel[] = EducationalLevel.getLevels();

  constructor(
    private dbService: DatabaseService, 
    private authService: AuthService
  ) {addIcons({ checkboxOutline, logOutOutline, thumbsUpOutline, checkmarkDoneCircleOutline })}

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    try {
      const authUser = await this.authService.readAuthUser(); // Carga el usuario autenticado
      if (authUser) {
        const user = await this.dbService.readUser(authUser.userName);
        if (user) {
          this.user = user;
        } else {
          showToast('Usuario no encontrado en la base de datos.');
        }
      } else {
        showToast('No se encontró un usuario autenticado.');
      }
    } catch (error) {
      showToast('Error al cargar los datos del usuario.');
    }
  }

  async saveUser() {
    try {
      await this.dbService.saveUser(this.user);
      showToast('Usuario guardado correctamente');
    } catch (error) {
      showToast('Error al guardar el usuario.');
    }
  }

  updateEducationalLevel(event: any) {
    const selectedId = event.detail.value;
    const selectedLevel = EducationalLevel.findLevel(selectedId);
    if (selectedLevel) {
      this.user.educationalLevel = selectedLevel;
    }
  }

  onDateOfBirthChange(event: any) {
    this.user.dateOfBirth = new Date(event.detail.value);
  }
}
