Feature('login');

Before(({Ich}) => {
    Ich.bin_auf_seite('/');
});

Scenario('Ich teste das Einloggen', ({ Ich }) => {
    Ich.fülle_das_feld('E-Mail', 'jojo@mail.com');
    Ich.fülle_das_feld('Passwort', '1234');
    Ich.klicke('Anmelden');
    // pause();

});

Scenario('Ich teste das Einloggen', ({ Ich }) => {
    Ich.fülle_das_feld('E-Mail', 'jojo@mail.com');
    Ich.fülle_das_feld('Passwort', '12345');
    Ich.klicke('Anmelden');
    Ich.sehe('Anmeldung fehlgeschlagen!');
    // pause();
  
});

Scenario('Ich teste das Einloggen', ({ Ich }) => {
    Ich.fülle_das_feld('E-Mail', 'jojo@maila.com');
    Ich.fülle_das_feld('Passwort', '12345');
    Ich.klicke('Anmelden');
    Ich.sehe('Anmeldung fehlgeschlagen!');
    // pause();
});

