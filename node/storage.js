
// Dung map de luu data
const db = new Map();

export default {
  put(key, value) {
    db.set(key, value);
  },

  get(key) {
    return db.get(key) || null;
  },

  del(key) {
    return db.delete(key);
  },

  getAll() {
    return Object.fromEntries(db);
  }
};