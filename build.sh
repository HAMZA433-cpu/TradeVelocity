#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r backend/requirements.txt

# Créer les tables de la base de données
python backend/create_database.py
