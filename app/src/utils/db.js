import * as SQLite from 'expo-sqlite';

export const init = async () => {
  const db=await SQLite.openDatabaseAsync('user.db');
  await db.execAsync('PRAGMA journal_mode = WAL;create table if not exists user(\
    id integer not null primary key,\
    name text not null,\
    email text not null,\
    token text not null\
  );');
  return db;
}

export const getUserData = async () => {
  const db = await init();
  const user = await db.getAllAsync("SELECT * FROM user LIMIT 1");
  await db.closeAsync();
  return user[0];
}

export const setUserData = async (user) => {
  const db = await init();
  await db.runAsync("DELETE FROM user");
  await db.runAsync("INSERT INTO user (id, name, email, token) VALUES ($id, $name, $email, $token)", 
    {$id: user.id, $name: user.name, $email: user.email, $token: user.token}
  );
  await db.closeAsync();
}

export const deleteUserData = async () => {
  const db = await init();
  await db.runAsync("DELETE FROM user");
  await db.closeAsync();
}