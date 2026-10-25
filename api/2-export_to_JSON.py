#!/usr/bin/python3
"""Script that gathers data from an API and exports to JSON format."""
import json
import requests
import sys


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 2-export_to_JSON.py <employee_id>")
        sys.exit(1)

    employee_id = int(sys.argv[1])
    base_url = "https://jsonplaceholder.typicode.com"

    # Fetch user info
    user_response = requests.get(f"{base_url}/users/{employee_id}")
    user = user_response.json()
    username = user.get("username")

    # Fetch todos for the employee
    todos_response = requests.get(
        f"{base_url}/todos", params={"userId": employee_id}
    )
    todos = todos_response.json()

    task_list = [
        {
            "task": task.get("title"),
            "completed": task.get("completed"),
            "username": username
        }
        for task in todos
    ]

    data = {str(employee_id): task_list}

    filename = f"{employee_id}.json"

    with open(filename, mode="w") as jsonfile:
        json.dump(data, jsonfile)
