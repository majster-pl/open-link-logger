![enter image description here](https://github.com/majster-pl/open-link-logger/raw/main/img/logo-with-title.png)

# Open-Link-Logger

Open Link Logger is a simple python script which will test your internet connection speed and display results in browser as chart. It has been tested on Ubuntu based Linux distributions.


## Requirements

Before you start using this software make sure you have following installed on your system:
 - [speedtest-cli](https://www.speedtest.net/apps/cli) installed on the system.
 - Python3

## Compatibility

This software was tested on Ubuntu Linux and might not work on other distributions available on this planet. Feel free to test it and report if that works on other distributions or even better if that doesn't work on your system consider [contributing](https://github.com/majster-pl/open-link-logger) to this project by fixing the issue :)

## Installation

.1 Install **speedtest-cli**, **nodejs**, **npm**

    sudo apt install speedtest-cli nodejs

.2 Download project *(make sure you download project to final destination, if project path will be changed crontab jobs will not work anymore until crontab entry updated).*

    git clone https://github.com/majster-pl/open-link-logger.git && cd open-link-logger

.3 Install dependencies

    npm install

.4 Run script and follow instruction on screen to set up application.

    ./open-link-logger
.5 Edit crontab to you preferences

    crontab -e

## Usage
After installing application you can access your test results on browser, default address will be:
[http://localhost:3900/](http://localhost:3900/)

If you want to run test just navigate to application folder and execute:

    ./open-link-logger.py


## Licence

**MIT License**
Copyright (c) 2022 Szymon Waliczek

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[MIT license](https://opensource.org/licenses/MIT)

