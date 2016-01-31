import webapp2
import update_schema
from google.appengine.ext import deferred
import logging
import os
import json
from pprint import pprint

class UploadFeats(webapp2.RequestHandler):
    def get(self):
        logging.info("FART")

        with open('src/data/feats.json') as data_file:    
            data = json.load(data_file)

        for item in data:
            logging.info(item)



app = webapp2.WSGIApplication([('/upload_json', UploadFeats)])