from app import create_app

app = create_app()

if __name__ == "__main__":
    environment = app.config["ENV"]

    app.run(host="0.0.0.0", debug=True, port=5162)
