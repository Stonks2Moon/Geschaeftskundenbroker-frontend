Feature('login');

Before(({Ich}) => {
    Ich.bin_auf_seite('/');
});

Scenario('Ich teste das Einloggen', ({ Ich }) => {
    Ich.fülle_das_feld('E-Mail', 'test@hannes.de');
    Ich.fülle_das_feld('Passwort', 'test');
    Ich.klicke('Anmelden');
    Ich.sehe('Deine beliebtesten Aktien');
    pause();
});

Scenario('Ich teste das Einloggen mit falscher E-Mail', ({ Ich }) => {
    Ich.fülle_das_feld('E-Mail', 'test@hannes.de');
    Ich.fülle_das_feld('Passwort', '12345');
    Ich.klicke('Anmelden');
    Ich.sehe('Anmeldung fehlgeschlagen!');
    // pause(); 
});

Scenario('Ich teste das Einloggen mit flaschem Passwort', ({ Ich }) => {
    Ich.fülle_das_feld('E-Mail', 'test@hanne.de');
    Ich.fülle_das_feld('Passwort', 'test');
    Ich.klicke('Anmelden');
    Ich.sehe('Anmeldung fehlgeschlagen!');
    // pause();
});

