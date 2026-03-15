import os
import re

wiki_dir = 'wiki'
files = [f for f in os.listdir(wiki_dir) if f.endswith('.html')]

# Standard Header with ../ assets
new_header = """  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand">
        <img src="../assets/images/logo.svg" alt="PinableAgents">
        <span class="product-title">PinableAgents</span>
      </a>
      <nav class="nav" aria-label="主导航">
        <a href="/">首页</a>
        <a href="/wiki.html">Wiki</a>
        <a href="/about.html">关于</a>
        <a href="/contact.html">联系</a>
      </nav>
    </div>
  </header>"""

# Standard Footer
new_footer = """  <footer class="footer">
    <div class="container">
      <div>© 2026 PinableAgents · PinableLab</div>
      <span>Workflows / Orchestration / Execution</span>
    </div>
  </footer>"""

for filename in files:
    path = os.path.join(wiki_dir, filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Header
    content = re.sub(r'<header class="site-header">.*?</header>', new_header, content, flags=re.DOTALL)

    # 2. Update Footer
    content = re.sub(r'<footer class="footer">.*?</footer>', new_footer, content, flags=re.DOTALL)

    # 3. Update Date
    content = re.sub(r'<span>更新：\d{4}-\d{2}-\d{2}</span>', '<span>更新：2026-03-15</span>', content)

    # 4. Update Favicon and CSS paths if they don't have ../
    content = content.replace('href="assets/images/logo.svg"', 'href="../assets/images/logo.svg"')
    content = content.replace('href="assets/css/reset.css"', 'href="../assets/css/reset.css"')
    content = content.replace('href="assets/css/site.css"', 'href="../assets/css/site.css"')
    
    # Ensure they are using ../ (some might already have it)
    # If it has /assets, it should stay /assets or be changed to ../assets depending on intent.
    # User said: "其资源引用路径应为 ../assets/..."
    # If it was "assets/...", it becomes "../assets/..."
    # If it was "/assets/...", it might need to stay "/assets/..." if root-relative is preferred, 
    # but the instruction said specifically "../assets/...".
    
    # Let's be more precise:
    content = re.sub(r'href="(?!(https?:|/))assets/', 'href="../assets/', content)
    content = re.sub(r'src="(?!(https?:|/))assets/', 'src="../assets/', content)
    
    # Update logo alt in header if any was left
    content = content.replace('alt="PinableLab"', 'alt="PinableAgents"')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Updated {len(files)} files.")
