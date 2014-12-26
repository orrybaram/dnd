#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import webapp2
import os
import jinja2
import logging
import urlparse
import json

from models import *

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class MainHandler(webapp2.RequestHandler):
    def get(self):

        logging.info(JINJA_ENVIRONMENT)

        template = JINJA_ENVIRONMENT.get_template('src/index.html')
        self.response.write(template.render())

class CharacterCreate(webapp2.RequestHandler):
    def post(self):
        data = json.loads(self.request.body)

        character = Character()
        character.name = data.get('name')
        character.put()
        
        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(character.serializable()))

class CharacterUpdate(webapp2.RequestHandler):
    def post(self, character_key):
        data = json.loads(self.request.body)
        character = Character.get(character_key)

        for k, v in data.iteritems():
            
            if k == 'date_created' or k == 'key':
                continue
            
            value = data.get(k)

            if isinstance(value, basestring) and value.isdigit():
                value = int(value)
            
            try:
                setattr(character, k, value)
            except Exception, e:
                logging.info('===============================')
                logging.info(e)
                logging.exception(e)
                logging.exception(e)
                logging.exception(e)
                logging.info('===============================')
            
        character.put()
        
        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(character.serializable()))

class CharacterDetail(webapp2.RequestHandler):
    def get(self, character_key):
        character = Character.get(character_key)

        values = {
            'character': character.serializable()
        }

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(values))

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/api/v1/character/create/?', CharacterCreate),
    ('/api/v1/character/(?P<character_key>[^/]+)/?', CharacterDetail),
    ('/api/v1/character/(?P<character_key>[^/]+)/update/?', CharacterUpdate),
    

], debug=True)
