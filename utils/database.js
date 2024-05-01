import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists little_lemon (id integer primary key not null, name text, price text, description text, image text, category text);'
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from little_lemon', [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        menuItems.forEach(item => {
          tx.executeSql(
            'INSERT INTO little_lemon (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)',
            [item.name, item.price, item.description, item.image, item.category],
            (_, { rowsAffected }) => {
              if (rowsAffected > 0) {
                resolve();
              } else {
                reject(new Error('Failed to save menu item.'));
              }
            },
            error => {
              reject(error);
            }
          );
        });
      },
      error => {
        reject(error);
      }
    );
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  let search = '';
  if(query != '') {
    // search = 'and (name like "%'+query+'%" or description like "%'+query+'%")';
    search = 'and (name like "%'+query+'%")';
  }
  const active = `"${activeCategories.join('","')}"`;
  
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from little_lemon where category in ('+(active.toLowerCase())+') '+search+'', [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}
