from fastapi import (
    BackgroundTasks,
    FastAPI,
    Response,
    status,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.middleware.cors import CORSMiddleware

from loguru import logger

try:
    import RPi.GPIO as GPIO
except (ImportError, RuntimeError):
    import sys
    import fake_rpi

    sys.modules['RPi'] = fake_rpi.RPi
    sys.modules['RPi.GPIO'] = fake_rpi.RPi.GPIO

from .db import create_table
from .websocket import websocketManager
from .runtta import make_runtta

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Hooks for startup
@app.on_event("startup")
async def startup_event():
    logger.debug("App startup!")
    create_table()


# Hooks for shutdown
@app.on_event("shutdown")
async def shutdown_events():
    logger.debug("Shutdown!")


# Don't nag about missing favicon
@app.get("/favicon.ico", include_in_schema=False)
async def ignore_favicon():
    return None


@app.put(
    "/runtta",
    status_code=status.HTTP_202_ACCEPTED,
)
async def runtta(bg_tasks: BackgroundTasks):
    bg_tasks.add_task(make_runtta)

    return Response(status_code=status.HTTP_202_ACCEPTED)


@app.websocket("/ws")
async def ws(websocket: WebSocket):
    await websocketManager.connect(websocket)

    try:
        while True:
            msg = await websocket.receive_json()
            logger.debug(f"Received data: {msg}")

    except WebSocketDisconnect:
        websocketManager.disconnect(websocket)
