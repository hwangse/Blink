
#include<WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "ThingSpeak.h"

// GPIO where the DS18B20 is connected to
const int oneWireBus = 4;

// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);

// Pass our oneWire reference to Dallas Temperature sensor
DallasTemperature sensors(&oneWire);

WiFiClient client;

char ssid[] = "AndroidHotspot1816";
char password[] = "12345677";
//int status = WL_IDLE_STATUS;

unsigned long myChannelNumber = 871782;
const char* myWriteAPIKey = "UOCS9EEW3JPRNHIM";

void setup() {
  // Start the Serial Monitor
  Serial.begin(115200);
  // Start the DS18B20 sensor
  sensors.begin();
  WiFi.begin(ssid, password);
  ThingSpeak.begin(client);
}

void loop() {
  delay(3000);

  sensors.requestTemperatures();
  float temperatureC = sensors.getTempCByIndex(0);

  ThingSpeak.setField(2,temperatureC);
  ThingSpeak.writeFields(myChannelNumber,myWriteAPIKey);


  Serial.print(temperatureC);
  Serial.println("ºC");

  delay(2000);
}
