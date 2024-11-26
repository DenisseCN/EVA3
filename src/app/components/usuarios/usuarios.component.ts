import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';
import { IonList, IonHeader, IonToolbar, IonTitle, IonItem
  , IonLabel, IonButton, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule, IonButton, IonLabel, IonItem, IonList
    , IonContent, IonTitle, IonToolbar, IonHeader
  ]
})
export class UsuariosComponent implements OnInit{

  user: User[] = [];
  isAdmin: boolean = false;

  constructor(private db: DatabaseService) {}

  ngOnInit() {
    this.loadUsers();
    this.checkIfAdmin();
  }

  async loadUsers() {
    this.user = await this.db.readUsers();
  }

  // Verificar si el usuario logueado es el admin
  async checkIfAdmin() {
    const authenticatedUser = await this.db.getLoggedInUser();
    if (authenticatedUser && authenticatedUser.userName === 'admin') {
      this.isAdmin = true; // Marcar que es admin
    }
  }

  // Eliminar un usuario (excepto el admin)
  async deleteUser(userName: string) {
    if (userName !== 'admin') {  // Evita eliminar al admin
      await this.db.deleteByUserName(userName); // Método para eliminar un usuario
      this.loadUsers(); // Recargar la lista de usuarios después de eliminar
    } else {
      alert('No puedes eliminar al usuario administrador.');
    }
  }
}
