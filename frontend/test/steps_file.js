// in this file you can append custom step methods to 'I' object

module.exports = function() {
  return actor({
    logge_mich_ein: function(email, password) {
      this.bin_auf_seite('/');
      this.fülle_das_feld('E-Mail', email);
      this.fülle_das_feld('Passwort', password);
      this.klicke('Anmelden');
    },
  });
}
