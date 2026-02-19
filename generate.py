import requests

url = 'https://randomuser.me/api/?gender=male&nat=gb,fr,nl&inc=email,name,cell,location&results=1000'
response = requests.get(url)
json_data = response.json()

sql_file = open('./initdb/init.sql', 'w')

create_tables = """
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NULL,
  email TEXT NOT NULL UNIQUE,
  mobile TEXT NULL UNIQUE,
  city INTEGER,
  country INTEGER
);

CREATE INDEX users_id ON users (id);

CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE INDEX cities_id ON users (id);

CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE INDEX countries_id ON users (id);
\n"""

sql_file.write(create_tables)

cities = []
countries = []
unique_cities = []
unique_countries = []
for result in json_data['results']:
    cities.append(result['location']['city'])
    countries.append(result['location']['country'])
    unique_cities = list(dict.fromkeys(cities))
    unique_countries = list(dict.fromkeys(countries))

for city in unique_cities:
    s = ('INSERT INTO cities (name) VALUES '
        f'(\'{city}\')'
         ';\n')
    sql_file.write(s)

for country in unique_countries:
    s = ('INSERT INTO countries (name) VALUES '
        f'(\'{country}\')'
         ';\n')
    sql_file.write(s)

for result in json_data['results']:
    name = result['name']['first'] + ' ' + result['name']['last']
    city_id = unique_cities.index(result['location']['city'])
    country_id = unique_countries.index(result['location']['country'])
    s = ('INSERT INTO users (name, email, mobile, city, country) VALUES '
        f'(\'{name}\', \'{result["email"]}\', \'{result["cell"]}\', {city_id + 1}, {country_id + 1})'
         ';\n')
    sql_file.write(s)

sql_file.close()
print('SQL file created')
