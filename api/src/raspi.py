from pydantic import BaseModel

try:
    import RPi.GPIO as GPIO
except (ImportError, RuntimeError):
    import SimulRPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)


class Raspi(BaseModel):
    pin_in: int
    pin_out: int

    def init(self):
        GPIO.setup(self.pin_in, GPIO.IN)
        GPIO.setup(self.pin_out, GPIO.OUT)

        GPIO.add_event_detect(self.pin_in, GPIO.RISING, callback=self.drawback)

        return self

    def trigger(self):
        GPIO.output(self.pin_out, GPIO.HIGH)

    def drawback(self):
        GPIO.output(self.pin_out, GPIO.LOW)


raspi = Raspi(pin_in=19, pin_out=20).init()

GPIO.cleanup()
