#!/usr/bin/python3
"""Export the TODO lists of all employees to a JSON file."""
import json
import requests

if __name__ == "__main__":
    url = "https://jsonplaceholder.typicode.com/"
    users = requests.get(url + "users").json()
    todos = requests.get(url + "todos").json()

    data = {}
    for user in users:
        user_id = user.get("id")
        data[str(user_id)] = [
            {"username": user.get("username"),
             "task": task.get("title"),
             "completed": task.get("completed")}
            for task in todos if task.get("userId") == user_id]

    with open("todo_all_employees.json", "w") as file:
        json.dump(data, file)
