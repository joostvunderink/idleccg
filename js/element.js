function Element(name) {
  this.name     = name;
  this.cssClass = 'card-' + name;
  this.dominatedElement = null;
  this.dominates    = function(otherElement) {
    return otherElement === this.dominatedElement;
  }
}

var WATER = new Element('water');
var FIRE  = new Element('fire');
var EARTH = new Element('earth');
var AIR   = new Element('air');
var NONE = new Element('none');

WATER.dominatedElement = FIRE;
FIRE.dominatedElement  = EARTH;
EARTH.dominatedElement = AIR;
AIR.dominatedElement   = WATER;
NONE.dominatedElement  = 'does-not-dominate';

var ELEMENTS = [WATER, FIRE, EARTH, AIR];
var ELEMENT_BY_NAME = {
  water: WATER,
  air  : AIR,
  earth: EARTH,
  fire : FIRE,
};

function getRandomElement() {
  var index = Math.round(Math.random() * ELEMENTS.length);
  return ELEMENTS[index];
}

function getELementByName(name) {
  if (name in ELEMENT_BY_NAME) {
    return ELEMENT_BY_NAME[name];
  }
  throw new Error("Element with name '" + name + "' does not exist.");
}
