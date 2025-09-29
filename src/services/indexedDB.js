/**
 * IndexedDB service for managing user data and interview sessions
 */
const DB_NAME = 'AIInterviewDB';
const DB_VERSION = 1;
const USERS_STORE = 'users';
const SESSIONS_STORE = 'sessions';

class IndexedDBService {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(new Error('Failed to open database'));

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(USERS_STORE)) {
          const usersStore = db.createObjectStore(USERS_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          usersStore.createIndex('email', 'email', { unique: true });
          usersStore.createIndex('role', 'role', { unique: false });
        }

        if (!db.objectStoreNames.contains(SESSIONS_STORE)) {
          const sessionsStore = db.createObjectStore(SESSIONS_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          sessionsStore.createIndex('userId', 'userId', { unique: false });
          sessionsStore.createIndex('sessionId', 'sessionId', { unique: true });
        }
      };
    });
  }

  // ✅ Check if email already exists
  async emailExists(email) {
    if (!this.db) await this.init();
    const user = await this.getUserByEmail(email);
    return !!user;
  }

  // ✅ Create new user safely
  async createUser(userData) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);

      // Remove id if present (IndexedDB generates it)
      const { id, ...userDataWithoutId } = userData;

      const user = {
        ...userDataWithoutId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        profileComplete: !!userData.profileComplete,
        lastLogin: null,
      };

      const request = store.add(user);

      request.onsuccess = (event) => {
        resolve({ ...user, id: event.target.result });
      };

      request.onerror = (event) => {
        if (event.target.error.name === 'ConstraintError') {
          reject(new Error('Email already exists'));
        } else {
          reject(new Error('Failed to create user'));
        }
      };
    });
  }

  async getUserByEmail(email) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE], 'readonly');
      const store = transaction.objectStore(USERS_STORE);
      const index = store.index('email');

      const request = index.get(email);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error('Failed to get user'));
    });
  }

  // ✅ NEW: Get user by ID
  async getUserById(userId) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE], 'readonly');
      const store = transaction.objectStore(USERS_STORE);
      const request = store.get(userId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error('Failed to get user by ID'));
    });
  }

  async updateUser(userId, updates) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);

      const getRequest = store.get(userId);

      getRequest.onsuccess = () => {
        const existingUser = getRequest.result;
        if (!existingUser) return reject(new Error('User not found'));

        const updatedUser = {
          ...existingUser,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        const putRequest = store.put(updatedUser);

        putRequest.onsuccess = () => resolve(updatedUser);
        putRequest.onerror = () => reject(new Error('Failed to update user'));
      };

      getRequest.onerror = () => reject(new Error('Failed to get user for update'));
    });
  }

  async authenticateUser(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) throw new Error('User not found');
    if (user.password !== password) throw new Error('Invalid password');

    await this.updateUser(user.id, { lastLogin: new Date().toISOString() });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([USERS_STORE], 'readonly');
      const store = transaction.objectStore(USERS_STORE);

      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result.map(({ password, ...u }) => u));
      };

      request.onerror = () => reject(new Error('Failed to get users'));
    });
  }
}

const indexedDBService = new IndexedDBService();
export default indexedDBService;
