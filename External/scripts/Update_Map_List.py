import json
import time
import requests
import datetime
import os
import shutil
from concurrent.futures import ThreadPoolExecutor, as_completed

# 0 = False, 1 = True
BACKUP_CURRENT_FILE = 1
CHECK_FOR_NEW_MAPS = 1

# Map name, otherwise Leave empty
CONTINUE_FROM_MAP = ""

# URLs
MAPS_JSON_URL = "src/data/maps_db/maps_merged.json"
GET_MAP_LIST = "https://tempus2.xyz/api/v0/maps/detailedList"
GET_MAP_COMP = "https://tempus2.xyz/api/v0/maps/id/{}/zones/typeindex/map/1/records/player/0/3"

MAP_IDS = set()

"""
Helper functions
"""
def get_map_completions(map_id, max_retries=3, base_delay=1.0):
    url = GET_MAP_COMP.format(map_id)
    retries = 0

    while retries < max_retries:
        try:
            response = requests.get(url, timeout=15)
            if response.status_code == 429:
                # Try to get retry-after header, default to exponential backoff
                retry_after = float(response.headers.get('Retry-After', base_delay * (2 ** retries)))
                print(f"Rate limited at: {map_id}. Waiting {retry_after} seconds")
                time.sleep(retry_after)
                retries += 1
                continue
            
            
            response.raise_for_status()
            data = response.json()
            completion_info = data.get('completion_info', {})
            completion_info['last_updated'] = datetime.datetime.now().isoformat()

            return {
                "name": map_id,
                "completion_info": completion_info
            }

        except requests.RequestException as e:
            if hasattr(e, 'response') and e.response is not None:
                
                if e.response.status_code == 429:
                    retry_after = float(e.response.headers.get('Retry-After', base_delay * (2 ** retries)))
                    time.sleep(retry_after)
                    print(f"Rate limited when fetching map id: {map_id}. Retrying after {retry_after} seconds")
                
                elif e.response.status_code == 404:
                    print(f"Map id: {map_id} not found")
                    break
                else:
                    print(f"Failed to fetch data for map id: {map_id}. \
                        Status code: {e.response.status_code}")
            else:
                print(f"Network error when fetching map id: {map_id}. Error: {str(e)}")
            
            retries += 1
            if retries < max_retries:
                # Exponential backoff
                delay = base_delay * (2 ** retries)
                print(f"Retrying {retries}/{max_retries} after {delay} seconds...")
                time.sleep(delay)
        except json.JSONDecodeError:
            print("Error parsing API response as JSON")
    
    return None


"""
Main functions
"""
def update_maps(maps_json):
    print("Checking for new maps...")
    # Fetch maps from API
    try:
        response = requests.get(GET_MAP_LIST)
        response.raise_for_status()
        updated_map_list = response.json()
    except requests.RequestException as e:
        print(f"API request failed: {e}")
        exit(1)
    except json.JSONDecodeError:
        print("Error parsing API response as JSON")
        exit(1)
    
    # Create 'id' dictionary
    local_maps_by_id = {item.get('id'): item for item in maps_json if 'id' in item}
    updated_elements = []
    
    template = {
            "intended_class": None,
            "completion_info": {
                "soldier": None,
                "demoman": None,
                "last_updated": None
            },
            "class_tech": {
                "soldier": [],
                "demoman": []
            }
        }

    # Process each item from the API response
    for updated_map in updated_map_list:
        api_id = updated_map['id']
        MAP_IDS.add(api_id)

        # Use existing map or create a new one
        if api_id in local_maps_by_id:
            current_map = local_maps_by_id[api_id]
        else:
            print(f"Added new map: {updated_map.get('name')}")
            current_map = updated_map.copy()

        # Check for missing fields
        for key, value in template.items():
            if key not in current_map:
                print(f"Added missing: {key} in {current_map.get('name')}")
                current_map[key] = value
            
            # Check for missing subkeys
            elif isinstance(value, dict) and isinstance(current_map[key], dict):
                for subkey, subvalue in value.items():
                    if subkey not in current_map[key]:
                        current_map[key][subkey] = subvalue
                        print(f"Added missing: {subkey} in {key}, for map {current_map.get('name')}")
    
        # Merge with API data
        merged_map = {**current_map, **updated_map}
        updated_elements.append(merged_map)

    # Remove local items that weren't in the API response
    for local_id, current_map in local_maps_by_id.items():
        if local_id not in MAP_IDS:
            maps_json.remove(current_map)
            print(f"Map: {current_map.get('name')} removed from map pool")
            
    print("Maps up to date! Saving..\n")
    save_mapsmerged(updated_elements)

    return updated_elements

def update_map_completions(maps_json, start_from_map_name=None):
    start_from_map = bool(start_from_map_name)

    for i, current_map in enumerate(maps_json):
        map_id = current_map['id']

        if start_from_map:
            if current_map['name'] == start_from_map_name:
                print(f"Starting from map: {map_id}")
                start_from_map = None
            else:
                continue

        result = get_map_completions(map_id)
        
        if result:
            print(f"Updated completions for: {maps_json[i]['name']} ({i + 1}/{len(maps_json)})")
            maps_json[i]['completion_info'] = result['completion_info']

            # Save every 10 maps and after completing the last one
            if (i + 1) % 10 == 0 or i == len(maps_json) - 1:
                with open(MAPS_JSON_URL, 'w') as f:
                    json.dump(maps_json, f, indent=2)
                print(f"Progress saved until: {maps_json[i]['name']}")

        
        else:
            print(f"Failed to get completions for map id: {map_id}")
    
    if start_from_map != None:
        print(f"Map: {start_from_map_name} not found in file, check spelling or capitalization")

    return maps_json

"""
 IO functions
"""
def open_maps_merged_json():
    try:
        with open(MAPS_JSON_URL, 'r') as f:
            return json.load(f)

    except FileNotFoundError:
        print(f"Local file not found: {MAPS_JSON_URL}")
        exit(1)
    except json.JSONDecodeError:
        print(f"Error parsing local JSON file: {MAPS_JSON_URL}")
        exit(1)


def save_mapsmerged(maps_json):
    try:
        with open(MAPS_JSON_URL, 'w') as f:
            json.dump(maps_json, f, indent=2)
        print(f"Successfully updated maps_merged.json")

    except Exception as e:
        print(f"Error saving updated data: {e}")
        exit(1)


def make_backup(file_path):
    if os.path.exists(file_path):
        directory, filename = os.path.split(file_path)
        filename_without_ext, ext = os.path.splitext(filename)

        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file_path = os.path.join(
            directory, f"{filename_without_ext}_{timestamp}.json")

        shutil.copyfile(file_path, backup_file_path)
        print(f"Backup successfull!\n")
    else:
        print(f"File not found: {file_path}, exiting...")
        exit(1)


if __name__ == "__main__":
    if BACKUP_CURRENT_FILE: 
        print("Creating backup...")
        make_backup(MAPS_JSON_URL)

    maps_json = open_maps_merged_json()
   
    if CHECK_FOR_NEW_MAPS:
        maps_json = update_maps(maps_json)

    update_map_completions(maps_json, CONTINUE_FROM_MAP)
