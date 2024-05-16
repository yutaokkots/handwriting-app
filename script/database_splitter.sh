# source file
input_db="scripts/sqlite/data/master_ver3.db"
# destination path
output_directory="scripts/sqlite/data//master_ver3_chunked_db/"

# size of chunks, 5MB
chunk_size=$((5 * 1024 * 1024))

# creates directory at destination path
mkdir -p "$output_directory"

# splits the file into chunks of 'chunk_size'
split -b "${chunk_size}" "$input_db" "$output_directory/chunk"
