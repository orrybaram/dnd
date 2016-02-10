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
from google.appengine.api import users
from google.appengine.ext.webapp import template
from google.appengine.api import channel
from google.appengine.api.datastore import Key
from google.appengine.api import images
from google.appengine.runtime import apiproxy_errors

import webapp2
import os
import jinja2
import logging
import urlparse
import json

from template_filters import  *

from models import *

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

JINJA_ENVIRONMENT.filters['to_json'] = to_json

SETTINGS_LIVE_SITE = True
DEVELOPMENT_ENVIRONMENT = os.environ['SERVER_SOFTWARE'].startswith('Development')
if DEVELOPMENT_ENVIRONMENT:
    SETTINGS_LIVE_SITE = False

class MainHandler(webapp2.RequestHandler):
    def get(self):

        current_user = users.get_current_user()
        values = {}

        if current_user:
            values["logout_url"] = users.create_logout_url('/')
            user = User.all().filter('user_id =', current_user.user_id()).get()

            if not user:
                user = User()
                user.name = str(current_user)
                user.nickname = current_user.nickname()
                user.user_id = current_user.user_id()
                user.put()


            values["SETTINGS_LIVE_SITE"] = SETTINGS_LIVE_SITE
            values["user"] = user
            values["template_values"] = {
                'user_id': user.user_id,
                'is_admin': user.is_admin
            }

            try: 
                token = channel.create_channel(user.user_id)
                values['template_values']['channel_token'] = token
            
            except apiproxy_errors.OverQuotaError, message:
                logging.error(message)
        else:
            values["login_url"] = users.create_login_url('/')

        template = JINJA_ENVIRONMENT.get_template('src/index.html')
        self.response.write(template.render(values))

class UserList(webapp2.RequestHandler):
    def get(self):

        values = []
        _users = User.all().fetch(100)
        for user in _users:
            values.append(user.serializable());

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(values))

class GroupCreate(webapp2.RequestHandler):
    def post(self):
        self.response.headers['Content-Type'] = 'application/json'
        data = json.loads(self.request.body)

        current_user = users.get_current_user()
        try:
            user = User.all().filter('user_id =', current_user.user_id()).get()
        except:
            self.response.out.write(json.dumps({"error": "Please login to create a group"}))
            self.response.set_status(401)
            return

        group = Group()
        group.name = data.get('name')
        group.put()

        if user and (group.key() not in user.groups):
            user.groups.append(group.key())
            user.put()

        group = Group.get(group.key())
        self.response.out.write(json.dumps(group.serializable()))

class GroupList(webapp2.RequestHandler):
    def get(self):

        values = []
        _groups= Group.all().fetch(100)

        for group in _groups:
            values.append(group.serializable());

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(values))

class GroupUpdate(webapp2.RequestHandler):
    def post(self, group_key):
        data = json.loads(self.request.body)

        group = Group.get(group_key)

        group.story = data.get('story')
        group.notes = data.get('notes')
        group.name = data.get('name')
        group.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps({"success": True}))

class GroupAddMember(webapp2.RequestHandler):
    def post(self, group_key):
        data = json.loads(self.request.body)
        group = Group.get(group_key)

        try:
            member = db.Query(User).filter('name', data.get('name'))[0]
        except:
            member = None

        if member and (group.key() not in member.groups):
            member.groups.append(group.key())
            member.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(member.serializable()))

class GroupDeleteMember(webapp2.RequestHandler):
    def post(self, group_key, member_key):
        group = Group.get(group_key)
        member = User.get(member_key)

        member.groups.remove(group.key())
        member.put()

class SetDungeonMaster(webapp2.RequestHandler):
    def post(self, group_key):

        data = json.loads(self.request.body)

        user = User.get(data.get('user_key'))
        group = Group.get(group_key)

        group.dm = user
        group.put()

        values = {
            'info': 'dm set',
            'dm' : group.dm.serializable()
        }

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(values))

class GroupDetail(webapp2.RequestHandler):
    def get(self, group_key):
        group = Group.get(group_key)
        players = []
        graveyard = []
        hiatus = []

        for player in group.players:
            if (player.is_dead):
                graveyard.append(player.serializable())
            elif (player.is_gone):
                hiatus.append(player.serializable())
            else:
                players.append(player.serializable())

        values = {
            'group': group.serializable(),
            'players': players,
            'graveyard':graveyard,
            'hiatus':hiatus
        }

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(values))

class CharacterDelete(webapp2.RequestHandler):
    def post(self, character_key):
        current_user = users.get_current_user()
        user = User.all().filter('user_id =', current_user.user_id()).get()

        if user.is_admin:
            character = Character.get(character_key)
            character.delete()

            values = {
                'info':'character deleted'
            }
        else:
            self.response.set_status(500)
            values = {
                "error": "You don't have permission"
            }

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(values))

class CharacterCreate(webapp2.RequestHandler):
    def post(self):

        data = json.loads(self.request.body)

        if users.get_current_user():
            character = Character()
            character.name = data.get('name')
            character.user = users.get_current_user()
            character.group = Group.get(data.get('group_key'))
            character.put()

            values = {
                'character': character.serializable()
            }

            self.response.headers['Content-Type'] = 'application/json'
            self.response.out.write(json.dumps(values))
        else:
            values = {
                'error': 'Please log in to join this group'
            }
            self.response.set_status(400)
            self.response.headers['Content-Type'] = 'application/json'
            self.response.out.write(json.dumps(values))

class AvatarUpload(webapp2.RequestHandler):
    def post(self, character_key):
        character = Character.get(character_key)
        avatar = self.request.get('avatar')

        avatar = db.Blob(str(avatar))
        avatar = images.Image(avatar)
        avatar.resize(width=150)
        avatar = avatar.execute_transforms(output_encoding=images.PNG)

        character.avatar = avatar
        character.put()

        self.redirect("/#/character/%s" % (character.key()))

class CharacterKill(webapp2.RequestHandler):
    def post(self, character_key):

        character = Character.get(character_key)
        character.is_dead = True;
        character.is_gone = False;
        character.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps({"success": True}))

class CharacterResurrect(webapp2.RequestHandler):
    def post(self, character_key):

        character = Character.get(character_key)
        character.is_dead = False;
        character.is_gone = False;
        character.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps({"success": True}))

class CharacterHiatus(webapp2.RequestHandler):
    def post(self, character_key):

        character = Character.get(character_key)
        character.is_dead = False;
        character.is_gone = True;
        character.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps({"success": True}))

class CharacterReturn(webapp2.RequestHandler):
    def post(self, character_key):

        character = Character.get(character_key)
        character.is_dead = False;
        character.is_gone = False;
        character.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps({"success": True}))

class CharacterUpdate(webapp2.RequestHandler):
    def post(self, character_key):
        data = json.loads(self.request.body)
        char_data = data.get('character')
        channel_token = data.get('channel_token')
        character = Character.get(character_key)
        values = {}

        group_key = char_data.get('group_key')
        group = Group.get(group_key)

        for k, v in char_data.iteritems():
            if k == 'date_created' or k == 'key':
                continue
            if k == 'avatar_url':
                continue
            if k == 'powers':
                continue
            if k == 'items':
                continue
            else:
                value = char_data.get(k)
            if isinstance(value, basestring) and value.isdigit():
                value = int(value)
            try:
                setattr(character, k, value)
            except Exception, e:
                logging.exception(e)

        try:
            character.put()
            values = character.serializable()

            message = {
                "msg": "character-updated",
                "character": character.serializable()
            }

            for player in group.players:
                try:
                    channel.send_message(player.user.user_id(), json.dumps(message))
                except apiproxy_errors.OverQuotaError, message:
                    logging.error(message)

            if group.dm:
                try:
                    channel.send_message(group.dm.user_id, json.dumps(message))
                except apiproxy_errors.OverQuotaError, message:
                    logging.error(message)

        except Exception, e:
            values = {'error': e}

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(values))

class CharacterDetail(webapp2.RequestHandler):
    def get(self, character_key):
        character = Character.get(character_key)
        _powers = character.powers
        values = {
            'character': character.serializable()
        }

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(values))

class CharacterAddPower(webapp2.RequestHandler):
    def post(self, character_key):
        data = json.loads(self.request.body)
        try:
            power = db.Query(Power).filter('name', data.get('name'))[0]
        except:
            power = None
        if power:
            power.character = Character.get(character_key)
            power.put()
        else:
            power = Power()
            power.character = Character.get(character_key)
            power.json_string = unicode(self.request.body, 'utf-8');
            power.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(power.serializable()))

class CharacterDeletePower(webapp2.RequestHandler):
    def post(self, character_key, power_key):
        character = Character.get(character_key)
        character.powers.filter('__key__ =', Key(power_key)).get().delete()


class CharacterAddItem(webapp2.RequestHandler):
    def post(self, character_key):
        data = json.loads(self.request.body)
        try:
            item = db.Query(Item).filter('name', data.get('name'))[0]
        except:
            item = None
        if item:
            item.character = Character.get(character_key)
            item.put()
        else:
            item = Item()
            item.character = Character.get(character_key)
            item.json_string = unicode(self.request.body, 'utf-8');
            item.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(item.serializable()))

class CharacterDeleteItem(webapp2.RequestHandler):
    def post(self, character_key, item_key):
        character = Character.get(character_key)
        character.items.filter('__key__ =', Key(item_key)).get().delete()

class CharacterAddFeat(webapp2.RequestHandler):
    def post(self, character_key):
        data = json.loads(self.request.body)
        try:
            feat = db.Query(Feat).filter('name', data.get('name'))[0]
        except:
            feat = None
        if feat:
            feat.character = Character.get(character_key)
            feat.put()
        else:
            feat = Feat()
            feat.character = Character.get(character_key)
            feat.json_string = unicode(self.request.body, 'utf-8');
            feat.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(feat.serializable()))

class CharacterDeleteFeat(webapp2.RequestHandler):
    def post(self, character_key, feat_key):
        character = Character.get(character_key)
        character.feats.filter('__key__ =', Key(feat_key)).get().delete()

class CharacterAddWeapon(webapp2.RequestHandler):
    def post(self, character_key):
        data = json.loads(self.request.body)

        weapon = Weapon()
        weapon.character = Character.get(character_key)
        weapon.json_string = unicode(self.request.body, 'utf-8');
        weapon.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(weapon.serializable()))

class CharacterUpdateWeapon(webapp2.RequestHandler):
    def post(self, character_key, weapon_key):
        data = json.loads(self.request.body)

        weapon = Weapon.get(weapon_key)
        if weapon:
            weapon.attack = data.get('attack')
            weapon.defense = data.get('defense')
            weapon.damage = data.get('damage')
            weapon.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(weapon.serializable()))

class CharacterDeleteWeapon(webapp2.RequestHandler):
    def post(self, character_key, weapon_key):
        character = Character.get(character_key)
        character.weapons.filter('__key__ =', Key(weapon_key)).get().delete()

class Items(webapp2.RequestHandler):
    def get(self):
        items = Item.all()

        _items = []
        for item in items:
            _items.append(item.serializable())

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(_items))
    
    def post(self):

        data = json.loads(self.request.body)

        if data.get('key'):
            item = Item.get(data.get('key'))
        else:
            item = Item()

        item.item_id = data.get('id')
        item.name = data.get('name')
        item.slug = data.get('name').lower()
        item.json_string = json.dumps(data)
        item.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(item.serializable()))

class ItemsDelete(webapp2.RequestHandler):
    def post(self, feat_key):
        self.response.headers['Content-Type'] = 'application/json'
        
        try:
            item = Item.get(item_key)
        except:
            self.response.set_status(404)
            self.response.out.write(json.dumps({"error": "item not found"}))
            return
        item.delete()
        self.response.out.write(json.dumps({"message": "item deleted"}))

class ItemSearch(webapp2.RequestHandler):
    def post(self):
        data = json.loads(self.request.body)
        query_string = data.get('query_string')

        logging.info(query_string)
        logging.info(query_string)
        logging.info(query_string)
        logging.info(query_string)

        query = db.GqlQuery("SELECT * FROM Item WHERE slug >= :1 AND slug < :2",
            query_string,
            query_string.decode("utf-8") + u"\ufffd")
        items = query.fetch(20)
        results = []

        logging.info(items)
        logging.info(items)
        logging.info(items)

        for item in items:
            results.append(item.serializable())

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps({"results": results}))


class Feats(webapp2.RequestHandler):
    def get(self):
        feats = Feat.all()

        _feats = []
        for feat in feats:
            _feats.append(feat.serializable())

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(_feats))
    
    def post(self):

        data = json.loads(self.request.body)

        if data.get('key'):
            feat = Feat.get(data.get('key'))
        else:
            feat = Feat()

        feat.feat_id = data.get('id')
        feat.name = data.get('name')
        feat.slug = data.get('name').lower()
        feat.json_string = json.dumps(data)
        feat.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(feat.serializable()))

class FeatsDelete(webapp2.RequestHandler):
    def post(self, feat_key):
        self.response.headers['Content-Type'] = 'application/json'
        
        try:
            feat = Feat.get(feat_key)
        except:
            self.response.set_status(404)
            self.response.out.write(json.dumps({"error": "feat not found"}))
            return
        feat.delete()
        self.response.out.write(json.dumps({"message": "feat deleted"}))

class FeatSearch(webapp2.RequestHandler):
    def post(self):
        data = json.loads(self.request.body)
        query_string = data.get('query_string')

        query = db.GqlQuery("SELECT * FROM Feat WHERE slug >= :1 AND slug < :2",
            query_string,
            query_string.decode("utf-8") + u"\ufffd")
        feats = query.fetch(20)
        results = []

        for feat in feats:
            results.append(feat.serializable())

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps({"results": results}))

class Powers(webapp2.RequestHandler):
    def get(self):
        powers = Power.all()

        _powers = []
        for power in powers:
            _powers.append(power.serializable())

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(_powers))
    
    def post(self):

        data = json.loads(self.request.body)

        if data.get('key'):
            power = Power.get(data.get('key'))
        else:
            power = Power()

        power.power_id = data.get('id')
        power.name = data.get('name')
        power.slug = data.get('name').lower()
        power.json_string = json.dumps(data)
        power.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(power.serializable()))

class PowersDelete(webapp2.RequestHandler):
    def post(self, power_key):
        self.response.headers['Content-Type'] = 'application/json'
        
        try:
            power = Power.get(power_key)
        except:
            self.response.set_status(404)
            self.response.out.write(json.dumps({"error": "power not found"}))
            return
        power.delete()
        self.response.out.write(json.dumps({"message": "power deleted"}))

class PowerSearch(webapp2.RequestHandler):
    def post(self):
        data = json.loads(self.request.body)
        query_string = data.get('query_string')

        query = db.GqlQuery("SELECT * FROM Power WHERE slug >= :1 AND slug < :2",
            query_string,
            query_string.decode("utf-8") + u"\ufffd")
        powers = query.fetch(20)
        results = []

        for power in powers:
            results.append(power.serializable())

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps({"results": results}))

class Image(webapp2.RequestHandler):
    def get(self):
        character = Character.get(self.request.get('character_key'))
        if character:
            if character.avatar:
                self.response.headers['Content-Type'] = 'image/png'
                self.response.out.write(character.avatar)
            else:
                self.error(404)


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/images/?', Image),

    ('/api/v1/character/create/?', CharacterCreate),
    ('/api/v1/users/list/?', UserList),
    
    ('/api/v1/feats/?', Feats),
    ('/api/v1/feats/search?', FeatSearch),
    ('/api/v1/feats/(?P<feat_key>[^/]+)/delete/?', FeatsDelete),

    ('/api/v1/item/?', Items),
    ('/api/v1/item/search?', ItemSearch),
    ('/api/v1/item/(?P<feat_key>[^/]+)/delete/?', ItemsDelete),

    ('/api/v1/power/?', Powers),
    ('/api/v1/power/search?', PowerSearch),
    ('/api/v1/power/(?P<feat_key>[^/]+)/delete/?', PowersDelete),

    ('/api/v1/groups/create/?', GroupCreate),
    ('/api/v1/groups/list/?', GroupList),
    ('/api/v1/groups/(?P<group_key>[^/]+)/?', GroupDetail),
    ('/api/v1/groups/(?P<group_key>[^/]+)/update/?', GroupUpdate),
    ('/api/v1/groups/(?P<group_key>[^/]+)/dm/?', SetDungeonMaster),
    ('/api/v1/groups/(?P<group_key>[^/]+)/members/add?/', GroupAddMember),
    ('/api/v1/groups/(?P<group_key>[^/]+)/members/(?P<member_key>[^/]+)/delete/?', GroupDeleteMember),

    ('/api/v1/character/(?P<character_key>[^/]+)/?', CharacterDetail),
    ('/api/v1/character/(?P<character_key>[^/]+)/update/?', CharacterUpdate),
    ('/api/v1/character/(?P<character_key>[^/]+)/delete/?', CharacterDelete),
    ('/api/v1/character/(?P<character_key>[^/]+)/kill/?', CharacterKill),
    ('/api/v1/character/(?P<character_key>[^/]+)/resurrect/?', CharacterResurrect),
    ('/api/v1/character/(?P<character_key>[^/]+)/hiatus/?', CharacterHiatus),
    ('/api/v1/character/(?P<character_key>[^/]+)/return/?', CharacterReturn),
    ('/api/v1/character/(?P<character_key>[^/]+)/avatar/?', AvatarUpload),
    ('/api/v1/character/(?P<character_key>[^/]+)/powers/add/?', CharacterAddPower),
    ('/api/v1/character/(?P<character_key>[^/]+)/powers/(?P<power_key>[^/]+)/delete/?', CharacterDeletePower),
    ('/api/v1/character/(?P<character_key>[^/]+)/feats/add/?', CharacterAddFeat),
    ('/api/v1/character/(?P<character_key>[^/]+)/feats/(?P<feat_key>[^/]+)/delete/?', CharacterDeleteFeat),
    ('/api/v1/character/(?P<character_key>[^/]+)/items/add/?', CharacterAddItem),
    ('/api/v1/character/(?P<character_key>[^/]+)/items/(?P<item_key>[^/]+)/delete/?', CharacterDeleteItem),
    ('/api/v1/character/(?P<character_key>[^/]+)/weapons/add/?', CharacterAddWeapon),
    ('/api/v1/character/(?P<character_key>[^/]+)/weapons/(?P<weapon_key>[^/]+)/update/?', CharacterUpdateWeapon),
    ('/api/v1/character/(?P<character_key>[^/]+)/weapons/(?P<weapon_key>[^/]+)/delete/?', CharacterDeleteWeapon),


], debug=True)
