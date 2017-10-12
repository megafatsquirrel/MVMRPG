var RPG = RPG || {};

RPG.BattleState = function () {
    "use strict";
    Phaser.State.call(this);
    
    this.prefab_classes = {
        "background": RPG.TilePrefab.prototype.constructor,
        "rectangle": RPG.Prefab.prototype.constructor,
        "player_unit": RPG.PlayerUnit.prototype.constructor,
        "enemy_unit": RPG.EnemyUnit.prototype.constructor
    };
    
    this.TEXT_STYLE = {font: "14px Arial", fill: "#FFFFFF"};
};

RPG.BattleState.prototype = Object.create(Phaser.State.prototype);
RPG.BattleState.prototype.constructor = RPG.BattleState;

RPG.BattleState.prototype.init = function (level_data) {
    "use strict";
    this.level_data = level_data;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
};

RPG.BattleState.prototype.create = function () {
    "use strict";
    var group_name, prefab_name, player_unit_name, enemy_unit_name;
    
    // create groups
    this.groups = {};
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);
    
    // create prefabs
    this.prefabs = {};
    for (prefab_name in this.level_data.prefabs) {
        if (this.level_data.prefabs.hasOwnProperty(prefab_name)) {
            // create prefab
            this.create_prefab(prefab_name, this.level_data.prefabs[prefab_name]);
        }
    }
    
    this.init_hud();
    
    // create units array with player and enemy units
    this.units = [];
    this.units = this.units.concat(this.groups.player_units.children);
    this.units = this.units.concat(this.groups.enemy_units.children);
    
    this.next_turn();
};

RPG.BattleState.prototype.create_prefab = function (prefab_name, prefab_data) {
    "use strict";
    var prefab;
    // create object according to its type
    if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
        prefab = new this.prefab_classes[prefab_data.type](this, prefab_name, prefab_data.position, prefab_data.properties);
    }
};

RPG.BattleState.prototype.init_hud = function () {
    "use strict";
    var unit_index, player_unit_health;
    
    // show player actions
    this.show_player_actions({x: 106, y: 210});
    
    // show player units
    this.show_units("player_units", {x: 202, y: 210}, RPG.PlayerMenuItem.prototype.constructor);
    
    // show enemy units
    this.show_units("enemy_units", {x: 10, y: 210}, RPG.EnemyMenuItem.prototype.constructor);
};

RPG.BattleState.prototype.show_units = function (group_name, position, menu_item_constructor) {
    "use strict";
    var unit_index, menu_items, unit_menu_item, units_menu;
    
    // create units menu items
    unit_index = 0;
    menu_items = [];
    this.groups[group_name].forEach(function (unit) {
        unit_menu_item = new menu_item_constructor(this, unit.name + "_menu_item", {x: position.x, y: position.y + unit_index * 20}, {group: "hud", text: unit.name, style: Object.create(this.TEXT_STYLE)});
        unit_index += 1;
        menu_items.push(unit_menu_item);
    }, this);
    // create units menu
    units_menu = new RPG.Menu(this, group_name + "_menu", position, {group: "hud", menu_items: menu_items});
};

RPG.BattleState.prototype.show_player_actions = function (position) {
    "use strict";
    var actions, actions_menu_items, action_index, actions_menu;
    // available actions
    actions = [{text: "Attack", item_constructor: RPG.AttackMenuItem.prototype.constructor}];
    actions_menu_items = [];
    action_index = 0;
    // create a menu item for each action
    actions.forEach(function (action) {
        actions_menu_items.push(new action.item_constructor(this, action.text + "_menu_item", {x: position.x, y: position.y + action_index * 20}, {group: "hud", text: action.text, style: Object.create(this.TEXT_STYLE)}));
        action_index += 1;
    }, this);
    actions_menu = new RPG.Menu(this, "actions_menu", position, {group: "hud", menu_items: actions_menu_items});
};

RPG.BattleState.prototype.next_turn = function () {
    "use strict";
    // takes the next unit
    this.current_unit = this.units.shift();
    // if the unit is alive, it acts, otherwise goes to the next turn
    if (this.current_unit.alive) {
        this.current_unit.act();
        this.units.push(this.current_unit);
    } else {
        this.next_turn();
    }
};
