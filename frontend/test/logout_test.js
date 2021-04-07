Feature('logout');

Before(({ Ich }) => {
  Ich.bin_auf_seite('/');
});

Scenario('Ich teste das Ausloggen', ({ Ich }) => {
  Ich.logge_mich_ein('test@hannes.de.', 'test');
  Ich.klicke('Abmelden');
  // pause();
});