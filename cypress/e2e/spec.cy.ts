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

    // Completa los campos de correo y contraseña
    cy.get('#correo').type('atorres'); // Selector del input del correo
    cy.get('#password').type('1234'); // Selector del input de la contraseña

    // Haz clic en el botón de login
    cy.get('.enter-button').click();

    // Verifica que se redirige a la página Home
    cy.url().should('include', '/home');

    // Verifica que el componente `welcome` esté cargado
    cy.get('app-welcome').should('exist');
  });

  /// <reference types="cypress" />

/// <reference types="cypress" />

/// <reference types="cypress" />

/// <reference types="cypress" />

/// <reference types="cypress" />

describe('Pruebas de Foro', () => {
  it('Debería permitir agregar una nueva publicación', () => {
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
    
  });

});


});
