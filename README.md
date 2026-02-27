Diploma Project: Interactive Game with Dynamic Mob Spawning
This repository contains the source code for my diploma thesis project.

The project demonstrates an interactive game where the environment can be modified in real-time via a web interface. The core functionality allows users to add new mobs (NPCs/entities) to the game world through a website.

How it works:

Web Interface: A user submits coordinates for a new mob through a dedicated website.

Database: The data is stored in a database.

Game Loop: Every 5 seconds, the game client polls a custom API endpoint to fetch the latest mob coordinates.

Dynamic Update: The game retrieves this data and spawns or updates the mobs in the world accordingly.

This architecture creates a simple but effective interactive experience, allowing external input to directly influence the game state.
