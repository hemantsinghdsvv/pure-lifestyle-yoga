import glob

def fix_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Strip BOM if added by Set-Content
    if content.startswith('\ufeff'):
        content = content[1:]
        
    try:
        # Revert: encode as latin-1 to get original bytes, then decode as utf-8
        original_bytes = content.encode('latin-1')
        fixed_content = original_bytes.decode('utf-8')
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"Fixed {filename}")
    except Exception as e:
        print(f"Failed {filename}: {e}")

fix_file('why-us.html')
