import asyncio

from .db import get_count, increment
from .websocket import WebsocketManager, websocketManager
from .messages import MsgType, RunttaMsg, StatusType
from .raspi import raspi

from loguru import logger


async def make_runtta():
    if not runttare.busy:
        await runttare.runtta()

    return True


class Runttare:
    def __init__(self, ):
        self.ws: WebsocketManager = websocketManager
        self.busy = False

    async def runtta(self):
        if not self.busy:
            await self.change_status()

            # TODO: Handle Pi
            raspi.trigger()

            logger.debug("status set to busy")
            await asyncio.sleep(5)

            increment()
            await self.send_success()

    async def handle_count(self):
        await self.ws.broadcast(RunttaMsg(type=MsgType.count, value=get_count()))

    async def send_success(self):
        await self.change_status()
        await self.ws.broadcast(RunttaMsg(type=MsgType.count, value=get_count()))

    async def change_status(self):
        self.busy = not self.busy
        await self.ws.broadcast(
            RunttaMsg(type=MsgType.status, value=StatusType.busy if self.busy else StatusType.idle)
        )


runttare = Runttare()
