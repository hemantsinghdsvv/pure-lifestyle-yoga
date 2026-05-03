import os

with open('memberships.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the duration row immediately after <div class="plan-meta">
replacement = '<div class="plan-meta">\n                <div class="plan-meta-row"><span class="plan-meta-icon">??</span>Duration: 45-60 Minutes</div>'
content = content.replace('<div class="plan-meta">', replacement)

with open('memberships.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Durations added.')
