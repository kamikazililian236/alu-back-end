#!/usr/bin/python3
"""Export employee TODO list data to CSV format."""
import csv
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
    filename = "{}.csv".format(employee_id)
    with open(filename, mode="w", newline="") as csvfile:
        writer = csv.writer(csvfile, quoting=csv.QUOTE_ALL)
        for task in todos:
            writer.writerow([
                employee_id,
                username,
                task.get("completed"),
                task.get("title")
            ])
