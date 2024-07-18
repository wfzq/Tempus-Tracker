import json

def merge_json(f1, f2, f_out):
    # Read data from both JSON files
    with open(f1, 'r') as file1, open(f2, 'r') as file2:
        data1 = json.load(file1)
        data2 = json.load(file2)
    
    data2_dict = {entry['name']: entry for entry in data2}
    
    # Merge data1 with data2 only if name matches
    merged_data = []
    for entry1 in data1:
        name = entry1['name']
        if name in data2_dict:
            # Merge entry1 with entry from data2
            merged_entry = {**entry1, **data2_dict[name]}
            merged_data.append(merged_entry)
    
    # Write merged data to output file
    with open(f_out, 'w') as outfile:
        json.dump(merged_data, outfile, indent=2)

# DEPRICATED
json_file1 = ''
json_file2 = ''
output_file = ''

merge_json(json_file1, json_file2, output_file)
