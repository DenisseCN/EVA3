import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router'; // Asegúrate de importar Router
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { checkboxOutline, colorWandOutline, fingerPrintOutline, logOutOutline, thumbsUpOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule ],
})
export class CorrectoPage implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router 
  ) {addIcons({ checkboxOutline, logOutOutline, thumbsUpOutline })}

  ngOnInit() {
    this.authService.readAuthUser().then((user: User | null) => {
      this.user = user || null;
    });
  }

  async salirAlogin() {
    await this.authService.deleteAuthUser();
    this.router.navigate(['/login']); // Usa this.router.navigate para navegar
  }
}
