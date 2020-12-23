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
#include <curl/curl.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <errno.h>
using namespace std;

int isDisconnected2() {
    string cmd = "curl ident.me --max-time 3";
    char buffer[128];
    string result = "";
    FILE* pipe = popen(cmd.c_str(), "r");
    if (!pipe) throw runtime_error("popen() failed!");
    try {
        while (fgets(buffer, sizeof buffer, pipe) != NULL) {
            if (strstr(buffer, "Resolving timed out")) {
                cout << "Dis" << endl;
                pclose(pipe);
                return 1;
            }
            else {
                cout << "Con" << endl;
                pclose(pipe);
                return 0;
            }
        }
    } catch (...) {
        pclose(pipe);
        throw;
    }
    pclose(pipe);

    return 1;
}

int main (){
    jetsonTX2GPIONumber led1 = gpio398; // green
    jetsonTX2GPIONumber led2 = gpio389; // red
    jetsonTX2GPIONumber led3 = gpio396; // blue
    gpioExport(led1);
    gpioExport(led2);
    gpioExport(led3);
    gpioSetDirection(led1, outputPin);
    gpioSetDirection(led2, outputPin);
    gpioSetDirection(led3, outputPin);
    gpioSetValue(led1, 0);   // green on
    gpioSetValue(led2, 1);   // red off
    gpioSetValue(led3, 1);   // blue off
    while (1) {
        if (isDisconnected2() == 1) {
            cout << "Disconnected" << endl;
            gpioSetValue(led1, 1);  // green off
            gpioSetValue(led2, 0);  // red on
        }
	else{
            cout << "Connected" << endl;
            gpioSetValue(led1, 0);   // green on
            gpioSetValue(led2, 1);   // red off
	}
    }
    gpioUnexport(led1);
    gpioUnexport(led2);
    gpioUnexport(led3);
    return 0;
}
