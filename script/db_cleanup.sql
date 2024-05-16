-- Script for cleaning up database in preparation for upload. 
-- see: https://github.com/phiresky/sql.js-httpvfs for code used. 
-- The following command can be run within the SQL broswer app. 

-- Pragma statements control database behavior specifically in SQLite. 
-- journal_mode DELETE -> rollback journal is deleted at the conclusion of each transaction.
-- sets the page size, and appears to be optimal according to phiresky. 
-- See https://www.sqlite.org/pragma.html
-- Inserts a value into a table named ftstable to trigger optimization for Full-Text Search (FTS)
-- Reorganizes the database and applies the change in page_size. 
pragma journal_mode = delete; 
pragma page_size = 1024;

-- insert into kanji_table(ftstable) values ('optimize'); 
-- insert into kana_table(ftstable) values ('optimize'); 

vacuum; 