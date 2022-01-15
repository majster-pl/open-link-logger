#!/usr/bin/env python3
from asyncio.log import logger
import subprocess
import json
import logging
import configparser
import os
import requests
import sys
import time
import os.path

# file_name = '/home/szymon/Apps/my-netspeed-loger/data.json'

# Application confing
config = configparser.ConfigParser()
files = ['open-link.conf']
dataset = config.read(files)
if len(dataset) != len(files):
    logging.info(f"Config file don't exist, creating one...")
    config["Default"] = {
        'first-run': 'true',
        'data-path': '',
        'test-reiteration': 3,
        'port': 3900
    }
    with open("open-link.conf", "w") as file_object:
        config.write(file_object)
        logging.info("Config file 'open-link.conf' created")

config.read('open-link.conf')

file_name = config['Default']['data-path']
first_run = config['Default']['first-run']
test_reiteration = config['Default']['test-reiteration']
port = config['Default']['port']
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

# def check_if_config_file_exist():
#     if(os.path.isfile())


def check_if_first_run():
    if first_run == "true":
        print(f'{bcolors.OKGREEN}\
# \n\
# \n\
# ▌ ▌   ▜               ▐       ▞▀▖            ▌  ▗    ▌     ▌                    ##\n\
# ▌▖▌▞▀▖▐ ▞▀▖▞▀▖▛▚▀▖▞▀▖ ▜▀ ▞▀▖  ▌ ▌▛▀▖▞▀▖▛▀▖▄▄▖▌  ▄ ▛▀▖▌▗▘▄▄▖▌  ▞▀▖▞▀▌▞▀▌▞▀▖▙▀▖   ##\n\
# ▙▚▌▛▀ ▐ ▌ ▖▌ ▌▌▐ ▌▛▀  ▐ ▖▌ ▌  ▌ ▌▙▄▘▛▀ ▌ ▌   ▌  ▐ ▌ ▌▛▚    ▌  ▌ ▌▚▄▌▚▄▌▛▀ ▌     ##\n\
# ▘ ▘▝▀▘ ▘▝▀ ▝▀ ▘▝ ▘▝▀▘  ▀ ▝▀   ▝▀ ▌  ▝▀▘▘ ▘   ▀▀▘▀▘▘ ▘▘ ▘   ▀▀▘▝▀ ▗▄▘▗▄▘▝▀▘▘     ##\n\
# \n\
# {bcolors.ENDC}\n\n\
{bcolors.OKBLUE}Using this script you can check you internet connection speed as often as you want\n\
and every test will be sotored localy. Results can then be viewed in your browser.{bcolors.ENDC}\n\n\
{bcolors.WARNING}This is Open Source software released under MIT licence and is provided "AS IS" without\n\
any warranty on any kind!\n\n\
{bcolors.OKCYAN}Author{bcolors.ENDC}:       Szymon Waliczek\n\
{bcolors.OKCYAN}Contact{bcolors.ENDC}:      waliczek.szymon@gmail.com\n\
{bcolors.OKCYAN}Instructions{bcolors.ENDC}: https://github.com/majster-pl/open-link-logger/blob/main/README.md\n\
{bcolors.OKCYAN}Source Code{bcolors.ENDC}:  https://github.com/majster-pl/open-link-logger\n\
')
        q_procceed = input("Do you want to continue ? (y/N)")
        if q_procceed not in ['y', 'Y', 'Yes', 'yes']:
            print("See you again soon! :)")
            sys.exit()

        print(f'In next few steps you will set up few important parameters\n')

        # setting up web server port
        while True:
            try:
                q_port = int(input(
                    f"[1/4] What port do you want a web server to run on? {bcolors.HEADER}[3900]{bcolors.ENDC}:"))
                break
            except ValueError:
                print("Please enter valid port number...")  

        if q_port:
            print(f'Port set to: {bcolors.OKGREEN} {q_port} {bcolors.ENDC}')
        else:
            q_port = 3900
            print(f'Port set to: {bcolors.OKGREEN} {q_port} {bcolors.ENDC}')
        config['Default']['port'] = str(q_port)
        # q_port = int(input(
        #     f"[1/4] What port do you want a web server to run on? {bcolors.HEADER}[3900]{bcolors.ENDC}:"))

        # path to data.json file
        Default_path = os.getcwd() + "/data.json"
        q_data_path = input(
            f"\n[2/4] Specify the path where you want data to be collected {bcolors.HEADER}[{Default_path}] {bcolors.ENDC}:")
        if q_data_path:
            print(
                f'Path set to: {bcolors.OKGREEN} {q_data_path} {bcolors.ENDC}')
        else:
            q_data_path = Default_path
            print(
                f'Path set to: {bcolors.OKGREEN} {q_data_path} {bcolors.ENDC}')
        config['Default']['data-path'] = str(q_data_path)

        # Number of test reiterations
        default_reiteration = 3
        q_reiteration = input(
            f"\n[3/4] How many times you want test to retry connect to server before exiting the app (if added to crontab, sometimes many tests running at the same time and blocking servers from respodning). {bcolors.HEADER}[{default_reiteration}] {bcolors.ENDC}:")
        if not q_reiteration:
            q_reiteration = default_reiteration
        print(
            f'Sppedtest retry set to: {bcolors.OKGREEN} {q_reiteration} {bcolors.ENDC}')
        config['Default']['test-reiteration'] = str(q_reiteration)

        # Add to crontab
        default_crontab = 7
        entires = {
            1: ' * 12 * * * ',
            2: ' * 00 * * * ',
            3: ' * 12,00 * * * ',
            4: ' 00 * * * * ',
            5: ' 30 * * * * ',
            6: ' */30 * * * * ',
        }
        entires_text = {
            1: 'Once a day @ 12:00',
            2: 'Once a day @ 00:00',
            3: 'Twice a day @ 12:00 and 00:00',
            4: 'Every hour @ 00 hours',
            5: 'Every hour @ 30 minutes past',
            6: 'Every hour @ 30 minutes past',
        }

        q_crontab = int(input(
f"\n[4/4] If you want your internet test to be run automaticaly, it can be added to crontab, check out options below {bcolors.HEADER}[{default_crontab}]{bcolors.ENDC}:\n\
Once you choose one of options below, selected will be added to your crontab.\n\
    1 => {entires_text[1]}\n\
    2 => {entires_text[2]}\n\
    3 => {entires_text[3]}\n\
    4 => {entires_text[4]}\n\
    5 => {entires_text[5]}\n\
    6 => {entires_text[6]}\n{bcolors.HEADER}\
    7 => Do not add to crontab (I'll run this script manually whenever I want){bcolors.ENDC}\n\
"))
        if not q_crontab:
            q_crontab = default_crontab
            print(f'Nothing added to crontab.')
        else:
            command = f'crontab -l | {{ cat; echo "{entires[q_crontab]} cd {os.getcwd()} && /usr/bin/python3 open-link-logger.py >> crontam_jobs.log 2>&1"; }} | crontab -'
            print(
                f'Test will run: {bcolors.OKGREEN} {entires_text[q_crontab]} {bcolors.ENDC}')
            os.system(command)
            print('New entry added to crontab, to edit run "crontab -e" in terminal')

        config['Default']['first-run'] = 'false'
        with open('open-link.conf', 'w') as configfile:
            config.write(configfile)

        # test = 'crontab -l 2>/dev/null | cat - <(echo "*/15 * * * * /usr/bin/python3 ~/Apps/my-netspeed-loger/my-netspeed-loger.py >> ~/Apps/my-netspeed-loger/crontab_jobs.log 2>&1") | crontab -'
        # pro = subprocess.run(["crontab", "-l", "2>/dev/null", "|", "cat", "-",
            #    "<(echo */15 * * * * /usr/bin/python3 ~/Apps/my-netspeed-loger/my-netspeed-loger.py >> ~/Apps/my-netspeed-loger/crontab_jobs.log 2>&1)", "|", "crontab", "-"])
        # pro = subprocess.run(test)
        # print(pro.returncode)
        # os.system(test)
        # subprocess.run(
        #    [test], stdout=None, stderr=None)
        print(
            f'{bcolors.FAIL}Run ./open-link-logger.py again to get you first test ;) - enjoy!{bcolors.ENDC}')
        sys.exit()


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
        # print(f"Starting local server...")
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
