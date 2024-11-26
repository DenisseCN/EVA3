import { TestBed } from '@angular/core/testing';
import { Dinosaur } from 'src/app/model/dinosaur';
import { EducationalLevel } from 'src/app/model/educational-level';
import { MisdatosComponent } from './misdatos.component';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'src/app/model/user';

// Mock Services
const mockDatabaseService = {
    readUser: jasmine.createSpy('readUser').and.returnValue(Promise.resolve(new User())),
    saveUser: jasmine.createSpy('saveUser').and.returnValue(Promise.resolve()),
};

const mockAuthService = {
    readAuthUser: jasmine.createSpy('readAuthUser').and.returnValue(Promise.resolve(new User())),
    saveAuthUser: jasmine.createSpy('saveAuthUser').and.returnValue(Promise.resolve()),
};

describe('MisdatosComponent', () => {
    let component: MisdatosComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MisdatosComponent, IonicModule.forRoot(), TranslateModule.forRoot()],
            providers: [
                { provide: DatabaseService, useValue: mockDatabaseService },
                { provide: AuthService, useValue: mockAuthService },
            ],
        }).compileComponents();

        const fixture = TestBed.createComponent(MisdatosComponent);
        component = fixture.componentInstance;
    });

    it('debe cargar los datos del usuario', async () => {
        await component.loadUserData();
        expect(mockAuthService.readAuthUser).toHaveBeenCalled();
        expect(mockDatabaseService.readUser).toHaveBeenCalled();
    });

    it('debe guardar los datos del usuario', async () => {
        await component.saveUser();
        expect(mockDatabaseService.saveUser).toHaveBeenCalledWith(component.user);
        expect(mockAuthService.saveAuthUser).toHaveBeenCalledWith(component.user);
    });

    describe('MisdatosComponent / Mi clase Tests', () => {
      it('debe crear una nueva clase con datos específicos', () => {
          const newDino = Dinosaur.getNewDinosaur(
              'Campus Central',
              'ASG123',
              '001A',
              'Programación',
              'Juan Pérez',
              '2023-10-15',
              1,
              3,
              '08:00',
              '10:00'
          );
          expect(newDino.nombreAsignatura).toBe('Programación');
          expect(newDino.bloqueInicio).toBe(1);
      });
  
      it('debe validar un código QR de clase válido', () => {
          const validQr = JSON.stringify({
              sede: 'Campus Central',
              idAsignatura: 'ASG123',
              seccion: '001A',
              nombreAsignatura: 'Programación',
              nombreProfesor: 'Juan Pérez',
              dia: '2023-10-15',
              bloqueInicio: 1,
              bloqueTermino: 3,
              horaInicio: '08:00',
              horaFin: '10:00'
          });
          expect(Dinosaur.isValidDinosaurQrCode(validQr)).toBeTrue();
      });
  
      it('debe rechazar un código QR inválido', () => {
          const invalidQr = '{"incompleto": "data"}';
          expect(Dinosaur.isValidDinosaurQrCode(invalidQr)).toBeFalse();
      });
  
      it('debe actualizar el nivel educativo correctamente', () => {
          const eduLevel = new EducationalLevel();
          eduLevel.setLevel(5, 'Superior Completa');
          expect(eduLevel.id).toBe(5);
          expect(eduLevel.name).toBe('Superior Completa');
      });
  
      it('debe encontrar el nivel educativo por ID', () => {
          const level = EducationalLevel.findLevel(3);
          expect(level?.name).toBe('Media Incompleta');
      });
  });
});
