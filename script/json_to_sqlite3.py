''' 
Script for importing json file and loading into sqlite3 database.

Creates multiple tables with foreign keys.
'''

import sqlite3
import json

# File paths. Change here
open_path = 'src/data/tempData.json'
save_path = 'scripts/sqlite/data/temp_data2.db'

# Opens json file
with open(open_path, 'r') as file:
    json_file = json.load(file)

# Connects with a SQL database. Creates the file if it doesn't exist.
connection = sqlite3.connect(save_path)

# Creates a cursor object associated with the db connection object.
cursor = connection.cursor()

# Create a kanji table. 
cursor.execute('''CREATE TABLE IF NOT EXISTS kanji_table (
                id INTEGER PRIMARY KEY,
                kanji TEXT UNIQUE
                )''')

# Create a kana table. in this case, using fts (full-text search) as the search algorithm
#       for the text. Otherwise, a creating normal table looks like the following:
#           '''CREATE TABLE IF NOT EXISTS kana_table (. . . )'''

cursor.execute('''CREATE TABLE IF NOT EXISTS kana_table (
                id INTEGER PRIMARY KEY,
                kana TEXT,
                kanji_id INTEGER,
                FOREIGN KEY (kanji_id) REFERENCES kanji_table(id)
                )''')

# Loops through loaded json file and inserts into table
for kanji, kana_lst in json_file.items():
    cursor.execute("INSERT OR IGNORE INTO kanji_table(kanji) VALUES (?)", (kanji,))
    kanji_id = cursor.lastrowid #last-row-id (lastrowid) gets the id
    for kana in kana_lst:
        cursor.execute("INSERT INTO kana_table (kana, kanji_id) VALUES (?, ?)", (kana, kanji_id))

# commits the current transaction to the database. 
connection.commit()

# closes the connection to the db. 
connection.close()

print("completed")