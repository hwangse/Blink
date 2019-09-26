#include<WiFi.h>
#include "ThingSpeak.h"

WiFiClient client;

char ssid[] = "AndroidHotspot1816";
char password[] = "12345677";
char host[] = "www.kma.go.kr";

unsigned long myChannelNumber = 871782;
const char* myWriteAPIKey = "UOCS9EEW3JPRNHIM";

void setup() {
  // Start the Serial Monitor
  Serial.begin(115200);
  delay(10);

  WiFi.begin(ssid, password);

  ThingSpeak.begin(client);
}

void loop() {
  delay(2000);

  // Use WiFiClient class to create TCP connections
  const int httpPort = 80;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }

  // We now create a URI for the request
  String url = "/wid/queryDFSRSS.jsp?zone=4111757000";

  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n");
  unsigned long timeout = millis();
  while (client.available() == 0) {
    if (millis() - timeout > 5000) {
      Serial.println(">>> Client Timeout !");
      client.stop();
      return;
    }
  }

  // Read all the lines of the reply from server and print them to Serial
  while (client.available()) {
    String line = client.readStringUntil('\r');
    // This is parsing section for temperature.
    if (line.startsWith("\n<?xml")) {
      for (int idx = 0; idx < line.length();) {
        int findIdx = line.indexOf("<temp>", idx);
        if (findIdx == -1) break;
        String temperature = line.substring(findIdx + 6, findIdx + 10);
        Serial.println("temperature : " + temperature + "\n\n");
        idx = findIdx + 10;

        float temp = temperature.toFloat();
        ThingSpeak.setField(1, temp);
        ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
      }
    }
  }

  delay(2000);
}
