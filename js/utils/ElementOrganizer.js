/*
  utils/ElementOrganizer.js 
  -------------------------
  ElementOrganizer class is responsible for organizing the elements (data-component)
  in the application into different groups. Each group contains a set of elements 
  that are related to each other (data-group).
*/

export class ElementOrganizer {
  constructor(nodeList) {
    this.components = nodeList; 
    this._groups = {};
    this.sortElements();
  }

  get groups() {
    return this._groups;
  }

  sortElements() {
    this.components.forEach(component => {
      const group = component.getAttribute('data-group');
      const componentType = component.getAttribute('data-component');
      if (group) {
        if (!this._groups[group]) {
          this._groups[group] = {};
        }
        if (!this._groups[group][componentType]) {
          this._groups[group][componentType] = component;
        } else if (this._groups[group][componentType] instanceof Array) {
          this._groups[group][componentType + 's'] = this._groups[group][componentType];
          delete this._groups[group][componentType];
          this._groups[group][componentType + 's'].push(component);
        } else {
          this._groups[group][componentType] = [this._groups[group][componentType], component];
        }
      }
    });
  }
}