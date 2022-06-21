from typing import List, Union
from fastapi import WebSocket

from .messages import RunttaMsg, MsgType
from .db import get_count


class WebsocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

        # Send count on connection
        await self.broadcast(
            RunttaMsg(type=MsgType.count, value=get_count())
        )

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: Union[List[RunttaMsg], RunttaMsg]):
        for connection in self.active_connections:
            if isinstance(message, list):
                [await connection.send_json(msg) for msg in message]
            else:
                await connection.send_json(message)


websocketManager = WebsocketManager()
