#!/usr/bin/python3
"""Script that gathers data from an API and exports all employees to JSON."""
import json
import requests


if __name__ == "__main__":
    base_url = "https://jsonplaceholder.typicode.com"

    # Fetch all users
    users_response = requests.get(f"{base_url}/users")
    users = users_response.json()

    # Fetch all todos
    todos_response = requests.get(f"{base_url}/todos")
    todos = todos_response.json()

    # Build a lookup dict: user_id -> username
    user_lookup = {user.get("id"): user.get("username") for user in users}

    all_data = {}

    for user in users:
        user_id = user.get("id")
        username = user.get("username")
        user_tasks = [
            {
                "username": username,
                "task": task.get("title"),
                "completed": task.get("completed")
            }
            for task in todos
            if task.get("userId") == user_id
        ]
        all_data[str(user_id)] = user_tasks

    filename = "todo_all_employees.json"

    with open(filename, mode="w") as jsonfile:
        json.dump(all_data, jsonfile)
