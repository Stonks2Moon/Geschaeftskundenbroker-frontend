Feature('profil');

Before(({ Ich }) => {
  Ich.bin_auf_seite('/');
  Ich.logge_mich_ein('test@hannes.de', 'test');
});

Scenario('Ich teste das Profil', ({ Ich }) => {
  Ich.klicke('Profil');
  Ich.sehe('Test');
  //Ich.sehe('Nachname');
  Ich.sehe('Unternehmen des Nutzers');
  Ich.sehe('Finanzhaie Mannheim GmbH');
  // pause();
});
