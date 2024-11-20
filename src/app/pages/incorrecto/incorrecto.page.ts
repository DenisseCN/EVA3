import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { checkboxOutline, colorWandOutline, fingerPrintOutline, keyOutline, logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IncorrectoPage implements OnInit {

  constructor(private router: Router) {
    addIcons({ keyOutline })
  }

  ngOnInit() {}

  navegarAIngreso() {
    this.router.navigate(['/login']);
  }


}
