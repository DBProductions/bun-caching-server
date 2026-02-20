import { SQL } from 'bun';
import type { User, PartialUser } from './types';

export const getOrCreateCity = async (db: any, cityName: string): Promise<number> => {
  const existing = await db`SELECT id FROM cities WHERE name = ${cityName}`;
  if (existing.length > 0) return existing[0].id;
  const result = await db`INSERT INTO cities (name) VALUES (${cityName}) RETURNING id`;
  return result[0].id;
}

export const getOrCreateCountry = async (db: any, countryName: string): Promise<number> => {
  const existing = await db`SELECT id FROM countries WHERE name = ${countryName}`;
  if (existing.length > 0) return existing[0].id;
  const result = await db`INSERT INTO countries (name) VALUES (${countryName}) RETURNING id`;
  return result[0].id;
}

export const entryExists = async (db: any, key: string, val: string): Promise<SQL> => {
  return db`SELECT 1 FROM users WHERE ${key} = ${val}`;
}

export const selectQuery = async (db: any, id: string): Promise<SQL> => {
  return db`
    SELECT u.id, u.name, u.email, ci.name AS city, co.name AS country
    FROM users u
    LEFT JOIN cities ci ON u.city = ci.id
    LEFT JOIN countries co ON u.country = co.id
    WHERE u.id=${id}`;
}

export const insertQuery = async (db: any, user: User): Promise<SQL> => {
  let cityId: number | undefined;
  let countryId: number | undefined;
  
  if (user.city) {
    cityId = await getOrCreateCity(db, user.city);
  }
  if (user.country) {
    countryId = await getOrCreateCountry(db, user.country);
  }
  
  return db`
    INSERT INTO users (name, email, mobile, city, country)
    VALUES (${user.name}, ${user.email}, ${user.mobile}, ${cityId}, ${countryId})
    RETURNING *
  `;
}

export const updateQuery = async (db: any, id: string, user: PartialUser) => {
  const fieldsToUpdate: [string, any][] = [];
  
  if (user.name !== undefined) fieldsToUpdate.push(['name', user.name]);
  if (user.email !== undefined) fieldsToUpdate.push(['email', user.email]);
  if (user.mobile !== undefined) fieldsToUpdate.push(['mobile', user.mobile]);
  
  if (user.city !== undefined) {
    const cityId = await getOrCreateCity(db, user.city);
    fieldsToUpdate.push(['city', cityId]);
  }
  if (user.country !== undefined) {
    const countryId = await getOrCreateCountry(db, user.country);
    fieldsToUpdate.push(['country', countryId]);
  }
  
  if (fieldsToUpdate.length === 0) {
    throw new Error("No valid fields to update");
  }
  const columns = fieldsToUpdate.map(([key]) => `"${key}"`);
  const values = fieldsToUpdate.map(([, value]) => value);
  values.push(id);
  const setClause = columns
    .map((col, i) => `${col} = $${i + 1}`)
    .join(', ');
  const query = `UPDATE users SET ${setClause} WHERE id = $${columns.length + 1} RETURNING *`;
  return db.unsafe(query, values);
}

export const replaceQuery = async (db: any, id: string, user: User): Promise<SQL> => {
  let cityId: number | undefined;
  let countryId: number | undefined;
  
  if (user.city) {
    cityId = await getOrCreateCity(db, user.city);
  }
  if (user.country) {
    countryId = await getOrCreateCountry(db, user.country);
  }
  
  return db`
    UPDATE users
    SET name=${user.name}, email=${user.email}, mobile=${user.mobile}, city=${cityId}, country=${countryId}
    WHERE id=${id}
    RETURNING *
  `;
}

export const deleteQuery = async (db: any, id: string): Promise<SQL> => {
  return db`
    DELETE FROM users
    WHERE id=${id}
    RETURNING *
  `;
}
