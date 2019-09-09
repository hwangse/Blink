#include "Blink.h"

Blink blink(4);

void setup() {
  Serial.begin(115200);
  pinMode(0, OUTPUT);
  pinMode(4, OUTPUT);
  Serial.println("\nBlink Version 1.0 Sehyun Hwang");
}

void loop() {
  blink.on(500);
  blink.off(300);
}
