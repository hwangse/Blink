#include "Arduino.h"
#include "Blink.h"

Blink::Blink(int pin) {
	pinMode(pin, OUTPUT);
	_pin = pin;
}

void Blink::on(int time) {
	delay(time);
	digitalWrite(_pin, HIGH);
}

void Blink::off(int time) {
	delay(time);
	digitalWrite(_pin, LOW);
}