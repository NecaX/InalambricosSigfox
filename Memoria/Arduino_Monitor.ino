
#include <SigFox.h>
#include <ArduinoLowPower.h>

void setup() {
  randomSeed(analogRead(0));
  Serial.begin(9600);
  SigFox.begin();
  SigFox.debug();
  
  /*
  short pulsaciones = random(50,130);
  short temperatura = random(30,45);
  short tension = random(70,130);
  short glucosa = random(59,150);
  
  Serial.println("Waiting for downlink");
  SigFox.beginPacket();
  SigFox.write(pulsaciones);
  SigFox.write(temperatura);
  SigFox.write(tension);
  SigFox.write(glucosa);
  SigFox.endPacket();*/
  SigFox.end();
}
void loop() {
  while (SigFox.available()) {
  Serial.print("0x");
  Serial.println(SigFox.read(), HEX);
   }

  SigFox.begin();

  short pulsaciones = random(50,130);
  short temperatura = random(34,41);
  short tension = random(70,130);
  short glucosa = random(59,150);

  SigFox.beginPacket();
  SigFox.write(pulsaciones);
  SigFox.write(temperatura);
  SigFox.write(tension);
  SigFox.write(glucosa);
  SigFox.endPacket();

  //LowPower.sleep(15 * 60 * 1000);
  LowPower.sleep(10000);
  SigFox.end();
}
