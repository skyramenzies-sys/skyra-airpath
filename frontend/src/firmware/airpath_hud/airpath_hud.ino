#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_ADDR 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// HUD boot sequence frames
const char* bootSequence[] = {
  "SKYRA ONLINE",
  "MODE: STANDBY",
  "ROUTE: INITIALIZED",
  "SPEECH: READY",
  "HELM: CONNECTED",
  "SUIT: SYNCED"
};

const int bootFrames = 6;
unsigned long lastFrameTime = 0;
int currentFrame = 0;
bool bootComplete = false;

// System status
struct SystemStatus {
  bool helmConnected;
  bool suitSynced;
  bool routeReady;
  bool speechActive;
  int batteryLevel;
  float altitude;
  float speed;
};

SystemStatus status = { true, true, true, true, 87, 0.0, 0.0 };

void setup() {
  Serial.begin(115200);
  
  // Init OLED
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    Serial.println(F("OLED failed"));
    while (true);
  }
  
  display.clearDisplay();
  display.display();
  
  // Play boot sequence
  playBootSequence();
}

void loop() {
  if (!bootComplete) return;
  
  // Refresh HUD every 200ms
  if (millis() - lastFrameTime > 200) {
    lastFrameTime = millis();
    drawHUD();
  }
  
  // Check for serial commands (from AIRPATH route planner)
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    handleCommand(cmd);
  }
}

void playBootSequence() {
  for (int i = 0; i < bootFrames; i++) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    
    // Show previous lines dimmed
    display.setTextColor(SSD1306_WHITE);
    for (int j = 0; j < i; j++) {
      display.setCursor(4, j * 10 + 4);
      display.print(bootSequence[j]);
      display.drawLine(4, j * 10 + 13, 124, j * 10 + 13, SSD1306_WHITE);
      display.drawLine(4, j * 10 + 13, 124, j * 10 + 13, SSD1306_WHITE);
    }
    
    // Current line bright (inverted)
    display.fillRect(0, i * 10 + 2, 128, 12, SSD1306_WHITE);
    display.setTextColor(SSD1306_BLACK);
    display.setCursor(4, i * 10 + 4);
    display.print(bootSequence[i]);
    
    display.display();
    delay(600);
  }
  
  // Boot complete flash
  display.fillRect(0, 0, 128, 64, SSD1306_WHITE);
  display.display();
  delay(100);
  display.fillRect(0, 0, 128, 64, SSD1306_BLACK);
  display.display();
  delay(100);
  
  bootComplete = true;
  drawHUD();
}

void drawHUD() {
  display.clearDisplay();
  
  // ── Top bar: SKYRA logo + battery ──
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(2, 0);
  display.print("SKYRA");
  
  // Battery indicator
  int batX = 98;
  display.drawRect(batX, 1, 26, 9, SSD1306_WHITE);
  display.fillRect(batX + 26, 3, 3, 5, SSD1306_WHITE); // tip
  int batFill = map(status.batteryLevel, 0, 100, 0, 22);
  display.fillRect(batX + 2, 3, batFill, 5, SSD1306_WHITE);
  display.setCursor(batX + 4, 1);
  display.setTextSize(1);
  display.print(status.batteryLevel);
  display.print("%");
  
  // ── Divider ──
  display.drawLine(0, 11, 128, 11, SSD1306_WHITE);
  
  // ── Main info ──
  display.setTextSize(1);
  display.setCursor(2, 14);
  display.print(F("MODE:"));
  display.setCursor(38, 14);
  display.print(status.routeReady ? F("READY") : F("STANDBY"));
  
  display.setCursor(2, 24);
  display.print(F("ALT:"));
  display.setCursor(30, 24);
  display.print(status.altitude, 1);
  display.print(F("m"));
  
  display.setCursor(2, 34);
  display.print(F("SPD:"));
  display.setCursor(30, 34);
  display.print(status.speed, 1);
  display.print(F("m/s"));
  
  display.setCursor(2, 44);
  display.print(F("RTE:"));
  display.setCursor(30, 44);
  display.print(status.routeReady ? F("ACTIVE") : F("NONE"));
  
  // ── Bottom status bar ──
  display.drawLine(0, 54, 128, 54, SSD1306_WHITE);
  display.setCursor(2, 56);
  display.print(status.helmConnected ? F("H") : F("-"));
  display.setCursor(14, 56);
  display.print(status.suitSynced ? F("S") : F("-"));
  display.setCursor(26, 56);
  display.print(status.speechActive ? F("V") : F("-"));
  
  // Right-aligned warning zone
  char altWarning = status.altitude > 500 ? '!' : ' ';
  display.setCursor(120, 56);
  display.print(altWarning);
  
  display.display();
}

void handleCommand(String cmd) {
  cmd.trim();
  
  if (cmd.startsWith("ALT:")) {
    status.altitude = cmd.substring(4).toFloat();
  } else if (cmd.startsWith("SPD:")) {
    status.speed = cmd.substring(4).toFloat();
  } else if (cmd.startsWith("RTE:")) {
    status.routeReady = cmd.substring(4) == "1";
  } else if (cmd.startsWith("BAT:")) {
    status.batteryLevel = cmd.substring(4).toInt();
  } else if (cmd == "STATUS") {
    // Print status back to serial for AIRPATH
    Serial.print("ALT:"); Serial.println(status.altitude);
    Serial.print("SPD:"); Serial.println(status.speed);
    Serial.print("BAT:"); Serial.println(status.batteryLevel);
    Serial.print("HLM:"); Serial.println(status.helmConnected ? 1 : 0);
    Serial.print("SUT:"); Serial.println(status.suitSynced ? 1 : 0);
  }
}