import re
import os

# Read files
merged_index = open('index.html', 'r', encoding='utf-8').read()
financeiro_src = open('.stitch/designs/financeiro.html', 'r', encoding='utf-8').read()
calendario_src = open('.stitch/designs/calendario.html', 'r', encoding='utf-8').read()

# 1. Extract Head and Sidebar (up to <nav...>) from merged_index
# Note: merged_index has <nav class="flex-1 mt-4 px-4 space-y-2">
nav_start = merged_index.find('<nav class="flex-1 mt-4 px-4 space-y-2">')
head_and_top_of_sidebar = merged_index[:nav_start + len('<nav class="flex-1 mt-4 px-4 space-y-2">')]

# Extract bottom of sidebar and Top Nav
nav_end = merged_index.find('</nav>')
main_start = merged_index.find('<main class="ml-sidebar-width pt-16 h-screen flex bg-background">')
main_start_tag = '<main class="ml-sidebar-width pt-16 h-screen flex bg-background">'
bottom_sidebar_and_top_nav = merged_index[nav_end:main_start + len(main_start_tag)]

# 2. Reconstruct Nav items templates
active_class = "text-primary font-bold border-r-2 border-primary bg-surface-container-high transition-colors flex items-center gap-3 px-4 py-3 rounded-l-lg"
inactive_class = "text-on-surface-variant flex items-center gap-3 px-4 py-3 hover:bg-surface-container-highest transition-colors rounded-lg group"

def generate_nav(active_tab):
    chat_class = active_class if active_tab == 'chat' else inactive_class
    fin_class = active_class if active_tab == 'financeiro' else inactive_class
    cal_class = active_class if active_tab == 'calendario' else inactive_class
    
    # Notice we removed onclick and ids.
    chat_link = f'''
<a href="index.html" class="{chat_class}">
<span class="material-symbols-outlined" data-icon="chat">chat</span>
<span class="font-body-md text-body-md">Chat</span>
</a>'''
    
    fin_link = f'''
<a href="financeiro.html" class="{fin_class}">
<span class="material-symbols-outlined group-hover:text-primary" data-icon="account_balance_wallet">account_balance_wallet</span>
<span class="font-body-md text-body-md group-hover:text-primary">Dashboard Financeiro</span>
</a>'''
    
    cal_link = f'''
<a href="calendario.html" class="{cal_class}">
<span class="material-symbols-outlined group-hover:text-primary" data-icon="calendar_month">calendar_month</span>
<span class="font-body-md text-body-md group-hover:text-primary">Calendário</span>
</a>'''
    
    return chat_link + fin_link + cal_link

# 3. Extract contents
# Chat center
view_chat_start = merged_index.find('<!-- Chat Quadrant (Center) -->')
view_chat_end = merged_index.find('<!-- Utility Panel (Right) -->', view_chat_start)
chat_center = merged_index[view_chat_start:view_chat_end].strip()

# Chat right
utility_start = merged_index.find('<!-- Utility Panel (Right) -->')
utility_end = merged_index.find('</aside>', utility_start) + len('</aside>')
chat_right = merged_index[utility_start:utility_end].strip()

# Financeiro center (from pristine)
f_start = financeiro_src.find('<div class="p-inner-padding flex flex-col gap-section-margin">')
f_end = financeiro_src.find('<!-- Bottom Spacer -->')
financeiro_center = financeiro_src[f_start:f_end].strip()

# Calendario center (from pristine)
c_main_start = calendario_src.find('<header class="h-20')
c_main_end = calendario_src.find('</main>')
calendario_center = calendario_src[c_main_start:c_main_end].strip()

# Calendario right (from pristine)
c_aside_start = calendario_src.find('<aside class="w-[320px] fixed right-0 top-0 h-screen border-l border-outline-variant bg-surface p-6 flex flex-col gap-8 overflow-y-auto">')
c_aside_end = calendario_src.find('</aside>', c_aside_start) + len('</aside>')
calendario_aside = calendario_src[c_aside_start:c_aside_end].strip()
calendario_aside = calendario_aside.replace('w-[320px] fixed right-0 top-0 h-screen', 'w-utility-panel-width relative')

# 4. Extract footer and scripts (removing the switchTab script)
footer_start = merged_index.find('</main>')
footer = merged_index[footer_start:]
# Remove the switchTab script block
switch_script_start = footer.find('<script>\n        function switchTab')
if switch_script_start != -1:
    switch_script_end = footer.find('</script>', switch_script_start) + len('</script>')
    footer = footer[:switch_script_start] + footer[switch_script_end:]

# Clean up any leftover empty lines or switchTab references in footer
footer = re.sub(r'\n\s*\n', '\n', footer).strip()

# 5. Generate files

# INDEX.HTML
index_html = head_and_top_of_sidebar + generate_nav('chat') + bottom_sidebar_and_top_nav + f'''
  <div class="flex-1 flex w-full">
    {chat_center}
    {chat_right}
  </div>
''' + '\n' + footer

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_html)

# FINANCEIRO.HTML
financeiro_html = head_and_top_of_sidebar + generate_nav('financeiro') + bottom_sidebar_and_top_nav + f'''
  <div class="flex-1 overflow-y-auto custom-scrollbar w-full bg-background relative">
    {financeiro_center}
  </div>
''' + '\n' + footer

with open('financeiro.html', 'w', encoding='utf-8') as f:
    f.write(financeiro_html)

# CALENDARIO.HTML
calendario_html = head_and_top_of_sidebar + generate_nav('calendario') + bottom_sidebar_and_top_nav + f'''
  <div class="flex-1 flex w-full bg-background relative">
    <div class="flex-1 flex flex-col min-w-0">
        {calendario_center}
    </div>
    {calendario_aside}
  </div>
''' + '\n' + footer

with open('calendario.html', 'w', encoding='utf-8') as f:
    f.write(calendario_html)

print("Files generated successfully.")
