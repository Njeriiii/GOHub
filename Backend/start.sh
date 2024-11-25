# backend/start.sh
#!/bin/sh
gunicorn --bind 0.0.0.0:5162 \
            --workers 3 \
            --timeout 120 \
            --log-level debug \
            --error-logfile - \
            --access-logfile - \
            --capture-output \
            "run:app"