Verify creation of database tables:
```
cd Backend
python verify_db.py
```

# Local migration with model changes
```
cd Backend

Ensure DATABASE_URL points to SQLite
```bash
export $(cat .env | xargs)  # Contains DATABASE_URL=sqlite:///db.sqlite
```
python manage_db.py

# Commit the migration files
git add migrations/
git commit -m "Add database migrations"
git push
```