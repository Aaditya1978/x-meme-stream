# Importing Flask Libraries
from flask import Flask, render_template,request,jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from datetime import datetime
from pytz import timezone
import json


# Init flask app
app = Flask(__name__)

# Configure SQLALCHEMY for flask app
app.config ['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///meme_database.sqlite3'


# Make object of SQLALChemy and MArshmallow
db = SQLAlchemy(app)
ma = Marshmallow(app)

# creating datetime object
now = datetime.now()

# Creating class of database
class meme_database(db.Model):
    id = db.Column('id', db.Integer, primary_key = True)
    name = db.Column(db.String(200),nullable=False)
    caption = db.Column(db.String(300),nullable=False)
    url = db.Column(db.String(2000),nullable=False)
    date_time = db.Column(db.DateTime,nullable=False,default=datetime.now(timezone("Asia/Kolkata")))


# Creating Schema of database with marshmallow
class meme_databaseSchema(ma.SQLAlchemySchema):
    class Meta:
        model = meme_database
    id = ma.auto_field()
    name = ma.auto_field()
    caption = ma.auto_field()
    url = ma.auto_field()
    date_time = ma.auto_field()




# Route for home page i.e. Language Selection Page
@app.route('/')
def home():
    return render_template('meme.html')



# Route for Getting Meme Data if request is POST and sending Meme Data if request is GET
@app.route('/memes', methods = ['POST', 'GET'])
def memes():

    # Request method GET To send Data
    if request.method == 'GET':
        meme_schema = meme_databaseSchema(many=True)
        # Fetcheing last 100 memes from database
        datas = meme_database.query.order_by(meme_database.id.desc()).limit(100)
        # Converting to json type object
        output = meme_schema.dump(datas)
        return jsonify({'memes':output})

    # Request method post to recieve data
    elif request.method == 'POST':
        # Try except for error handling
        try:
            meme_schema = meme_databaseSchema()
            # Request the input data
            content = json.loads(request.data)
            user_name = content['name']
            cap = content['caption']
            img = content['url']

            # Checkin for duplicate Entery
            res = meme_database.query.filter_by(name=user_name,caption=cap,url=img).first()

            # Returning error if duplicate is present else adding to database
            if res is not None:
                return make_response(jsonify("Duplicate Entery"), 409)
            else:
                # Adding to database
                meme = meme_database(name=content['name'],caption=content['caption'],url=content['url'])
                db.session.add(meme)
                db.session.commit()
                # Converting to json object
                output = meme_schema.dump(meme)
                return jsonify({'memes':output})
        except:
            return make_response(jsonify("Error"), 442)



# Route to fetch data of a particular ID
@app.route('/memes/<variable>', methods=['GET'])
def daily_post(variable):
    # Gets data by meme ID
    meme_schema = meme_databaseSchema(many=True)
    res = meme_database.query.filter_by(id=int(variable)).first()
    # Checking if found or not
    if res is None:
        return make_response(jsonify("ID Not Found"), 404)
    else:
        meme_schema = meme_databaseSchema()
        output = meme_schema.dump(res)
        return jsonify(output)



# Route to Swagger UI
@app.route('/swagger-ui', methods=['GET'])
def get_docs():
    print('sending docs')
    return render_template('swaggerui.html')




# Running the Flask App
if __name__ == "__main__":

    # Setting up databse
    db.create_all()

    #running application
    app.run(port=8081)