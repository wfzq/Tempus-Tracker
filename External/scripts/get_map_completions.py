import json
import requests
import datetime
import os
import shutil
from concurrent.futures import ThreadPoolExecutor, as_completed

def read_names_from_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return [entry['name'] for entry in data]

def make_api_call(name):
    url = f"https://tempus2.xyz/api/v0/maps/name/{name}/zones/typeindex/map/1/records/player/0/3"
    response = requests.get(url)
    if response.status_code == 200:
        try:
            data = response.json()
            completion_info = data.get('completion_info', {})
            completion_info['last_updated'] = datetime.datetime.now().isoformat()

            return {
                "name": name,
                "completion_info": completion_info
            }
        except Exception as e:
            print(f"An error occurred: {e}")
    else:
        print(f"Failed to fetch data for {name}. Status code: {response.status_code}")
    return None

def make_backup(output_file_path):
    if os.path.exists(output_file_path):
        directory, filename = os.path.split(output_file_path)
        filename_without_ext, ext = os.path.splitext(filename)

        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file_path = os.path.join(directory, f"{filename_without_ext}_{timestamp}.json")
        
        shutil.copyfile(output_file_path, backup_file_path)
        return backup_file_path
    return None

def append_to_json(output_file_path, data):
    try:
        with open(output_file_path, 'r') as file:
            try:
                existing_data = json.load(file)
            except json.JSONDecodeError:
                existing_data = []
        
        name = data.get('name')
        found = False
        
        for entry in existing_data:
            if entry.get('name') == name:
                # Merge entry with new_data
                entry.update(data)
                found = True
                break
        
        # If no matching entry was found, append the new data
        if not found:
            existing_data.append(data)
        
        with open(output_file_path, 'w') as file:
            json.dump(existing_data, file, indent=4)
    
    except FileNotFoundError:
        with open(output_file_path, 'w') as file:
            json.dump([data], file, indent=4)

def process_batches_and_save(names, output_file_path, batch_size=8):
    # Create a backup before starting the process
    backup_file_path = make_backup(output_file_path)
    if backup_file_path:
        print(f"Backup created at: {backup_file_path}")
    else: 
        print(f"Unable to make backup, shutting down")
        os._exit(os.EX_OK)

    with ThreadPoolExecutor(max_workers=batch_size) as executor:
        for i in range(0, len(names), batch_size):
            batch = names[i:i+batch_size]
            futures = [executor.submit(make_api_call, name) for name in batch]
            for future in as_completed(futures):
                try:
                    result = future.result()
                    if result:
                        append_to_json(output_file_path, result)
                except Exception as e:
                    print(f"An error occurred: {e}")

def main(input_file_path, output_file_path):
    names = read_names_from_json(input_file_path)
    process_batches_and_save(names, output_file_path)

input_file_path = 'src/data/maps_db/maps_merged.json'
output_file_path = 'src/data/maps_db/maps_merged.json'
main(input_file_path, output_file_path)
