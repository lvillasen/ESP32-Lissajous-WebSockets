#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <WebSocketsServer.h>


const char* ssid = "your ssid"; //SSID
const char* password = "your passwd"; //Password

AsyncWebServer server(80);
WebSocketsServer webSocket = WebSocketsServer(81);  // WebSocket server on port 81
int connect = 0;
const int ledPin = LED_BUILTIN;  

String result ;
int ledState = HIGH; 
float f1 = .1;
float f2 = .3;
float p1 = 0;
float p2 = 0;
float sr = 4;
float ph1;
float ph2;
unsigned long previousMillis = 0;  // will store last time LED was updated
int countUp = 0; 
float deltaT = 1/sr*1000;  // interval at which to blink (milliseconds)
float T;

void webSocketEvent(uint8_t num, WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      connect = 0;
      digitalWrite(ledPin, HIGH);
      break;
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d\n", num, ip[0], ip[1], ip[2], ip[3]);
        connect = 1;
      }
      break;
    case WStype_TEXT:
      Serial.printf("[%u] Received text: %s\n", num, payload);
      String message = String((char*)payload);
      if (message.startsWith("setF1:")) {
        float newF1 = message.substring(6).toFloat();
        f1 = newF1;
        Serial.print("Frequency f1 updated: ");
        Serial.println(f1);
      }
      if (message.startsWith("setF2:")) {
        float newF2 = message.substring(6).toFloat();
        f2 = newF2;
        Serial.print("Frequency f2 updated: ");
        Serial.println(f2);
      }
      if (message.startsWith("setP1:")) {
        float newP1 = message.substring(6).toFloat();
        p1 = newP1;
        Serial.print("Phase 1 updated: ");
        Serial.println(p1);
      }
        if (message.startsWith("setP2:")) {
        float newP2 = message.substring(6).toFloat();
        p2 = newP2;
        Serial.print("Phase 2 updated: ");
        Serial.println(p2);
      }
      if (message.startsWith("setSR:")) {
        float newSR = message.substring(6).toFloat();
        sr = newSR;
        deltaT = 1/sr*1000;
        Serial.print("Sampling rate updated: ");
        Serial.println(sr);
      }
      break;
  }
}

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  delay(1000);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  digitalWrite(ledPin, ledState);
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  server.begin();
  Serial.print("ESP32 Web Server's IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  webSocket.loop();
  if (millis() - previousMillis >= deltaT && connect == 1) {
    ledState = !ledState;
    countUp++;
    T = countUp*deltaT /1000.0;
    ph1 = PI/180.0*p1;
    ph2 = PI/180.0*p2;
    result = String(countUp) + " " + String(sin(2*PI*f1*T +ph1)) + " " + String(sin(2*PI*f2*T+ph2))+ " " + String(millis());
    //Serial.println(result);
    digitalWrite(ledPin, ledState);
    webSocket.broadcastTXT(result);
    previousMillis = millis();
  }
}
