Feature('register');


Before(({Ich}) => {
    Ich.bin_auf_seite('/');
});

Scenario('Ich teste das Registrieren', ({ Ich }) => {
     

    Ich.klicke('Registrierung');
    Ich.fülle_das_feld('Vorname*', 'jojo@mail.com');
    Ich.fülle_das_feld('Nachname*', 'jojo@mail.com');
    Ich.fülle_das_feld('E-Mail*', 'jojo@mail.com');
    Ich.klicke({xpath: '//*[@id="companyCode"]'});
    // Ich.warte(5);
    // Ich.klicke('Finanzhaie Mannheim GmbH');
    // Ich.warte(5);
    Ich.fülle_das_feld('Passwort*', '1234');
    Ich.fülle_das_feld('wdh. Passwort*', '1234');
    // Ich.startMocking();
    Ich.klicke('Registrieren');  
    // Ich.stopMocking();
    pause();


});


