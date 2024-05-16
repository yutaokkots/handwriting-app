input_db="temp_data2.db"
output_directory="chunked_db"

# Chunk size
chunk_size=$((10 * 1024 * 1024))  # 10MB in bytes

mkdir -p "$output_dir"
split --bytes="$chunk_size" "$input_db" "$output_dir/chunk"