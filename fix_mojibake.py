import glob

def fix_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if content.startswith('\ufeff'):
        content = content[1:]
        
    try:
        fixed_content = content.encode('windows-1252').decode('utf-8')
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"Fixed {filename}")
    except Exception as e:
        print(f"Could not automatically fix {filename}: {e}")

for f in glob.glob('*.html'):
    fix_file(f)
