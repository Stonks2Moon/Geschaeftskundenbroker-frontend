Feature('history');

Before(({ Ich }) => {
  Ich.bin_auf_seite('/');
  Ich.logge_mich_ein('test@hannes.de', 'test');
});

Scenario('Ich teste die Historie', ({ Ich }) => {
  Ich.klicke('Historie');
  Ich.sehe('Offene Transaktionen');
  Ich.sehe('Order-Preis');
  Ich.sehe('Gültig bis');
  // pause();
});
