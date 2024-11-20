import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { AnimationController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonicModule]
})
export class WelcomeComponent implements OnInit {

  @ViewChild('welcomeText', { read: ElementRef, static: true }) welcomeText!: ElementRef;
  user: User = new User();

  constructor(private auth: AuthService, private animationCtrl: AnimationController) { 
    this.auth.authUser.subscribe((user) => {
      console.log(user);
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnInit() {
    // Configura la animación una vez que el componente se inicialice
    this.playAnimation();
  }

  playAnimation() {
    const animation = this.animationCtrl
      .create()
      .addElement(this.welcomeText.nativeElement)
      .duration(9000) // Aumenta la duración para que se desplace más lento
      .iterations(Infinity)
      .fromTo('transform', 'translateX(-100%)', 'translateX(100%)')
      .fromTo('opacity', '1', '1'); // Mantiene la opacidad constante

    animation.play();
  }
}
