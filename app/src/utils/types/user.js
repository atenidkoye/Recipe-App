export default class User {
  static NOT_GUEST = false;
  static GUEST = true;

  isGuest;
  id;
  name;
  email;
  token;

  constructor(isGuest = User.GUEST, id = 0, name = "Guest", email = "", token = "") {
    this.isGuest = isGuest;
    this.id = id;
    this.name = name;
    this.email = email;
    this.token = token;
  }
}