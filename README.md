# ESP32 Lissajous WebSockets

This Web App plots and prints the data sent by an ESP32 microcontroller, programmed with the Arduino IDE open-source software, to act as a webserver using WebSockets to communicate with client browsers in a bidirectional way.

The ESP32 is programmed with the ESP32_Lissajous.ino code provided to send two sinusoidal signals, with programmable frequencies and phases, in columns separated by one space. In turn, the Web App provided plots these signals and their resulting Lissajous curve. The client browser also controls various parameters that can be changed on the ESP32 webserver. 

This Web App can be easily modified to serve as the basis of a data acquisition system in projects where an ESP32, or any other microcontroller, feeds data into a computer by using WebSockets. 

## Usage

- Clone the repository
- Program the ESP32 module with the ESP32_Lissajous.ino code provided using the Arduino IDE software.
- Open the file index.html with any web browser on the same local network and connect to the ip address of the ESP32 server provided on the serial monitor (9600 baud) of the Arduino IDE application.

## Wep page 
- Note: It just displays the front-end of the web page, to make it work install the code provided on your local network and open the index.html file with any browser

https://ciiec.buap.mx/ESP32-Lissajous-WebSockets/


## License

[MIT](LICENSE)
