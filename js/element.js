function Element(name) {
  this.name     = name;
  this.cssClass = 'card-' + name;
  this.dominatedElement = null;
  this.dominates    = function(otherElement) {
    return otherElement === this.dominatedElement;
  }
}

var ELEMENT_WATER = new Element('water');
var ELEMENT_FIRE  = new Element('fire');
var ELEMENT_EARTH = new Element('earth');
var ELEMENT_AIR   = new Element('air');
var ELEMENT_NONE  = new Element('none');

ELEMENT_WATER.dominatedElement = ELEMENT_FIRE;
ELEMENT_FIRE.dominatedElement  = ELEMENT_EARTH;
ELEMENT_EARTH.dominatedElement = ELEMENT_AIR;
ELEMENT_AIR.dominatedElement   = ELEMENT_WATER;
ELEMENT_NONE.dominatedElement  = 'does-not-dominate';

var ELEMENTS = [ELEMENT_WATER, ELEMENT_FIRE, ELEMENT_EARTH, ELEMENT_AIR];
var ELEMENT_BY_NAME = {
  water: ELEMENT_WATER,
  air  : ELEMENT_AIR,
  earth: ELEMENT_EARTH,
  fire : ELEMENT_FIRE,
};

function getRandomElement() {
  var index = Math.floor(Math.random() * ELEMENTS.length);
  return ELEMENTS[index];
}

function getELementByName(name) {
  if (name in ELEMENT_BY_NAME) {
    return ELEMENT_BY_NAME[name];
  }
  throw new Error("Element with name '" + name + "' does not exist.");
}
