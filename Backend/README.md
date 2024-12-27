Verify creation of database tables:
```
cd Backend
python verify_db.py
```

# Local migration with model changes
```
cd Backend
python manage_db.py

# Commit the migration files
git add migrations/
git commit -m "Add database migrations"
git push
```