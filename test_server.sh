#!/bin/bash


# git clone the repo

# cd to the cloned repo directory


# Create the container image, this will use the Dockerfile

docker build -t xmeme_app .

# Run the app container on port 8081

docker run -d --net="host" xmeme_app

# Run sleep.sh

chmod +x sleep.sh

./sleep.sh


# Execute the POST /memes endpoint using curl

curl --location --request POST 'http://localhost:8081/memes' --header 'Content-Type: application/json' --data-raw '{"name": "xyz","url": "abc.com","caption": "This is a meme"}'


# Execute the GET /memes endpoint using curl

curl --location --request GET 'http://localhost:8081/memes'