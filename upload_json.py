import webapp2
import update_schema
from google.appengine.ext import deferred, ndb
import logging
import os
import json
from pprint import pprint

from models import *

class UploadJSON(webapp2.RequestHandler):
    def get(self):
        skipped_feats = 0
        added_feats = 0
        skipped_items = 0
        added_items = 0
        skipped_powers = 0
        added_powers = 0

        ###### UPLOAD FEATS ######
        with open('src/data/feats/feats.json') as data_file:    
            data = json.load(data_file)

        for item in data:
            feat = Feat.all().filter('feat_id = ', item.get('id')).fetch(1)
            if feat:
                logging.info("skipping feat")
                skipped_feats += 1
                continue
            else:
                logging.info("putting feat %s" % item.get('name'))
                feat = Feat()
                feat.feat_id = item.get('id')
                feat.name = item.get('name')
                feat.slug = feat.name.lower()
                feat.json_string = json.dumps(item)
                feat.put()
                added_feats += 1

        ###### UPLOAD ITEMS ######
        with open('src/data/items/items.json') as data_file:    
            data = json.load(data_file)

        for item in data:
            _item = Item.all().filter('item_id = ', item.get('id')).fetch(1)
            if _item:
                logging.info("skipping item")
                skipped_items += 1
                continue
            else:
                logging.info("putting item %s" % item.get('name'))
                _item = Item()
                _item.item_id = item.get('id')
                _item.name = item.get('name')
                _item.slug = _item.name.lower()
                _item.json_string = json.dumps(item)
                _item.put()
                added_items += 1

        # ###### UPLOAD POWERS ######
        with open('src/data/powers/powers.json') as data_file:    
            data = json.load(data_file)

        for power in data:
            _power = Power.all().filter('power_id = ', power.get('id')).fetch(1)
            if _power:
                logging.info("skipping power")
                skipped_powers += 1
                continue
            else:
                logging.info("putting power %s" % power.get('name'))
                _power = Power()
                _power.power_id = power.get('id')
                _power.name = power.get('name')
                _power.slug = _power.name.lower()
                _power.json_string = json.dumps(power)
                _power.put()
                added_powers += 1

        self.response.out.write("""
            <h1>Done.</h1>
            <h2>Feats</h2>
            <p>Skipped: %d</p>
            <p>Added: %d</p>
            <h2>Items</h2>
            <p>Skipped: %d</p>
            <p>Added: %d</p>
            <h2>Powers</h2>
            <p>Skipped: %d</p>
            <p>Added: %d</p>
        """ % (skipped_feats, added_feats, skipped_items, added_items, skipped_powers, added_powers))

app = webapp2.WSGIApplication([('/upload_json', UploadJSON)])