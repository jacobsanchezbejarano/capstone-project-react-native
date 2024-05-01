import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists little_lemon (id integer primary key not null, uuid text, title text, price text, category text);'
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
    const sql = `insert into little_lemon (uuid, title, price, category) values ${menuItems
      .map((item) =>
       `('${item.id}', '${item.title}', '${item.price}', '${item.category}')`)
        	.join(', ')}`;
    db.transaction(
        tx => {
            tx.executeSql(sql, []);
        },
        reject,
        resolve
    );
});
}

export async function filterByQueryAndCategories(query, activeCategories) {
  let search = '';
  if(query != '') {
    search = 'and title like "%'+query+'%"';
  }
  const active = `"${activeCategories.join('","')}"`;
  
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from little_lemon where category in ('+active+') '+search+'', [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}
