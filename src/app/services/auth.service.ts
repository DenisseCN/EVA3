import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { showAlertError, showToast } from 'src/app/tools/message-functions';
import { User } from '../model/user';
import { Storage } from '@ionic/storage-angular';
import { DatabaseService } from './database.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  storageAuthUserKey = 'AUTHENTICATED_USER';
  authUser = new BehaviorSubject<User | null>(null);
  isFirstLogin = new BehaviorSubject<boolean>(false);
  storageQrCodeKey = 'QR_CODE';
  qrCodeData = new BehaviorSubject<string | null>(null);

  constructor(
    private router: Router, 
    private db: DatabaseService, 
    private storage: Storage,
    private translate: TranslateService) { }

  async initializeAuthService() {
    try {
      await this.storage.create();
    } catch (error) {
      showAlertError('AuthService.initializeAuthService', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      return Boolean(await this.readAuthUser());
    } catch (error) {
      showAlertError('AuthService.isAuthenticated', error);
      return false;
    }
  }

  async readAuthUser(): Promise<User | null> {
    try {
      const user = (await this.storage.get(this.storageAuthUserKey)) as User | null;
      this.authUser.next(user ?? null);
      return user;
    } catch (error) {
      showAlertError('AuthService.readAuthUser', error);
      return null;
    }
  }

  async saveAuthUser(user: User): Promise<User | null> {
    try {
      await this.storage.set(this.storageAuthUserKey, user);
      this.authUser.next(user);
      return user;
    } catch (error) {
      showAlertError('AuthService.saveAuthUser', error);
      return null;
    }
  }

  async deleteAuthUser(): Promise<boolean> {
    try {
      await this.storage.remove(this.storageAuthUserKey);
      this.authUser.next(null);
      return true;
    } catch (error) {
      showAlertError('AuthService.deleteAuthUser', error);
      return false;
    }
  }

  async login(userName: string, password: string): Promise<boolean> {
    try {
      const authUser = await this.storage.get(this.storageAuthUserKey);

      if (authUser) {
        this.authUser.next(authUser);
        this.isFirstLogin.next(false);
        await this.router.navigate(['/home']);
        return true;
      } else {
        const user = await this.db.findUser(userName, password);

        if (user) {
          
          // Traduce el mensaje de bienvenida
          const welcomeMessage = await this.translate.get('AuthService.Welcome', {
            firstName: user.firstName,
            lastName: user.lastName
          }).toPromise();
          showToast(welcomeMessage);

          await this.saveAuthUser(user);
          this.isFirstLogin.next(true);
          await this.router.navigate(['/home']);
          return true;
        } else {
          // Traduce el mensaje de error
          const errorMessage = await this.translate.get('AuthService.Error.InvalidCredentials').toPromise();
          showToast(errorMessage);
          await this.router.navigate(['/login']);
          return false;
        }
      }
    } catch (error) {
      const errorAlert = await this.translate.get('AuthService.Error.General').toPromise();
      showAlertError('AuthService.login', errorAlert);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try {
      const user = await this.readAuthUser();

      if (user) {
        showToast(`¡Hasta pronto ${user.firstName} ${user.lastName}!`);
        await this.deleteAuthUser();
      }

      await this.router.navigate(['/login']);
      return true;
    } catch (error) {
      showAlertError('AuthService.logout', error);
      return false;
    }
  }

  



  rowToUser(arg0: any): User | PromiseLike<User | undefined> | undefined {
    throw new Error('Method not implemented.');
  }
  



  // async readQrFromStorage(): Promise<string | null> {
  //   try {
  //     const qrData = await this.storage.get(this.storageQrCodeKey) as string | null;
  //     this.qrCodeData.next(qrData);
  //     return qrData;
  //   } catch (error) {
  //     showAlertError('AuthService.readQrFromStorage', error);
  //     return null;
  //   }
  // }

  // async saveQrToStorage(qrData: string): Promise<string | null> {
  //   try {
  //     await this.storage.set(this.storageQrCodeKey, qrData);
  //     this.qrCodeData.next(qrData);
  //     return qrData;
  //   } catch (error) {
  //     showAlertError('AuthService.saveQrToStorage', error);
  //     return null;
  //   }
  // }

  // async deleteQrFromStorage(): Promise<boolean> {
  //   try {
  //     await this.storage.remove(this.storageQrCodeKey);
  //     this.qrCodeData.next(null);
  //     return true;
  //   } catch (error) {
  //     showAlertError('AuthService.deleteQrFromStorage', error);
  //     return false;
  //   }
  // }
}
