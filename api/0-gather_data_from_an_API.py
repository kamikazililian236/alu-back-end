#!/usr/bin/python3
"""Display an employee's TODO list progress using a REST API."""
import requests
import sys

if __name__ == "__main__":
    employee_id = int(sys.argv[1])
    url = "https://jsonplaceholder.typicode.com/"

    user = requests.get(url + "users/{}".format(employee_id)).json()
    todos = requests.get(
        url + "todos", params={"userId": employee_id}).json()

    done = [task for task in todos if task.get("completed")]

    print("Employee {} is done with tasks({}/{}):".format(
        user.get("name"), len(done), len(todos)))
    for task in done:
        print("\t {}".format(task.get("title")))
