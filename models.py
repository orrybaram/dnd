from google.appengine.ext import db

class Group(db.Model):
    date_created = db.DateTimeProperty(auto_now_add=True)
    name = db.StringProperty()

    def serializable(self):
        return {
            'date_created': self.date_created.isoformat(),
            'key': str(self.key()),
            'name': self.name,
        }

class Character(db.Model):
    
    date_created = db.DateTimeProperty(auto_now_add=True)
    group = db.ReferenceProperty(Group, collection_name="players", default=None)

    # Basics
    name = db.StringProperty()
    level = db.IntegerProperty(default=0)
    char_class = db.StringProperty()
    epic_destiny = db.StringProperty()
    total_xp = db.IntegerProperty(default=0)
    char_race = db.StringProperty()
    char_size = db.StringProperty()
    char_age = db.IntegerProperty(default=0)
    char_gender = db.StringProperty()
    char_height = db.StringProperty()
    alignment = db.StringProperty()
    deity = db.StringProperty()
    affiliations = db.StringProperty()
    avatar = db.BlobProperty()
    
    # Initiative
    initiative_score = db.IntegerProperty(default=0)
    initiative_misc = db.IntegerProperty(default=0)
    
    # Ability Scores
    strength = db.IntegerProperty(default=0)
    strength_abil_mod = db.IntegerProperty(default=0)
    
    constitution = db.IntegerProperty(default=0)
    constitution_abil_mod = db.IntegerProperty(default=0)
    
    dexterity = db.IntegerProperty(default=0)
    dexterity_abil_mod = db.IntegerProperty(default=0)
    
    intelligence = db.IntegerProperty(default=0)
    intelligence_abil_mod = db.IntegerProperty(default=0)
    
    wisdom = db.IntegerProperty(default=0)
    wisdom_abil_mod = db.IntegerProperty(default=0)
    
    charisma = db.IntegerProperty(default=0)
    charisma_abil_mod = db.IntegerProperty(default=0)
    

    # Defenses
    armor_class_total = db.IntegerProperty(default=0)
    armor_abil = db.IntegerProperty(default=0)
    armor_char_class = db.IntegerProperty(default=0)
    armor_feat = db.IntegerProperty(default=0)
    armor_enh = db.IntegerProperty(default=0)
    armor_misc1 = db.IntegerProperty(default=0)
    armor_misc2 = db.IntegerProperty(default=0)

    fortitude_class_total = db.IntegerProperty(default=0)
    fortitude_abil = db.IntegerProperty(default=0)
    fortitude_char_class = db.IntegerProperty(default=0)
    fortitude_feat = db.IntegerProperty(default=0)
    fortitude_enh = db.IntegerProperty(default=0)
    fortitude_misc1 = db.IntegerProperty(default=0)
    fortitude_misc2 = db.IntegerProperty(default=0)

    reflex_class_total = db.IntegerProperty(default=0)
    reflex_abil = db.IntegerProperty(default=0)
    reflex_char_class = db.IntegerProperty(default=0)
    reflex_feat = db.IntegerProperty(default=0)
    reflex_enh = db.IntegerProperty(default=0)
    reflex_misc1 = db.IntegerProperty(default=0)
    reflex_misc2 = db.IntegerProperty(default=0)

    will_class_total = db.IntegerProperty(default=0)
    will_abil = db.IntegerProperty(default=0)
    will_char_class = db.IntegerProperty(default=0)
    will_feat = db.IntegerProperty(default=0)
    will_enh = db.IntegerProperty(default=0)
    will_misc1 = db.IntegerProperty(default=0)
    will_misc2 = db.IntegerProperty(default=0)

    # Movement
    speed_total = db.IntegerProperty(default=0)
    speed_base = db.IntegerProperty(default=0)
    speed_armor = db.StringProperty(default="0")
    speed_item = db.IntegerProperty(default=0)
    speed_misc = db.IntegerProperty(default=0)

    # Senses
    passive_insight = db.IntegerProperty(default=0)
    passive_perception = db.IntegerProperty(default=0)

    # Hit Points
    hp_max = db.IntegerProperty(default=0)
    hp_bloodied = db.IntegerProperty(default=0)
    surge_value = db.IntegerProperty(default=0)
    surges_per_day = db.IntegerProperty(default=0)

    # Skills
    acrobatics_total = db.IntegerProperty(default=0)
    acrobatics_trained = db.BooleanProperty(default=False)
    acrobatics_armor_penalty = db.StringProperty(default="0")
    acrobatics_misc = db.IntegerProperty(default=0)

    arcana_total = db.IntegerProperty(default=0)
    arcana_trained = db.BooleanProperty(default=False)
    arcana_misc = db.IntegerProperty(default=0)

    athletics_total = db.IntegerProperty(default=0)
    athletics_trained = db.BooleanProperty(default=False)
    athletics_armor_penalty = db.StringProperty(default="0")
    athletics_misc = db.IntegerProperty(default=0)

    bluff_total = db.IntegerProperty(default=0)
    bluff_trained = db.BooleanProperty(default=False)
    bluff_misc = db.IntegerProperty(default=0)

    diplomacy_total = db.IntegerProperty(default=0)
    diplomacy_trained = db.BooleanProperty(default=False)
    diplomacy_misc = db.IntegerProperty(default=0)

    dungeoneering_total = db.IntegerProperty(default=0)
    dungeoneering_trained = db.BooleanProperty(default=False)
    dungeoneering_misc = db.IntegerProperty(default=0)

    endurance_total = db.IntegerProperty(default=0)
    endurance_trained = db.BooleanProperty(default=False)
    endurance_armor_penalty = db.StringProperty(default="0")
    endurance_misc = db.IntegerProperty(default=0)

    heal_total = db.IntegerProperty(default=0)
    heal_trained = db.BooleanProperty(default=False)
    heal_misc = db.IntegerProperty(default=0)

    history_total = db.IntegerProperty(default=0)
    history_trained = db.BooleanProperty(default=False)
    history_misc = db.IntegerProperty(default=0)

    insight_total = db.IntegerProperty(default=0)
    insight_trained = db.BooleanProperty(default=False)
    insight_misc = db.IntegerProperty(default=0)

    intimidate_total = db.IntegerProperty(default=0)
    intimidate_trained = db.BooleanProperty(default=False)
    intimidate_misc = db.IntegerProperty(default=0)

    nature_total = db.IntegerProperty(default=0)
    nature_trained = db.BooleanProperty(default=False)
    nature_misc = db.IntegerProperty(default=0)

    perception_total = db.IntegerProperty(default=0)
    perception_trained = db.BooleanProperty(default=False)
    perception_misc = db.IntegerProperty(default=0)

    religion_total = db.IntegerProperty(default=0)
    religion_trained = db.BooleanProperty(default=False)
    religion_misc = db.IntegerProperty(default=0)

    stealth_total = db.IntegerProperty(default=0)
    stealth_trained = db.BooleanProperty(default=False)
    stealth_armor_penalty = db.StringProperty(default="0")
    stealth_misc = db.IntegerProperty(default=0)

    streetwise_total = db.IntegerProperty(default=0)
    streetwise_trained = db.BooleanProperty(default=False)
    streetwise_misc = db.IntegerProperty(default=0)

    theivery_total = db.IntegerProperty(default=0)
    theivery_trained = db.BooleanProperty(default=False)
    theivery_armor_penalty = db.StringProperty(default="0")
    theivery_misc = db.IntegerProperty(default=0)


    def get_initiative_score(self):
        return self.dexterity + half_level_mod()

    # will need some fixin
    def get_half_level(self):
        return self.level / 2

    def get_ac_total(self):
        ac = self.armor_abil
        ac += 10 + get_half_level()
        ac += self.armor_char_class
        ac += self.armor_feat
        ac += self.armor_enh
        ac += self.armor_misc1
        ac += self.armor_misc2
        return ac

    def get_fort_total(self):
        fort = self.fort_abil
        fort += 10 + get_half_level()
        fort += self.fort_char_class
        fort += self.fort_feat
        fort += self.fort_enh
        fort += self.fort_misc1
        fort += self.fort_misc2
        return fort

    def get_reflex_total(self):
        reflex = self.reflex_abil
        reflex += 10 + get_half_level()
        reflex += self.reflex_char_class
        reflex += self.reflex_feat
        reflex += self.reflex_enh
        reflex += self.reflex_misc1
        reflex += self.reflex_misc2
        return reflex

    def get_will_total(self):
        will = self.will_abil
        will += 10 + get_half_level()
        will += self.will_char_class
        will += self.will_feat
        will += self.will_enh
        will += self.will_misc1
        will += self.will_misc2
        return will

    def get_speed_total(self):
        speed = self.speed_base
        speed += self.speed_armor
        speed += self.speed_item
        speed += self.speed_misc
        return speed

    def get_passive_insight(self):
        return 10 + insight

    def get_passive_perception(self):
        return 10 + perception

    def serializable(self):
        result = {
            # Basics
            'key': str(self.key()),
            'date_created': self.date_created.isoformat(),
            'group_key': str(self.group.key()),
            'name': self.name,
            'level': self.level,
            'char_class': self.char_class,
            'epic_destiny': self.epic_destiny,
            'total_xp': self.total_xp,
            'char_race': self.char_race,
            'char_size': self.char_size,
            'char_age': self.char_age,
            'char_gender': self.char_gender,
            'char_height': self.char_height,
            'alignment': self.alignment,
            'deity': self.deity,
            'affiliations': self.affiliations,
            'avatar': self.avatar,
            
            # Initiative
            'initiative_score': self.initiative_score,
            'initiative_misc': self.initiative_misc,
            
            # Ability Scores
            'strength': self.strength,
            'strength_abil_mod': self.strength_abil_mod,
            
            'constitution': self.constitution,
            'constitution_abil_mod': self.constitution_abil_mod,
            
            'dexterity': self.dexterity,
            'dexterity_abil_mod': self.dexterity_abil_mod,
            
            'intelligence': self.intelligence,
            'intelligence_abil_mod': self.intelligence_abil_mod,
            
            'wisdom': self.wisdom,
            'wisdom_abil_mod': self.wisdom_abil_mod,
            
            'charisma': self.charisma,
            'charisma_abil_mod': self.charisma_abil_mod,
            

            # Defenses
            'armor_class_total': self.armor_class_total,
            'armor_abil': self.armor_abil,
            'armor_char_class': self.armor_char_class,
            'armor_feat': self.armor_feat,
            'armor_enh': self.armor_enh,
            'armor_misc1': self.armor_misc1,
            'armor_misc2': self.armor_misc2,

            'fortitude_class_total': self.fortitude_class_total,
            'fortitude_abil': self.fortitude_abil,
            'fortitude_char_class': self.fortitude_char_class,
            'fortitude_feat': self.fortitude_feat,
            'fortitude_enh': self.fortitude_enh,
            'fortitude_misc1': self.fortitude_misc1,
            'fortitude_misc2': self.fortitude_misc2,

            'reflex_class_total': self.reflex_class_total,
            'reflex_abil': self.reflex_abil,
            'reflex_char_class': self.reflex_char_class,
            'reflex_feat': self.reflex_feat,
            'reflex_enh': self.reflex_enh,
            'reflex_misc1': self.reflex_misc1,
            'reflex_misc2': self.reflex_misc2,

            'will_class_total': self.will_class_total,
            'will_abil': self.will_abil,
            'will_char_class': self.will_char_class,
            'will_feat': self.will_feat,
            'will_enh': self.will_enh,
            'will_misc1': self.will_misc1,
            'will_misc2': self.will_misc2,

            # Movement
            'speed_total': self.speed_total,
            'speed_base': self.speed_base,
            'speed_armor': self.speed_armor,
            'speed_item': self.speed_item,
            'speed_misc': self.speed_misc,

            # Senses
            'passive_insight': self.passive_insight,
            'passive_perception': self.passive_perception,

            # Hit Points
            'hp_max': self.hp_max,
            'hp_bloodied': self.hp_bloodied,
            'surge_value': self.surge_value,
            'surges_per_day': self.surges_per_day,

            # Skills
            'acrobatics_total': self.acrobatics_total,
            'acrobatics_trained': self.acrobatics_trained,
            'acrobatics_armor_penalty': self.acrobatics_armor_penalty,
            'acrobatics_misc': self.acrobatics_misc,

            'arcana_total': self.arcana_total,
            'arcana_trained': self.arcana_trained,
            'arcana_misc': self.arcana_misc,

            'athletics_total': self.athletics_total,
            'athletics_trained': self.athletics_trained,
            'athletics_armor_penalty': self.athletics_armor_penalty,
            'athletics_misc': self.athletics_misc,

            'bluff_total': self.bluff_total,
            'bluff_trained': self.bluff_trained,
            'bluff_misc': self.bluff_misc,

            'diplomacy_total': self.diplomacy_total,
            'diplomacy_trained': self.diplomacy_trained,
            'diplomacy_misc': self.diplomacy_misc,

            'dungeoneering_total': self.dungeoneering_total,
            'dungeoneering_trained': self.dungeoneering_trained,
            'dungeoneering_misc': self.dungeoneering_misc,

            'endurance_total': self.endurance_total,
            'endurance_trained': self.endurance_trained,
            'endurance_armor_penalty': self.endurance_armor_penalty,
            'endurance_misc': self.endurance_misc,

            'heal_total': self.heal_total,
            'heal_trained': self.heal_trained,
            'heal_misc': self.heal_misc,

            'history_total': self.history_total,
            'history_trained': self.history_trained,
            'history_misc': self.history_misc,

            'insight_total': self.insight_total,
            'insight_trained': self.insight_trained,
            'insight_misc': self.insight_misc,

            'intimidate_total': self.intimidate_total,
            'intimidate_trained': self.intimidate_trained,
            'intimidate_misc': self.intimidate_misc,

            'nature_total': self.nature_total,
            'nature_trained': self.nature_trained,
            'nature_misc': self.nature_misc,

            'perception_total': self.perception_total,
            'perception_trained': self.perception_trained,
            'perception_misc': self.perception_misc,

            'religion_total': self.religion_total,
            'religion_trained': self.religion_trained,
            'religion_misc': self.religion_misc,

            'stealth_total': self.stealth_total,
            'stealth_trained': self.stealth_trained,
            'stealth_armor_penalty': self.stealth_armor_penalty,
            'stealth_misc': self.stealth_misc,

            'streetwise_total': self.streetwise_total,
            'streetwise_trained': self.streetwise_trained,
            'streetwise_misc': self.streetwise_misc,

            'theivery_total': self.theivery_total,
            'theivery_trained': self.theivery_trained,
            'theivery_armor_penalty': self.theivery_armor_penalty,
            'theivery_misc': self.theivery_misc,
        }

        return result

