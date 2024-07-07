import json

# Function to convert .txt to .json
def txt_to_json(input_file, output_file):
    data = []
    
    # Read lines from .txt file
    with open(input_file, 'r') as f:
        lines = f.readlines()
    
    # Process each line
    for line in lines:
        # Remove newline character and split by ', '
        parts = line.strip().split(',')
        if len(parts) == 2:
            if parts[0] == 'S':
                intended_class = '3'
            elif parts[0] == 'D':
                intended_class = '4'
            else: intended_class = '5'
            
            map_name = parts[1]
            # Create dictionary for JSON object
            json_obj = {
                "name": map_name,
                "intended_class": intended_class
            }
            
            # Append to data list
            data.append(json_obj)
    
    # Write JSON to .json file
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)

txt_file = 'External/data/Intended_Sorted_Entries.txt'
json_file = 'External/data/Intended_Sorted_Entries.json'

txt_to_json(txt_file, json_file)