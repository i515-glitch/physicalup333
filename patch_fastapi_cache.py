import re

with open("app/main.py", "r", encoding="utf-8") as f:
    content = f.read()

# Replace: app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
# With a custom StaticFiles that disables cache
custom_static = """from fastapi.staticfiles import StaticFiles

class NoCacheStaticFiles(StaticFiles):
    def is_not_modified(self, response_headers, req_headers):
        return False

app.mount("/static", NoCacheStaticFiles(directory=STATIC_DIR), name="static")"""

content = re.sub(r'app\.mount\("/static", StaticFiles\(directory=STATIC_DIR\), name="static"\)', custom_static, content)

with open("app/main.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Patched main.py")
