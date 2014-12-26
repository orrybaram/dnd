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
        character = Character()
        character.put()
        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps({'success': True}))

class CharacterHandler(webapp2.RequestHandler):
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
    ('/api/v1/character/(?P<character_key>[^/]+)/?', CharacterHandler),
    

], debug=True)
