import re
import os

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def extract_tag(html, tag, class_contains=None):
    # Very naive extraction, assumes well-formed and non-nested matching tags
    # Actually, regex is bad for this. Let's do simple manual finding.
    pass

# We will just use string splitting based on known landmarks in the files.
index_html = read_file('index.html')
financeiro_html = read_file('.stitch/designs/financeiro.html')
calendario_html = read_file('.stitch/designs/calendario.html')

# 1. Prepare index.html parts
main_start_idx = index_html.find('<main class="ml-sidebar-width pt-16 h-screen flex bg-background">')
main_start_tag_len = len('<main class="ml-sidebar-width pt-16 h-screen flex bg-background">')
main_end_idx = index_html.find('</main>')

head_and_nav = index_html[:main_start_idx + main_start_tag_len]
chat_content = index_html[main_start_idx + main_start_tag_len:main_end_idx].strip()
footer_and_scripts = index_html[main_end_idx:]

# Update the Nav in head_and_nav to have onclick handlers
nav_replacements = {
    '<a href="#" class="text-primary font-bold border-r-2 border-primary bg-surface-container-high transition-colors flex items-center gap-3 px-4 py-3 rounded-l-lg">': 
    '<a href="#" id="nav-chat" onclick="switchTab(\'chat\')" class="text-primary font-bold border-r-2 border-primary bg-surface-container-high transition-colors flex items-center gap-3 px-4 py-3 rounded-l-lg">',
    
    '<a href="#" class="text-on-surface-variant flex items-center gap-3 px-4 py-3 hover:bg-surface-container-highest transition-colors rounded-lg group">':
    '<a href="#" id="nav-financeiro" onclick="switchTab(\'financeiro\')" class="text-on-surface-variant flex items-center gap-3 px-4 py-3 hover:bg-surface-container-highest transition-colors rounded-lg group">',
}
for k, v in nav_replacements.items():
    head_and_nav = head_and_nav.replace(k, v)

# The second nav replacement will hit both Financeiro and Calendario. We need to distinguish them.
# Let's just do a regex replace to add the ids and onclicks.
head_and_nav = re.sub(
    r'<a href="#" (id="nav-financeiro" onclick="switchTab\(\'financeiro\'\)" )?class="text-on-surface-variant flex items-center gap-3 px-4 py-3 hover:bg-surface-container-highest transition-colors rounded-lg group">\s*<span class="material-symbols-outlined group-hover:text-primary"[^>]*>account_balance_wallet</span>\s*<span class="font-body-md text-body-md group-hover:text-primary">Dashboard Financeiro</span>\s*</a>',
    r'<a href="#" id="nav-financeiro" onclick="switchTab(\'financeiro\')" class="text-on-surface-variant flex items-center gap-3 px-4 py-3 hover:bg-surface-container-highest transition-colors rounded-lg group">\n<span class="material-symbols-outlined group-hover:text-primary" data-icon="account_balance_wallet">account_balance_wallet</span>\n<span class="font-body-md text-body-md group-hover:text-primary">Dashboard Financeiro</span>\n</a>',
    head_and_nav
)

head_and_nav = re.sub(
    r'<a href="#" (id="nav-calendario" onclick="switchTab\(\'calendario\'\)" )?class="text-on-surface-variant flex items-center gap-3 px-4 py-3 hover:bg-surface-container-highest transition-colors rounded-lg group">\s*<span class="material-symbols-outlined group-hover:text-primary"[^>]*>calendar_month</span>\s*<span class="font-body-md text-body-md group-hover:text-primary">Calendário</span>\s*</a>',
    r'<a href="#" id="nav-calendario" onclick="switchTab(\'calendario\')" class="text-on-surface-variant flex items-center gap-3 px-4 py-3 hover:bg-surface-container-highest transition-colors rounded-lg group">\n<span class="material-symbols-outlined group-hover:text-primary" data-icon="calendar_month">calendar_month</span>\n<span class="font-body-md text-body-md group-hover:text-primary">Calendário</span>\n</a>',
    head_and_nav
)

# 2. Prepare Financeiro
# Extract between <div class="p-inner-padding flex flex-col gap-section-margin"> and <!-- Bottom Spacer --> or </main>
f_start = financeiro_html.find('<div class="p-inner-padding flex flex-col gap-section-margin">')
f_end = financeiro_html.find('<!-- Bottom Spacer -->')
financeiro_content = financeiro_html[f_start:f_end].strip()

# 3. Prepare Calendario
# Extract between <!-- Header --> (or <header class="h-20) and </main> for the center part
# and <aside... for the right part
c_main_start = calendario_html.find('<header class="h-20')
c_main_end = calendario_html.find('</main>')
calendario_center = calendario_html[c_main_start:c_main_end].strip()

c_aside_start = calendario_html.find('<aside class="w-[320px] fixed right-0 top-0 h-screen border-l border-outline-variant bg-surface p-6 flex flex-col gap-8 overflow-y-auto">')
c_aside_end = calendario_html.find('</aside>', c_aside_start) + len('</aside>')
calendario_aside = calendario_html[c_aside_start:c_aside_end].strip()
# Remove 'fixed right-0 top-0 h-screen' and replace with 'w-utility-panel-width' to match index layout
calendario_aside = calendario_aside.replace('w-[320px] fixed right-0 top-0 h-screen', 'w-utility-panel-width relative')

# 4. Assemble
assembled_main = f"""
  <!-- CHAT TAB -->
  <div id="view-chat" class="flex-1 flex w-full">
    {chat_content}
  </div>

  <!-- FINANCEIRO TAB -->
  <div id="view-financeiro" class="hidden flex-1 overflow-y-auto custom-scrollbar w-full bg-background relative">
    {financeiro_content}
  </div>

  <!-- CALENDARIO TAB -->
  <div id="view-calendario" class="hidden flex-1 flex w-full bg-background relative">
    <div class="flex-1 flex flex-col min-w-0">
        {calendario_center}
    </div>
    {calendario_aside}
  </div>
"""

# Insert JS for switching
switch_js = """
<script>
    function switchTab(tabId) {
        // Hide all views
        document.getElementById('view-chat').classList.add('hidden');
        document.getElementById('view-financeiro').classList.add('hidden');
        document.getElementById('view-calendario').classList.add('hidden');
        
        // Reset nav styles
        const navs = ['nav-chat', 'nav-financeiro', 'nav-calendario'];
        navs.forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                el.className = 'text-on-surface-variant flex items-center gap-3 px-4 py-3 hover:bg-surface-container-highest transition-colors rounded-lg group';
                // Remove specific active classes
                el.classList.remove('text-primary', 'font-bold', 'border-r-2', 'border-primary', 'bg-surface-container-high', 'rounded-l-lg');
            }
        });
        
        // Show active view
        document.getElementById('view-' + tabId).classList.remove('hidden');
        if (tabId !== 'financeiro') {
            document.getElementById('view-' + tabId).classList.add('flex');
        }
        
        // Set active nav style
        const activeNav = document.getElementById('nav-' + tabId);
        if (activeNav) {
            activeNav.className = 'text-primary font-bold border-r-2 border-primary bg-surface-container-high transition-colors flex items-center gap-3 px-4 py-3 rounded-l-lg';
        }
    }
</script>
"""

# Append script just before closing body
footer_parts = footer_and_scripts.rsplit('</body>', 1)
new_footer = footer_parts[0] + switch_js + '</body>' + footer_parts[1]

final_html = head_and_nav + assembled_main + '\n</main>' + new_footer

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

print("Done generating index.html")
