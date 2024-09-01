import requests
from bs4 import BeautifulSoup, Tag

URL = "https://jumpacademy.tf/maps"
IMAGE_SAVE_PATH = "../Desktop/newThumbnails/"
names_list = []


def download_and_convert_image(url, map_name):
    response = requests.get(url)

    if response.status_code == 200:
        with open(IMAGE_SAVE_PATH + map_name + ".jpg", 'wb') as file:
            file.write(response.content)

        print("Image downloaded")
    else:
        print(f"Failed to download, {response.status_code}")


# Fetch HTML
response = requests.get(URL)
html_content = response.content

# Parse HTML
soup = BeautifulSoup(html_content, 'html.parser')

# Get to the correct tag
tbody = soup.find_all('tbody')[1]
if not isinstance(tbody, Tag):
    print("<tbody> tag not found")

for tr in tbody.find_all('tr'):
    # Get first 2 tags, thumbnail and name
    first_two_elements = tr.find_all('td', limit=2)

    # Make sure there are 2 elements present
    if len(first_two_elements) == 2:
        # Get Thumbnail
        thumbnail_href = first_two_elements[0].find('a')
        if thumbnail_href and 'href' in thumbnail_href.attrs:
            thumbnail_link = thumbnail_href['href']
            # Check map and thumbnail
            if thumbnail_link == "https://jumpacademy.tf/media/icons/noimage.png":
                continue

        # Get Map Name
        href_name = first_two_elements[1].find('a')
        if href_name:
            name_text = href_name.text.strip()

            # Filter copies
            if name_text in names_list:
                continue

            names_list.append(name_text)

            # Add jump_ prefix if needed
            if not name_text.startswith("jump_"):
                name_text = "jump_" + name_text

        # Download the picture
        if name_text and thumbnail_link:
            download_and_convert_image(thumbnail_link, name_text)
