import os
import glob

# Rename the file if it exists
if os.path.exists('why-us.html'):
    os.rename('why-us.html', 'our-story.html')

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace links
    content = content.replace('why-us.html', 'our-story.html')
    # Replace nav text
    content = content.replace('>Why Us<', '>Our Story<')
    content = content.replace('>Why Choose Us<', '>Our Story<')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print('Updated all files to use our-story.html')
