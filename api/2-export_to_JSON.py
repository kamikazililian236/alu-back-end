#!/usr/bin/python3
"""Export employee TODO list data to JSON format."""
import json
import requests
import sys


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(1)
    employee_id = int(sys.argv[1])
    base_url = "https://jsonplaceholder.typicode.com"
    user = requests.get(
        "{}/users/{}".format(base_url, employee_id)
    ).json()
    username = user.get("username")
    todos = requests.get(
        "{}/todos".format(base_url), params={"userId": employee_id}
    ).json()
    task_list = [
        {
            "task": task.get("title"),
            "completed": task.get("completed"),
            "username": username
        }
        for task in todos
    ]
    filename = "{}.json".format(employee_id)
    with open(filename, mode="w") as jsonfile:
        json.dump({str(employee_id): task_list}, jsonfile)
