import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
link = '<li><a href="blog.html">Wellness Blog</a></li>'

for file in html_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'href="blog.html"' not in content or 'Explore' in content: # Double check if it's already there
            # Find the Explore section and add the blog link
            pattern = r'(<h5>Explore</h5>\s*<ul>.*?)(</ul>)'
            if re.search(pattern, content, re.DOTALL):
                new_content = re.sub(pattern, r'\1          ' + link + r'\n        \2', content, flags=re.DOTALL)
                with open(file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated {file}')
    except Exception as e:
        print(f'Error processing {file}: {e}')
