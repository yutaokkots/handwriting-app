## Splits a database into chunks of specific sizes and creates a config file. 
#  see phirensky's repo: https://github.com/phiresky/sql.js-httpvfs/blob/master/create_db.sh

# % chmod +x script/database_splitter.sh 

# "e" <- script will exit immediately if any command fails
# "u" <- produce an error if an unset variable is referenced
set -eu

# source file
input_db="scripts/sqlite/data/master_ver3.db"
# destination path
output_dir="scripts/sqlite/data/master_ver3_chunked_db/"

bytes=$(wc -c < "$input_db")

# size of chunks, 10MB
chunk_size=$((10 * 1024 * 1024))

suffixLength=3

# creates dir at destination path
mkdir -p "$output_dir"

# splits the file into chunks of 'chunk_size'
#split -b "${chunk_size}" "$input_db" "$output_dir/chunk"
# split "$input_db" --bytes=$chunk_size "$output_dir/db.sqlite3." --suffix-length=$suffixLength --numeric-suffixes
split -b "${chunk_size}" -a "$suffixLength" "$input_db" "$output_dir/db.sqlite3."

requestChunkSize="$(sqlite3 "$input_db" 'pragma page_size')"

echo '
{
    "serverMode": "chunked",
    "requestChunkSize": '$requestChunkSize',
    "databaseLengthBytes": '$bytes',
    "serverChunkSize": '$chunk_size',
    "urlPrefix": "db.sqlite3.",
    "suffixLength": '$suffixLength'
}
' > "$output_dir/config.json"