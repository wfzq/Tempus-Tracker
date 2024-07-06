import json

def merge_json(f1, f2, f_out):
    # Read data from both JSON files
    with open(f1, 'r') as f1, open(f2, 'r') as f2:
        data1 = json.load(f1)
        data2 = json.load(f2)
    
    data2_dict = {entry['name']: entry for entry in data2}
    
    # Merge data1 with data2
    merged_data = []
    for entry1 in data1:
        name = entry1['name']
        if name in data2_dict:
            # Merge entry1 with entry from data2
            merged_entry = {**entry1, **data2_dict[name]}
            merged_data.append(merged_entry)
        else:
            merged_data.append(entry1)
    
    # Write merged data to output file
    with open(f_out, 'w') as outfile:
        json.dump(merged_data, outfile, indent=2)

# Example usage:
json_file1 = 'External/data/Intended_Sorted_Entries.json'
json_file2 = 'src/API/detailedMapsList.json'
output_file = 'src/API/detailedMapsList_merged.js'

merge_json(json_file1, json_file2, output_file)