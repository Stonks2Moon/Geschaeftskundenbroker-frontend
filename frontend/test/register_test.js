Feature('register');

Scenario('Ich teste das Registrieren', ({ Ich }) => {
    // Ich.startMocking();

    Ich.bin_auf_seite('/');
    Ich.klicke('Registrierung');
    // Ich.fülle_das_feld('Vorname*', 'jojo@mail.com');
    // Ich.fülle_das_feld('Nachname*', 'jojo@mail.com');
    // Ich.fülle_das_feld('E-Mail*', 'jojo@mail.com');
    Ich.klicke('Bitte auswählen ...');
    Ich.warte(5);
    Ich.klicke('Finanzhaie Mannheim GmbH');
    Ich.warte(5);
    // Ich.fülle_das_feld('Passwort*', '1234');
    // Ich.fülle_das_feld('wdh. Passwort*', '1234');
    // Ich.klicke('Registrieren');  
// Ich.stopMocking();
});


