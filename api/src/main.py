from fastapi import (
    BackgroundTasks,
    FastAPI,
    Response,
    status,
    WebSocket,
    WebSocketDisconnect,
)

from fastapi.concurrency import run_in_threadpool

from loguru import logger

from .db import create_table
from .websocket import websocketManager
from .runtta import runttare, make_runtta

app = FastAPI()


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
