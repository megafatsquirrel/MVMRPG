var RPG = RPG || {};

RPG.PlayerUnit = function (game_state, name, position, properties) {
    "use strict";
    RPG.Unit.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
};

RPG.PlayerUnit.prototype = Object.create(RPG.Unit.prototype);
RPG.PlayerUnit.prototype.constructor = RPG.PlayerUnit;

RPG.PlayerUnit.prototype.act = function () {
    "use strict";
    var unit_index, player_units_menu_items;
    // search for the index of this unit in the player_units_menu
    unit_index = this.game_state.prefabs.player_units_menu.find_item_index(this.name);
    this.game_state.prefabs.player_units_menu.move_selection(unit_index);
    
    // enable menu for choosing the action
    this.game_state.prefabs.actions_menu.enable();
};

RPG.PlayerUnit.prototype.kill = function () {
    "use strict";
    var menu_item_index, menu_item;
    Phaser.Sprite.prototype.kill.call(this);
    // remove from the menu
    menu_item_index = this.game_state.prefabs.player_units_menu.find_item_index(this.name);
    this.game_state.prefabs.player_units_menu.menu_items[menu_item_index].alpha = 0.5;
};