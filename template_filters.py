from google.appengine.ext import webapp, db
from google.appengine.ext.webapp import template
import jinja2

import json

def to_json(value):
    return json.dumps(value)


