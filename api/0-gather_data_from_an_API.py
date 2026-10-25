#!/usr/bin/python3
"""Script that gathers data from an API and displays TODO list progress."""
import requests
import sys


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 0-gather_data_from_an_API.py <employee_id>")
        sys.exit(1)

    employee_id = int(sys.argv[1])
    base_url = "https://jsonplaceholder.typicode.com"

    # Fetch user info
    user_response = requests.get(f"{base_url}/users/{employee_id}")
    user = user_response.json()
    employee_name = user.get("name")

    # Fetch todos for the employee
    todos_response = requests.get(
        f"{base_url}/todos", params={"userId": employee_id}
    )
    todos = todos_response.json()

    total_tasks = len(todos)
    done_tasks = [task for task in todos if task.get("completed")]
    number_of_done_tasks = len(done_tasks)

    print(
        f"Employee {employee_name} is done with tasks"
        f"({number_of_done_tasks}/{total_tasks}):"
    )

    for task in done_tasks:
        print(f"\t {task.get('title')}")
