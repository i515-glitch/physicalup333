import os
import json
import asyncio
from playwright.async_api import async_playwright

async def generate_pdf_async(analysis_data, output_pdf_path, server_url="http://127.0.0.1:8000"):
    """
    Launches headless Chromium using Playwright, injects analysis_data into localStorage,
    navigates to report.html, and prints it out to a premium A4 PDF.
    """
    async with async_playwright() as p:
        # Launch Chromium (Headless mode)
        browser = await p.chromium.launch(headless=True)
        
        # Create browser context
        context = await browser.new_context(
            viewport={"width": 800, "height": 1130}, # Approximate A4 aspect ratio width
            device_scale_factor=2 # Premium high DPI rendering
        )
        
        page = await context.new_page()
        
        # 1. Navigate to the root site first to establish the domain context in localStorage
        await page.goto(server_url)
        
        # 2. Inject analysis result into localStorage
        data_json = json.dumps(analysis_data, ensure_ascii=False)
        await page.evaluate(f"localStorage.setItem('physicalup_analysis', `{data_json}`)")
        
        # 3. Navigate to report.html which reads from localStorage and binds data (bypassing cache)
        import time
        report_url = f"{server_url}/static/report.html?t={int(time.time() * 1000)}"
        await page.goto(report_url, wait_until="networkidle")
        
        # 4. Wait a short bit to guarantee charts and text scripts finish rendering
        await page.wait_for_timeout(2000)
        
        # 5. Output PDF in A4 format with backgrounds printed, forcing margin to 0 since report.html has A4 padding
        await page.pdf(
            path=output_pdf_path,
            format="A4",
            print_background=True,
            margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"}
        )
        
        await browser.close()
        print(f"[PDF Generator] Successfully generated PDF at: {output_pdf_path}")

def generate_pdf(analysis_data, output_pdf_path, server_url="http://127.0.0.1:8000"):
    """
    Synchronous wrapper to run the async pdf generator in the event loop.
    """
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
    if loop.is_running():
        # If event loop is already running (e.g. inside FastAPI), run via run_coroutine_threadsafe or create task
        import threading
        result_future = asyncio.run_coroutine_threadsafe(
            generate_pdf_async(analysis_data, output_pdf_path, server_url), 
            loop
        )
        # Block until finished
        result_future.result()
    else:
        loop.run_until_complete(generate_pdf_async(analysis_data, output_pdf_path, server_url))
