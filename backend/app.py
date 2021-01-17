from flask_cors import CORS, cross_origin
from math import floor
import random
from datetime import datetime
from flask import Flask, request
import requests
from sqlalchemy import create_engine, Column, Integer, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql.sqltypes import String
from cockroachdb.sqlalchemy import run_transaction

POKE_API_URL = 'https://pokeapi.co/api/v2/'

Base = declarative_base()

class Account(Base):
	__tablename__ = 'accounts'
	user_id = Column(Integer, primary_key=True)
	username = Column(String)
	password = Column(String)
	pokemon = relationship("Pokemon")

class Pokemon(Base):
	__tablename__ = 'pokemon'
	pokemon_id = Column(Integer, primary_key=True)
	species = Column(String)
	name = Column(String)
	level = Column(Integer)
	captured_on = Column(Date)
	owner_id = Column(Integer, ForeignKey('accounts.user_id'))

engine = create_engine(
	'{{redacted}}',
    echo=True 
)

Base.metadata.create_all(engine)

app = Flask(__name__)
CORS(app)

@app.route('/sign_up', methods=['GET', 'POST'])
@cross_origin(origin='*')
def sign_up():
	def callback(session, username, password):
		new_id = floor(random.random()*1000000)

		user = session.query(Account).filter_by(username=username)

		if user.count() > 0:
			return {'status': 'failed', 'error': 'username already exists', 'user_id': 'NONE'}

		session.add(Account(user_id =new_id, username=username, password=password))
		return {'status': 'succeeded', 'error': 'NONE', 'user_id': new_id}

	if request.method == 'POST':
		# get username and password from the post request
		req_data = request.get_json()
		username = req_data['username']
		password = req_data['password']

		# add the username and password to the database
		return run_transaction(sessionmaker(bind=engine), lambda s : callback(s, username=username, password=password))
		

@app.route('/log_in', methods=['GET', 'POST'])
@cross_origin(origin='*')
def log_in():
	def callback(session, username, password):
		user = session.query(Account).filter_by(username=username).one()

		if user.password != password:
			return {'status': 'failed', 'error': 'wrong username or password', 'user_id': 'NONE'}

		return {'status': 'succeeded', 'error': 'NONE', 'user_id': user.user_id}

	if request.method == 'POST':
		# get username and password from the post request
		req_data = request.get_json()
		username = req_data['username']
		password = req_data['password']

		# sign in the user
		return run_transaction(sessionmaker(bind=engine), lambda s : callback(s, username=username, password=password))


# adds a new pokemon to the database
@app.route('/add_pokemon', methods=['POST'])
def add_pokemon():
	def callback(session, species, name, level, captured_on, owner_id):
		new_id = floor(random.random()*1000000)

		session.add(Pokemon(
			pokemon_id = new_id,
			species = species,
			name = name,
			level = level,
			captured_on = captured_on,
			owner_id = owner_id
		))
		return {'status': 'succeeded', 'error': 'NONE', 'pokemon_id': new_id}

	req_data = request.get_json()
	species = req_data['species']
	name = req_data['name']
	level = req_data['level']
	captured_on = req_data['captured_on']
	owner_id = req_data['owner_id']

	return run_transaction(sessionmaker(bind=engine), lambda s : callback(s, species, name, level, captured_on, owner_id))


# get pokemon based on pokemon_id
@app.route('/get_pokemon', methods=['POST'])
def get_pokemon():
	def callback(session, id):
		pokemon = session.query(Pokemon).filter_by(pokemon_id=id).one()

		return {'pokemon_id': pokemon.pokemon_id, 'species': pokemon.species, 'name': pokemon.name, 'leve': pokemon.level, 'captured_on': pokemon.captured_on, 'owner_id': pokemon.owner_id}

	req_data = request.get_json()
	id = req_data['pokemon_id']

	return run_transaction(sessionmaker(bind=engine), lambda s : callback(s, id))


# API call that removes a pokemon based on the pokemon_id given
@app.route('/remove_pokemon', methods=['POST'])
def remove_pokemon():
	def callback(session, id):
		session.query(Pokemon).filter_by(pokemon_id=id).delete()
		return {'status': 'succeeded', 'error': 'NONE', 'pokemon_id': 'NONE'}
	
	req_data = request.get_json()
	id = req_data['pokemon_id']

	return run_transaction(sessionmaker(bind=engine), lambda s : callback(s, id))


@app.route('/catch_pokemon', methods=['POST'])
@cross_origin(origin='*')
def catch_pokemon():
	def callback(session, user_id, level, poke_data):
		session.add(Pokemon(
			pokemon_id = floor(random.random()*1000000),
			species = poke_data['name'],
			name = poke_data['name'],
			level = level,
			captured_on = datetime.today().date(),
			owner_id = user_id
		))
		return {'status': 'succeeded'}

	req_data = request.get_json()
	user_id = req_data['user_id']
	ball_type = req_data['ball_type']
	level = req_data['level']
	pokemon = req_data['pokemon']
	
	if 0.25 * ball_type >= random.random():
	    poke_data = requests.get(POKE_API_URL+"pokemon/{}/".format(pokemon)).json()
	    return run_transaction(sessionmaker(bind=engine), lambda s: callback(s, user_id, level, poke_data))
	else:
		return {'status': 'failed'}


if __name__ == "__main__":
	app.run(host= '0.0.0.0', port=8000, debug=True)
