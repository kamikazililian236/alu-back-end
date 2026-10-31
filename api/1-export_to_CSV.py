#!/usr/bin/python3
"""Export an employee's TODO list to a CSV file."""
import csv
import requests
import sys

if __name__ == "__main__":
    employee_id = int(sys.argv[1])
    url = "https://jsonplaceholder.typicode.com/"

    user = requests.get(url + "users/{}".format(employee_id)).json()
    todos = requests.get(
        url + "todos", params={"userId": employee_id}).json()

    with open("{}.csv".format(employee_id), "w", newline="") as file:
        writer = csv.writer(
            file, quoting=csv.QUOTE_ALL, lineterminator="\n")
        for task in todos:
            writer.writerow([
                employee_id, user.get("username"),
                task.get("completed"), task.get("title")])
