import glob, re

def process_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove <li><a href="partnerships.html">...</a></li>
    content = re.sub(r'[ \t]*<li>\s*<a[^>]*href="partnerships\.html"[^>]*>Partnerships</a>\s*</li>\r?\n?', '', content, flags=re.IGNORECASE)
    
    # Remove <a href="partnerships.html">...</a> (mobile nav)
    content = re.sub(r'[ \t]*<a[^>]*href="partnerships\.html"[^>]*>Partnerships</a>\r?\n?', '', content, flags=re.IGNORECASE)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

for f in glob.glob('*.html'):
    process_file(f)
