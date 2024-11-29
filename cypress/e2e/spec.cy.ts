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

describe('Pruebas del Componente Mis Datos', () => {
  it('Debería permitir modificar el correo agregando texto al inicio', () => {
    // Navega a la página principal (Mis Datos)
    cy.visit('http://localhost:8100/home');

    // Selecciona el segmento "Mis Datos" en el footer
    cy.get('ion-segment-button[value="misdatos"]')
      .should('be.visible')
      .click();

    // Verifica que el contenido de "Mis Datos" esté visible
    cy.get('ion-input[label="Correo"] input', { timeout: 10000 })
      .should('be.visible');

    // Selecciona el campo de correo y agrega texto al inicio
    cy.get('ion-input[label="Correo"] input')
      .click({ force: true }) // Asegura que el campo esté enfocado
      .type('{movetostart}nuevo', { force: true }); // Agrega texto al inicio del correo existente

    // Haz clic en el botón para guardar
    cy.get('ion-button').contains('Guardar').click();

  });
});