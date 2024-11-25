Create database tables:
```
cd backend
python create_db.py
```

# Local migration with model changes
```
cd Backend
flask db migrate -m "Description of changes"
flask db upgrade

# Commit the migration files
git add migrations/
git commit -m "Add database migrations"
git push
```