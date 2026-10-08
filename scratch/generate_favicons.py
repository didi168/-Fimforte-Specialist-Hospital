import os
import subprocess
import tempfile
from PIL import Image

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
svg_path = os.path.join(base_dir, "assets", "icons", "fimforte-favicon.svg")

with open(svg_path, "r", encoding="utf-8") as f:
    svg_content = f.read()

# Create a clean HTML wrapper
html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{
    width: 512px;
    height: 512px;
    overflow: hidden;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }}
  svg {{
    width: 512px;
    height: 512px;
    display: block;
  }}
</style>
</head>
<body>
{svg_content}
</body>
</html>
"""

temp_html = os.path.join(tempfile.gettempdir(), "render_favicon.html")
with open(temp_html, "w", encoding="utf-8") as f:
    f.write(html_content)

master_png = os.path.join(base_dir, "assets", "icons", "favicon-512x512.png")

cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--default-background-color=00000000",
    "--window-size=512,512",
    f"--screenshot={master_png}",
    f"file:///{temp_html.replace(os.sep, '/')}"
]

print("Rendering master 512x512 PNG with Edge headless...")
subprocess.run(cmd, check=True)

if not os.path.exists(master_png):
    raise RuntimeError("Failed to generate master 512x512 PNG")

img = Image.open(master_png)
print(f"Generated master image: {img.size}")

# Generate specific icons
icons_dir = os.path.join(base_dir, "assets", "icons")

sizes = {
    "favicon-192x192.png": (192, 192),
    "apple-touch-icon.png": (180, 180),
    "favicon-96x96.png": (96, 96),
    "favicon-48x48.png": (48, 48),
    "favicon-32x32.png": (32, 32),
    "favicon-16x16.png": (16, 16),
    "fimforte-emblem-512.png": (512, 512)
}

for filename, size in sizes.items():
    dest = os.path.join(icons_dir, filename)
    resized = img.resize(size, Image.Resampling.LANCZOS)
    resized.save(dest, "PNG", optimize=True)
    print(f"Saved {filename} ({size[0]}x{size[1]})")

# Generate root favicon.ico and assets/icons/favicon.ico
ico_sizes = [(16, 16), (32, 32), (48, 48)]
root_ico = os.path.join(base_dir, "favicon.ico")
icons_ico = os.path.join(icons_dir, "favicon.ico")

img.save(root_ico, format="ICO", sizes=ico_sizes)
img.save(icons_ico, format="ICO", sizes=ico_sizes)
print(f"Saved multi-resolution favicon.ico in root and assets/icons/ with sizes {ico_sizes}")
print("ALL ICONS SUCCESSFULLY GENERATED!")
