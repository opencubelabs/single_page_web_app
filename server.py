from bottle import Bottle, run, route, static_file, request, response, template, redirect
from pymongo import MongoClient
from bson.json_util import dumps
from string import Template
import json
import pymongo
import requests
import datetime
import time
import math
import hashlib as hl
import os

app = Bottle(__name__)

client = MongoClient('mongodb://heroku_rm1l8fcm:l7a6ba5r71tvl8rqujfpui5113@ds157653.mlab.com:57653/heroku_rm1l8fcm')
db = client.heroku_rm1l8fcm

# HOST = 'https://toteyes.herokuapp.com/'
HOST = 'http://localhost:8083/'

@app.route('/')
def root():
	# if(str(request.get_cookie('tot_token')) == 'tot_token_value'):
	# 	return '<h1>toteyes home</h1>'
	# else:
	# return static_file('index.html', root='templates/')

	return "Hey there!! :D"

@app.route('/hello/<name>')
def hello(name):
	return "Hello, "+name

@app.route('/test')
def test():
	cur = db.test.insert({'name': 'Test from server'})
	cur = db.test.find()
	data = json.loads(dumps(cur))

	return dumps(cur)



######################### APIs #########################



# Static Routes
@app.route('/<filename:re:.*\.js>')
def javascripts(filename):
    return static_file(filename, root='static')

@app.route('/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root='static')

@app.route('/<filename:re:.*\.(jpg|png|gif|ico|svg)>')
def images(filename):
    return static_file(filename, root='static')

@app.route('/<filename:re:.*\.(eot|ttf|woff|svg)>')
def fonts(filename):
    return static_file(filename, root='static')

@app.route('/<filename:re:.*\.html>')
def javascripts(filename):
    return static_file(filename, root='static')

@app.hook('after_request')
def enable_cors():
	response.headers['Access-Control-Allow-Origin'] = '*'
	response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
	response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'