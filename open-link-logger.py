#!/usr/bin/env python3
import subprocess
import json
import logging
import configparser
import os
import requests
import sys
import time

file_name = '/home/szymon/Apps/my-netspeed-loger/data.json'

# Application confing
config = configparser.ConfigParser()
config.read('config.txt')

file_name = config['DEFAULT']['data-path']
first_run = config['DEFAULT']['first-run']
test_reiteration = config['DEFAULT']['test-reiteration']
port = config['DEFAULT']['port']
test_count = 0

# colors
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


# Logging
logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

logging.info('Starting Open-Link-Logger...')

def check_if_first_run():
    if first_run == "true":
        print(f'{bcolors.OKGREEN}\
            #####################################################################################\n\
            ##   ▌ ▌   ▜               ▐      ▞▀▖            ▌  ▗    ▌     ▌                   ##\n\
            ##   ▌▖▌▞▀▖▐ ▞▀▖▞▀▖▛▚▀▖▞▀▖ ▜▀ ▞▀▖ ▌ ▌▛▀▖▞▀▖▛▀▖▄▄▖▌  ▄ ▛▀▖▌▗▘▄▄▖▌  ▞▀▖▞▀▌▞▀▌▞▀▖▙▀▖  ##\n\
            ##   ▙▚▌▛▀ ▐ ▌ ▖▌ ▌▌▐ ▌▛▀  ▐ ▖▌ ▌ ▌ ▌▙▄▘▛▀ ▌ ▌   ▌  ▐ ▌ ▌▛▚    ▌  ▌ ▌▚▄▌▚▄▌▛▀ ▌    ##\n\
            ##   ▘ ▘▝▀▘ ▘▝▀ ▝▀ ▘▝ ▘▝▀▘  ▀ ▝▀  ▝▀ ▌  ▝▀▘▘ ▘   ▀▀▘▀▘▘ ▘▘ ▘   ▀▀▘▝▀ ▗▄▘▗▄▘▝▀▘▘    ##\n\
            ###################################################################################{bcolors.ENDC}\n\n\
            {bcolors.OKBLUE}Using this script you can check you internet connection status as often as you want\n\
            and every test will be sotored localy and you can see results in your browser.{bcolors.ENDC}\n\n\
            {bcolors.WARNING}This is Open Source software released under MIT licence and is provided "AS IS" without\n\
            any warranty on any kind!\n\n\
            {bcolors.OKCYAN}Author{bcolors.ENDC}:       Szymon Waliczek\n\
            {bcolors.OKCYAN}Contact{bcolors.ENDC}:      waliczek.szymon@gmail.com\n\
            {bcolors.OKCYAN}Instructions{bcolors.ENDC}: https://github.com/majster-pl/open-link-logger/blob/main/README.md\n\
            {bcolors.OKCYAN}Source Code{bcolors.ENDC}:  https://github.com/majster-pl/open-link-logger\n\
            ')
        q_procceed = input("Do you want to continue ? (y/N)\n")
        if q_procceed not in ['y', 'Y', 'Yes', 'yes']:
            print("See you again soon! :)")
            sys.exit()

        print(f'In next few steps you will set up few important parameters\n')

        # setting up web server port
        q_port = input(
            f"[1/3] What port do you want web server to run? {bcolors.HEADER}[3900]{bcolors.ENDC}: ")
        if q_port:
            print(f'Port set to: {bcolors.OKGREEN} {q_port} {bcolors.ENDC}')
        else:
            q_port = 3900
            print(f'Port set to: {bcolors.OKGREEN} {q_port} {bcolors.ENDC}')
        config['DEFAULT']['port'] = str(q_port)

        # path to data.json file
        default_path = os.getcwd() + "/data.json"
        q_data_path = input(
            f"\n[2/3] Specify the path where you want data to be collected {bcolors.HEADER}[{default_path}] {bcolors.ENDC}: ")
        if q_data_path:
            print(
                f'Path set to: {bcolors.OKGREEN} {q_data_path} {bcolors.ENDC}')
        else:
            q_data_path = default_path
            print(
                f'Path set to: {bcolors.OKGREEN} {q_data_path} {bcolors.ENDC}')
        config['DEFAULT']['datapath'] = str(q_data_path)

        print(f'To have this ')
        # frequency of running a test
        # q_freq = input(
        #     f"[3/3] How ofter do you want speed test to run and collect data? {bcolors.HEADER}[4]{bcolors.ENDC}:\n\
        #     (this operation will append entry in your crontab file)\n\
        #     1 => Once a day @ 12:00\n\
        #     2 => Once a day @ 00:00\n\
        #     3 => Twice a day @ 12:00 and 00:00\n\
        #     4 => Every hour @ 00 minutes past\n\
        #     5 => Every hour @ 30 minutes past\n\
        #     6 => Every hour twice @ 00 & 30 minutes past\n\
        #     7 => Do not add to crontab (you will have to run this script manually every time you want to collect data)\n\
        #       ")
        # if q_freq:
        #     q_freq = 4
        #     print(f'Port set to: {bcolors.OKGREEN} {q_freq} {bcolors.ENDC}')
        # else:
        #     q_freq = 3900
        #     print(f'Port set to: {bcolors.OKGREEN} {q_freq} {bcolors.ENDC}')
        # config['DEFAULT']['port'] = str(q_freq)

        with open('config.txt', 'w') as configfile:
            config.write(configfile)

        # test = 'crontab -l 2>/dev/null | cat - <(echo "*/15 * * * * /usr/bin/python3 ~/Apps/my-netspeed-loger/my-netspeed-loger.py >> ~/Apps/my-netspeed-loger/crontab_jobs.log 2>&1") | crontab -'
        # pro = subprocess.run(["crontab", "-l", "2>/dev/null", "|", "cat", "-",
                    #    "<(echo */15 * * * * /usr/bin/python3 ~/Apps/my-netspeed-loger/my-netspeed-loger.py >> ~/Apps/my-netspeed-loger/crontab_jobs.log 2>&1)", "|", "crontab", "-"])
        # pro = subprocess.run(test)
        # print(pro.returncode)
        # os.system(test)
        # subprocess.run(
        #    [test], stdout=None, stderr=None)

        # sys.exit()


def start_local_webserver():
    # try to connect to local server if running don't start another server
    try:
        get = requests.get(f'http://localhost:{port}')
        if get.status_code == 200:
            logging.info(f"Server already running on: http://localhost:{port}")
            return
        else:
            logging.warning(
                f"Posible problem with server on: http://localhost:{port}")
            logging.warning(f"Error code: {get.status_code}")
            return
    except:
        logging.info(f"Starting local server on port: {port}")
        print(f"Starting local server...")
        subprocess.Popen(
            ["node", "app.js", "-p", port, "-d", file_name], stdout=None, stderr=None)
        return


def save_results(new_data, filename=file_name):
    # function to append new results to json file.
    with open(filename, 'r+') as file:
        file_data = json.load(file)
        file_data["speedtest"].append(new_data)
        file.seek(0)
        # convert back to json.
        json.dump(file_data, file, indent=4)
        logging.info(f"Results added to {filename}")


def run_speedtest_cli():
    global test_count
    test_count += 1
    logging.info(f'Speedtest attempt no: {test_count}/{test_reiteration}')
    proc = subprocess.Popen(
        ['speedtest-cli', '--timeout', '30', '--json'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    (stdout, stderr) = proc.communicate()
    pros_status = proc.wait()

    if pros_status == 0:
        logging.info('Test completed successfully')
        return json.loads(stdout)
        # return False
    else:
        logging.critical('Speedtest failed, check error message below')
        logging.info(stderr[2:])
        return False


check_if_first_run()
start_local_webserver()
result = run_speedtest_cli()

while not result:
    if test_count < int(test_reiteration):
        logging.error('Test failed')
        logging.info('Attempting to run test again in 5 seconds...')
        time.sleep(5)
        result = run_speedtest_cli()
    else:
        logging.error('Test failed')
        logging.info('Exiting aplication.')
        break

if result:
    save_results(result)

print(f"########## END ##########")