#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <termios.h>
#include <time.h>
#include <sys/time.h>
#include <iostream>
#include <string>
#include <unistd.h>
#include "jetsonGPIO.h"
using namespace std;

int main(int argc, char *argv[]){

    cout << "Testing the GPIO Pins" << endl;

    jetsonTX2GPIONumber buzzer = gpio466;     // Ouput
    gpioExport(buzzer) ;
    gpioSetDirection(buzzer, outputPin) ;

    for(int i=0; i<3; i++){
        cout << "Setting the buzzer on" << endl;
        gpioSetValue(buzzer, 0);
        usleep(1000000);         // on for 100ms
        cout << "Setting the buzzer off" << endl;
        gpioSetValue(buzzer, 1);
        usleep(1000000);         // off for 100ms
    }
    gpioUnexport(buzzer);     // unexport the LED
    cout << "GPIO example finished." << endl;

    return 0;
}
