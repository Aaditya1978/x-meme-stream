# XMeme ---- Meme Stream Web App

The Repo containes the code for a web app built for meme streaming. The Application Backend is built using Flask a framework in Python and the frontend is built using HTML,CSS and JavaScript. For database Sqlite 3 is used with the help of SqlAlchemy

The Main file to run is app.py. In this file the code for Flask App is written. The App has total of 4 routes three to meme app and one to swagger-ui. Different Routes are :-

1. /memes (Method=POST) :- It takes three arguments as json data - name,caption and url. This method returns a json object which containes name,caption,url,id,date-time

2. /memes (Method=GET) :- It return list of objects of all the memes data available in database.

3. /memes/{id} (MEthod = GET) :- It takes the id as url argument and returns data of that id if available otherewise returns error for not found

4. /swagger-ui (Method = GET) :- It is the swagger-ui API for testing and documenting all the above three API's.

There is a folder called static , It containes allthe static files like images,css and js files. It containes three sub-folder for images,css and js.

There is another folder named templates, it containes the html files which renders the UI of aur Web App.

The Requirements.txt file containes all the required modules for running the app.

There is a Dockerfile , if you have docker you can use that to run the easily.
