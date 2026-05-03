import os

with open('memberships.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the corrupted '??' or similar with an hourglass emoji
content = content.replace('<span class="plan-meta-icon">??</span>', '<span class="plan-meta-icon">&#8987;</span>')
content = content.replace('??', '&#8987;')

with open('memberships.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed duration icons.')
