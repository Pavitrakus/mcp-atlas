"use strict";

// Resolve the built-in at runtime: Turbopack treats a static node:sqlite require
// inside external CommonJS packages as a URL external during page-data collection.
const nativeRequire = eval("require");
const { DatabaseSync } = nativeRequire("node:sqlite");

class AtlasSQLite {
  constructor(filename) {
    this.db = new DatabaseSync(filename);
  }

  exec(sql) {
    this.db.exec(sql);
    return this;
  }

  pragma(sql) {
    this.db.exec(`PRAGMA ${sql}`);
    return this;
  }

  prepare(sql) {
    const database = this.db;
    const statement = database.prepare(sql);
    return {
      run: (...params) => statement.run(...params),
      get: (...params) => statement.get(...params),
      all: (...params) => statement.all(...params),
      raw() {
        const arrayStatement = database.prepare(sql, { returnArrays: true });
        return {
          run: (...params) => arrayStatement.run(...params),
          get: (...params) => arrayStatement.get(...params),
          all: (...params) => arrayStatement.all(...params),
        };
      },
    };
  }

  transaction(callback) {
    const wrap = (mode) => (...args) => {
      this.db.exec(`BEGIN ${mode}`);
      try {
        const result = callback(...args);
        this.db.exec("COMMIT");
        return result;
      } catch (error) {
        this.db.exec("ROLLBACK");
        throw error;
      }
    };
    const deferred = wrap("DEFERRED");
    deferred.deferred = deferred;
    deferred.immediate = wrap("IMMEDIATE");
    deferred.exclusive = wrap("EXCLUSIVE");
    return deferred;
  }

  close() {
    this.db.close();
  }
}

module.exports = AtlasSQLite;
