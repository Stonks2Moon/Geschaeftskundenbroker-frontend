Feature('handel');

Before(({ Ich }) => {
    Ich.bin_auf_seite('/');
    Ich.logge_mich_ein('test@hannes.de', 'test');
  });

Scenario('Ich teste die Handelsseite', ({ Ich }) => {
    Ich.klicke('Handel');
    Ich.sehe('AKTIENNAME');
    Ich.sehe('DETAILS');
    // pause();
  });
  
Scenario('Ich teste die Aktienseite', ({ Ich }) => {
    Ich.klicke('Handel');
    //details knopf von dogecoin
    Ich.klicke({xpath: '/html/body/app-root/app-trade/div/table/tbody/tr[1]/td[4]/button' });
    Ich.sehe('Statistik')
    // pause();
  });


Scenario('Ich teste kaufen von Aktien', ({ Ich }) => {
    Ich.klicke('Handel');
    //details knopf von dogecoin
    Ich.klicke({xpath: '/html/body/app-root/app-trade/div/table/tbody/tr[1]/td[4]/button' });
    Ich.sehe('Statistik')
    Ich.klicke('Aktien kaufen')
    Ich.sehe('Statistik')
    Ich.wähle_option('Depot', 'Test Depot 1')
    Ich.wähle_option('Order-Art*', 'Limit Preis')
    Ich.fülle_das_feld('Order-Preis', '100')
    Ich.wähle_option('Gültig bis', 'Morgen')
    Ich.wähle_option('Algorithmisches Handeln', 'Kein Algorithmus')
    Ich.fülle_das_feld('Anzahl der Aktien (in Stk.)', '2')
    //wert in aktien feld
    Ich.seeInField({xpath: '//*[@id="sharePrice"]'}, '200');
    Ich.klicke('Kaufen')
    Ich.sehe('Weiter?')
    Ich.sehe('Test Depot 1')
    Ich.sehe('200')
    Ich.klicke('Abbrechen')
    // pause();
  });  
  