Feature('login');

Scenario('Ich teste das Einloggen', ({ Ich }) => {
    Ich.bin_auf_seite('/');
    Ich.fülle_das_feld('E-Mail', 'jojo@mail.com');
    Ich.fülle_das_feld('Passwort', '1234');
    Ich.klicke('Anmelden');
});


