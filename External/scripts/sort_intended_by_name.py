inputFilePath = r"C:\Users\.."
OutputFilePath = r"C:\Users\.."

def sort_key(entry):
    # Split by comma and return the second part (after the comma)
    return entry.split(",")[1]

with open(inputFilePath, 'r', encoding='utf-8') as file:
    entries = [line.strip() for line in file.readlines()]

sorted_entries = sorted(entries, key=sort_key)

# Write the sorted entries to the output file
with open(OutputFilePath, 'w', encoding='utf-8') as file:
    for entry in sorted_entries:
        file.write(entry + '\n')