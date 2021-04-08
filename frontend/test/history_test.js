Feature('history');

Before(({ Ich }) => {
  Ich.bin_auf_seite('/');
  Ich.logge_mich_ein('test@hannes.de', 'test');
});

Scenario('Ich teste die Historie', ({ Ich }) => {
  Ich.klicke('Historie');
  Ich.sehe('OFFENE TRANSAKTIONEN');
  Ich.sehe('ORDER-PREIS');
  Ich.sehe('GÜLTIG BIS');
  Ich.klicke('Ausgeführt');
  Ich.sehe('DATUM');
  Ich.sehe('ORDERNUMMER');
  Ich.klicke('Abgelaufen');
  Ich.sehe('DATUM');
  Ich.sehe('ORDERNUMMER');
  // pause();
});
