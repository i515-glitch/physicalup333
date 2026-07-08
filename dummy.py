from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

class NoCacheStaticFiles(StaticFiles):
    def is_not_modified(self, response_headers, req_headers):
        return False

# ...
