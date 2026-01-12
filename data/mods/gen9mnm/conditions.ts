export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	hail: {
		name: 'Hail',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('icyrock')) {
				return 8;
			}
			return 5;
		},
		onModifyDefPriority: 10,
		onModifyDef(def, pokemon) {
			if (pokemon.hasType('Ice') && this.field.isWeather('hail') && !pokemon.hasItem('safetygoggles')) {
				return this.modify(def, 1.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-weather', 'Hail');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Hail', '[upkeep]');
			if (this.field.isWeather('hail')) this.eachEvent('Weather');
		},
		onWeather(target) {
			this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	glacialstorm: {
		// TODO: Intense Hail + all places where Hail is used (eg Blizzard, Solar Beam...) update
		name: 'Glacial Storm',
		effectType: 'Weather',
		duration: 0,
		onFieldStart(field, source, effect) {
			this.add('-weather', 'GlacialStorm', '[from] ability: ' + effect.name, `[of] ${source}`);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'GlacialStorm', '[upkeep]');
			this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
		onModifyDefPriority: 10,
		onModifyDef(def, pokemon) {
			if (pokemon.hasType('Ice') && this.field.isWeather('hail')) {
				return this.modify(def, 1.5);
			}
		},
		onWeather(target) {
			this.damage(target.baseMaxhp / 8);
		},
	},
	futuremove: {
		inherit: true,
		onStart(target, source) {
			const rounds = source.hasAbility('stall') ? 3 : 2;
			this.effectState.targetSlot = target.getSlot();
			this.effectState.endingTurn = (this.turn - 1) + rounds;
			if (this.effectState.endingTurn >= 254) {
				this.hint(`In Gen 8+, Future attacks will never resolve when used on the 255th turn or later.`);
			}
		},
	},
	frz: {
		name: 'frz',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'frz', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'frz');
			}
		},
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
		onBeforeMove: undefined,
		onModifyMove: undefined,
		onAfterMoveSecondary: undefined,
		onDamagingHit: undefined,
	},
	gem: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			this.debug('Gem Boost');
			return this.chainModify(1.5);
		},
	},
	sandstorm: {
		inherit: true,
		onModifySpD(spd, pokemon, source, move) {
			if (pokemon.hasType('Rock') && this.field.isWeather('sandstorm') && !source.hasItem('safetygoggles')) {
				return this.modify(spd, 1.5);
			}
		},
	},
	tartappleboost: {
		name: 'tartappleboost',
		duration: 1,
		onModifyDamage(damage, source, target, move) {
			return this.chainModify([5324, 4096]);
		},
	},
	choicelock: {
		inherit: true,
		onBeforeMove(pokemon, target, move) {
			if (!pokemon.getItem().isChoice && !Object.keys(pokemon.volatiles).some(id => id.includes("item:choice"))) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (
				!pokemon.ignoringItem() && !pokemon.volatiles['dynamax'] &&
				move.id !== this.effectState.move && move.id !== 'struggle'
			) {
				// Fails unless the Choice item is being ignored, and no PP is lost
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Choice item lock");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onDisableMove(pokemon) {
			if ((!pokemon.getItem().isChoice && !Object.keys(pokemon.volatiles).some(id => id.includes("item:choice"))) ||
				!pokemon.hasMove(this.effectState.move)) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (pokemon.ignoringItem() || pokemon.volatiles['dynamax']) {
				return;
			}
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== this.effectState.move) {
					pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect);
				}
			}
		},
	},
	stealthcoal: {
		name: 'Stealth Coal',
		effectType: 'Condition',
		onSideStart(side) {
			this.add('-sidestart', side, 'move: Stealth Coal');
		},
		onSwitchIn(pokemon) {
			if (pokemon.hasItem('heavydutyboots') || pokemon.hasAbility('solidfooting') || (this.format.id.includes('mnm') && (pokemon.hasAbility('shielddust')))) return;
			const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('flamethrower')), -6, 6);
			this.damage(pokemon.maxhp * (2 ** typeMod) / 8);
		},
	},
};
