/// <reference types="cypress" />

describe('Pruebas de Login', () => {
  it('Debería permanecer en la página de login con credenciales inválidas', () => {
    // Visita la página de login
    cy.visit('http://localhost:8100/login');

    // Completa los campos de correo y contraseña con datos incorrectos
    cy.get('#correo').type('usuario_invalido'); // Selector del input del correo
    cy.get('#password').type('password_invalido'); // Selector del input de la contraseña

    // Haz clic en el botón de login
    cy.get('.enter-button').click();

    // Verifica que permanece en la página de login
    cy.url().should('include', '/login');

    // Verifica que se muestra un mensaje de error
    cy.get('.error-message').should('exist').and('contain', 'Credenciales incorrectas');
  });

  it('Debería permitir el login con credenciales válidas y redirigir al componente welcome', () => {
    // Visita la página de login
    cy.visit('http://localhost:8100/login'); // Cambia la URL según sea necesario
  
    // Haz clic en el botón de login directamente, ya que los campos están prellenados
    cy.get('.enter-button').click();
  
    // Verifica que se redirige a la página Home
    cy.url().should('include', '/home');
  
    // Verifica que el componente `welcome` esté cargado
    cy.get('app-welcome').should('exist');
  });
  
});

describe('Pruebas de Foro', () => {
  it('Debería permitir agregar y eliminar una nueva publicación', () => {
    // Visita la página principal
    cy.visit('http://localhost:8100/home'); // Navega a la página principal

    // Selecciona el segmento del foro
    cy.get('ion-segment-button[value="forum"]')
      .should('be.visible')
      .click();
    
    // Verifica que el contenido del foro esté listo
    cy.get('ion-card-content', { timeout: 10000 })
      .should('be.visible');
    
    // Completa los datos
    cy.get('ion-input[placeholder="Ingresa el título"]').type('Título de Prueba');
    cy.get('ion-textarea[placeholder="Escribe el contenido"]').type('Contenido de Prueba');
    
    // Haz clic en el botón para guardar
    cy.get('ion-button').contains('Guardar').click();

    // Verifica que la publicación aparece en la lista
    cy.get('ion-card')
      .should('contain', 'Título de Prueba')
      .and('contain', 'Contenido de Prueba');

    // Pausa explícita para visualizar la publicación creada
    cy.wait(2000);

    // Elimina la publicación creada
    cy.get('ion-card')
      .contains('Título de Prueba') // Encuentra el texto en el card
      .parents('ion-card') // Sube al nivel del contenedor ion-card
      .within(() => {
        cy.get('ion-fab-button[color="danger"]').click(); // Haz clic en el botón de eliminar
      });

    // Verifica que la publicación ha sido eliminada
    cy.get('ion-card')
      .should('not.contain', 'Título de Prueba')
      .and('not.contain', 'Contenido de Prueba');
  });
});

/// <reference types="cypress" />

describe('Pruebas de Mis Datos', () => {
  it('Debería validar todos los campos como requeridos', () => {
    // Visita la página principal y navega a "Mis Datos"
    cy.visit('http://localhost:8100/home');
    cy.get('ion-segment-button[value="misdatos"]').click();

    // Intenta guardar sin llenar campos
    cy.get('ion-button').contains('Guardar').click();

    // Verifica que aparecen mensajes de error en los campos requeridos
    cy.get('ion-input[placeholder="Usuario"]').should('have.attr', 'required');
    cy.get('ion-input[placeholder="Correo"]').should('have.attr', 'required');
    cy.get('ion-input[placeholder="Contraseña"]').should('have.attr', 'required');
    cy.get('ion-input[placeholder="Pregunta secreta"]').should('have.attr', 'required');
    cy.get('ion-input[placeholder="Respuesta secreta"]').should('have.attr', 'required');
    cy.get('ion-input[placeholder="Nombre"]').should('have.attr', 'required');
    cy.get('ion-input[placeholder="Apellido"]').should('have.attr', 'required');
    cy.get('ion-input[placeholder="Dirección"]').should('have.attr', 'required');
  });

  it('Debería validar que el correo sea un email válido', () => {
    // Visita la página de "Mis Datos"
    cy.visit('http://localhost:8100/home');
    cy.get('ion-segment-button[value="misdatos"]').click();

    // Ingresa un correo inválido
    cy.get('ion-input[placeholder="Correo"]').type('correo_invalido');

    // Intenta guardar
    cy.get('ion-button').contains('Guardar').click();

    // Verifica que aparece un mensaje de error
    cy.get('.error-message').should('contain', 'Correo no válido');
  });

  it('Debería validar que la fecha de nacimiento sea válida', () => {
    // Visita la página de "Mis Datos"
    cy.visit('http://localhost:8100/home');
    cy.get('ion-segment-button[value="misdatos"]').click();

    // Ingresa una fecha inválida
    cy.get('ion-input[type="date"]').type('2025-01-01'); // Fecha futura

    // Intenta guardar
    cy.get('ion-button').contains('Guardar').click();

    // Verifica que aparece un mensaje de error
    cy.get('.error-message').should('contain', 'Fecha no válida');
  });

  it('Debería guardar los datos correctamente', () => {
    // Visita la página de "Mis Datos"
    cy.visit('http://localhost:8100/home');
    cy.get('ion-segment-button[value="misdatos"]').click();

    // Completa todos los campos
    cy.get('ion-input[placeholder="Usuario"]').type('mi_usuario');
    cy.get('ion-input[placeholder="Correo"]').type('mi_correo@correo.com');
    cy.get('ion-input[placeholder="Contraseña"]').type('123456');
    cy.get('ion-input[placeholder="Pregunta secreta"]').type('¿Color favorito?');
    cy.get('ion-input[placeholder="Respuesta secreta"]').type('Azul');
    cy.get('ion-input[placeholder="Nombre"]').type('Juan');
    cy.get('ion-input[placeholder="Apellido"]').type('Pérez');
    cy.get('ion-input[type="date"]').type('2000-01-01');
    cy.get('ion-input[placeholder="Dirección"]').type('Calle Falsa 123');

    // Selecciona un nivel educativo
    cy.get('ion-select').click();
    cy.get('ion-select-option').contains('Universitario').click();

    // Haz clic en guardar
    cy.get('ion-button').contains('Guardar').click();

    // Verifica que los datos han sido guardados (puedes verificar un mensaje de éxito o una redirección)
    cy.get('.success-message').should('contain', 'Datos guardados correctamente');
  });
});
