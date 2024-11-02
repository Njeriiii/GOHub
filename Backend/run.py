import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    environment = app.config["ENV"]
    debug = environment == "development"

    # Modification to run in development and production
    port = int(os.environ.get("PORT", 5162))
    app.run(host="0.0.0.0", port=port, debug=debug)

