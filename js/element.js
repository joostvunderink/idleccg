function Element(name, icon) {
  this.name     = name;
  this.cssClass = 'card-' + name;
  this.dominatedElement = null;
  this.dominates    = function(otherElement) {
    return otherElement === this.dominatedElement;
  };
  this.icon = icon
}

var ELEMENT_WATER = new Element('Water');
var ELEMENT_FIRE  = new Element('Fire');
var ELEMENT_EARTH = new Element('Earth');
var ELEMENT_AIR   = new Element('Air');
var ELEMENT_NONE  = new Element('None');

ELEMENT_WATER.dominatedElement = ELEMENT_FIRE;
ELEMENT_FIRE.dominatedElement  = ELEMENT_EARTH;
ELEMENT_EARTH.dominatedElement = ELEMENT_AIR;
ELEMENT_AIR.dominatedElement   = ELEMENT_WATER;
ELEMENT_NONE.dominatedElement  = ELEMENT_NONE;

var ELEMENTS = [ELEMENT_WATER, ELEMENT_FIRE, ELEMENT_EARTH, ELEMENT_AIR];
var ELEMENT_BY_NAME = {
  Water: ELEMENT_WATER,
  Air  : ELEMENT_AIR,
  Earth: ELEMENT_EARTH,
  Fire : ELEMENT_FIRE
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
