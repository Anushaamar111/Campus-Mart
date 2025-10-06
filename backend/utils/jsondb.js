// Simple JSON database for development when MongoDB is unavailable
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../data');
const COLLECTIONS = {
  users: 'users.json',
  products: 'products.json',
  messages: 'messages.json',
  notifications: 'notifications.json'
};

class JsonDB {
  constructor() {
    this.ensureDataDir();
  }

  async ensureDataDir() {
    try {
      await fs.access(DB_PATH);
    } catch {
      await fs.mkdir(DB_PATH, { recursive: true });
      // Initialize empty collections
      for (const filename of Object.values(COLLECTIONS)) {
        const filePath = path.join(DB_PATH, filename);
        try {
          await fs.access(filePath);
        } catch {
          await fs.writeFile(filePath, JSON.stringify([]));
        }
      }
    }
  }

  async read(collection) {
    try {
      const filePath = path.join(DB_PATH, COLLECTIONS[collection]);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async write(collection, data) {
    try {
      const filePath = path.join(DB_PATH, COLLECTIONS[collection]);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('JsonDB write error:', error);
      return false;
    }
  }

  async insert(collection, document) {
    const data = await this.read(collection);
    const newDoc = {
      _id: this.generateId(),
      ...document,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    data.push(newDoc);
    await this.write(collection, data);
    return newDoc;
  }

  async findById(collection, id) {
    const data = await this.read(collection);
    return data.find(doc => doc._id === id);
  }

  async findOne(collection, query) {
    const data = await this.read(collection);
    return data.find(doc => this.matchQuery(doc, query));
  }

  async find(collection, query = {}) {
    const data = await this.read(collection);
    if (Object.keys(query).length === 0) return data;
    return data.filter(doc => this.matchQuery(doc, query));
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2);
  }

  matchQuery(document, query) {
    return Object.entries(query).every(([key, value]) => {
      return document[key] === value;
    });
  }
}

const jsonDB = new JsonDB();
export default jsonDB;