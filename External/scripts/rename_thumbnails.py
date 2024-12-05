import os
import json
import difflib


def load_database(db):
    with open(db, 'r') as f:
        data = json.load(f)
    return [entry['name'] for entry in data]


def find_best_match(filename, names):
    matches = difflib.get_close_matches(filename, names, n=3, cutoff=0.215)
    return matches


def get_unique_filename(directory, name, extension):
    base_name = name
    counter = 1
    new_name = f"{base_name}{extension}"

    while os.path.exists(os.path.join(directory, new_name)):
        new_name = f"{base_name}{counter}{extension}"
        counter += 1

    return new_name


def rename_file(thumbnails_path, old_name, new_name):
    old_file_path = os.path.join(thumbnails_path, old_name)
    extension = os.path.splitext(old_name)[1]
    new_file_name = get_unique_filename(thumbnails_path, new_name, extension)
    new_file_path = os.path.join(thumbnails_path, new_file_name)

    os.rename(old_file_path, new_file_path)
    print(f'Renamed: {old_name} -> {new_file_name}')


def rename_thumbnails(db, thumbnail_path):
    names = load_database(db)

    for filename in os.listdir(thumbnail_path):
        if filename.endswith(".jpg") or filename.endswith(".jpeg") or filename.endswith(".png"):
            base_name = os.path.splitext(filename)[0]
            while base_name:
                matches = find_best_match(base_name, names)
                if not matches:
                    # Remove the last character and try again
                    base_name = base_name[:-1]
                else:
                    if matches[0] == base_name:
                        """ rename_file(thumbnail_path, filename, matches[0]) """
                    else:
                        print(f"\nMultiple matches found for '{filename}':")
                        for i, match in enumerate(matches, 1):
                            print(f"{i}. {match}")

                        choice = input(
                            "'r' to rename, Enter to skip: ")

                        if choice.isdigit() and 1 <= int(choice) <= len(matches):
                            selected_name = matches[int(choice) - 1]
                            rename_file(thumbnail_path,
                                        filename, selected_name)
                        elif choice == 'r':
                            choice = input("new name: ")
                            rename_file(thumbnail_path, filename, choice)
                        else:
                            print(f"Skipped renaming for '{filename}'")
                    break


DATABASE = 'src/data/maps_db/maps_merged.json'
NEW_THUMBNAILS = '../../Desktop/newThumbnails'

if not os.path.exists(DATABASE):
    raise RuntimeError("DATABASE path doesn't exist")

if not os.path.exists(NEW_THUMBNAILS):
    raise RuntimeError("NEW_THUMBNAILS path doesn't exist")

rename_thumbnails(DATABASE, NEW_THUMBNAILS)
