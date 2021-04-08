Feature('register');


Before(({ Ich }) => {
    Ich.bin_auf_seite('/');
});

Scenario('Ich teste das Registrieren', ({ Ich }) => {
    Ich.klicke('Registrierung');
    Ich.fülle_das_feld('Vorname*', 'jojo@mail.com');
    Ich.fülle_das_feld('Nachname*', 'jojo@mail.com');
    Ich.fülle_das_feld('E-Mail*', 'jojo@mail.com');
    Ich.fülle_das_feld('Passwort*', '1234');
    Ich.fülle_das_feld('wdh. Passwort*', '1234');
    Ich.wähle_option('Unternehmen*', 'Finanzhaie Mannheim GmbH');
    // Ich.startMocking();
    // Ich.klicke('Registrieren');  
    // Ich.stopMocking();
   
});
// er kann die Passwörter nicht sehen 
// Scenario('Ich teste die Passwörter', ({ Ich }) => {
//     Ich.klicke('Registrierung');
//     Ich.fülle_das_feld('Passwort*', '1234');
//     Ich.fülle_das_feld('wdh. Passwort*', 'test');
//     Ich.sehe_nicht('1234');
//     Ich.sehe_nicht('test');
//     //Schloss Icon
//     Ich.klicke({ xpath: '/html/body/app-root/app-register/div/div/div[2]/form/div[5]/div/div/a' });
//     pause();
//     Ich.sehe('1234');
//     Ich.sehe('test');
//     //Schloss Icon
//     Ich.klicke({ xpath: '/html/body/app-root/app-register/div/div/div[2]/form/div[5]/div/div/a' });
//     Ich.sehe_nicht('1234');
//     Ich.sehe_nicht('test');
// });
