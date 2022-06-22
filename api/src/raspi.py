from os import getenv
import asyncio
from pydantic import BaseModel
from loguru import logger
import RPi.GPIO as GPIO


class Raspi(BaseModel):
    pin_in: int
    pin_out: int

    def init(self):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.pin_in, GPIO.IN)
        GPIO.setup(self.pin_out, GPIO.OUT)
        GPIO.add_event_detect(self.pin_in, GPIO.RISING, callback=self.drawback)

        return self

    async def trigger(self):
        logger.debug("Triggering")
        GPIO.output(self.pin_out, GPIO.HIGH)
        await asyncio.sleep(int(getenv('RUNTTA_TIMEOUT', 3)))
        GPIO.output(self.pin_out, GPIO.LOW)

    def drawback(self):
        logger.debug("Drawback")
        GPIO.output(self.pin_out, GPIO.LOW)


raspi = Raspi(pin_in=19, pin_out=20).init()

GPIO.cleanup()
