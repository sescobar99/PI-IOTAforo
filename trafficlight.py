import RPi.GPIO as GPIO
import time

red = 31
yellow = 32
green = 33

GPIO.setmode(GPIO.BOARD)
GPIO.setup(red, GPIO.OUT)
GPIO.setup(green, GPIO.OUT)
GPIO.setup(yellow, GPIO.OUT)

def actuators(level):
    level = int(level)
    if level == 0:
        cleanAll()
        greenOn()
    elif level == 1 :
        cleanAll()
        yellowOn()
    else :
        cleanAll()
        redOn()


def redOn():
    GPIO.output(red, True)

def yellowOn():
    GPIO.output(yellow, True)

def greenOn():
    GPIO.output(green, True)

def cleanAll():
    GPIO.output(red, False)
    GPIO.output(yellow, False)
    GPIO.output(green, False)