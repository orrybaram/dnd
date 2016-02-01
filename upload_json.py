import webapp2
import update_schema
from google.appengine.ext import deferred
import logging
import os
import json
from pprint import pprint

from models import *

class UploadJSON(webapp2.RequestHandler):
    def get(self):
        
        with open('src/data/feats.json') as data_file:    
            data = json.load(data_file)

        for item in data:
            feat = Feat()
            feat.feat_id = item.get('id')
            feat.name = item.get('name')
            feat.json_string = json.dumps(item)
            feat.put()


        # with open('src/data/items.json') as data_file:
        #     data = json.load(data_file)

        # for item in data:
        #     logging.info(item)
        #     item = Item()
        #     item.json_string = json.dumps(item)
        #     item.put()





app = webapp2.WSGIApplication([('/upload_json', UploadJSON)])