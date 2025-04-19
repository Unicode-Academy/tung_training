import * as bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;
export default class Hash {
  static make(password: string) {
    return bcrypt.hashSync(password, SALT_ROUNDS);
  }
  static compare(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}
