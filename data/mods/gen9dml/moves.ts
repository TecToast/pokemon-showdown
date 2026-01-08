export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	revivalblessing: {
		inherit: true,
		onTryHit(source) {
			if (!source.side.pokemon.filter(ally => ally.fainted).length) {
				return false;
			}
		},
		onHit(source) {
			const allies = source.side.pokemon.filter(ally => ally.fainted);
			if (!allies.length) return false;
			const chosenAlly = this.sample(allies);
			source.side.pokemonLeft++;
			if (chosenAlly.position < source.side.active.length) {
				this.queue.addChoice({
					choice: 'instaswitch',
					pokemon: chosenAlly,
					target: chosenAlly,
				});
			}
			chosenAlly.fainted = false;
			chosenAlly.faintQueued = false;
			chosenAlly.subFainted = false;
			chosenAlly.status = '';
			chosenAlly.hp = 1; // Needed so hp functions works
			chosenAlly.sethp(chosenAlly.maxhp / 4);
			this.add('-heal', chosenAlly, chosenAlly.getHealth, '[from] move: Revival Blessing');
		},
		slotCondition: undefined,
		// No this not a real switchout move
		// This is needed to trigger a switch protocol to choose a fainted party member
		// Feel free to refactor
		selfSwitch: undefined,
		condition: undefined,
	},
	armorcannon: {
		inherit: true,
		self: {
			boosts: {
				def: -1,
				spd: -1,
				spe: 1,
			},
		},
		flags: { protect: 1, mirror: 1, pulse: 1 },
	},
	cut: {
		inherit: true,
		type: 'Steel',
		basePower: 70,
	},
	dragonclaw: {
		inherit: true,
		basePower: 95,
		accuracy: 90,
	},
	dragonpulse: {
		inherit: true,
		basePower: 90,
		secondary: {
			chance: 10,
			status: 'par',
		},
	},
	drillpeck: {
		inherit: true,
		critRatio: 2,
	},
	jawlock: {
		inherit: true,
		onHit(target, source, move) {
			target.addVolatile('trapped', source, move, 'trapper');
		},
	},
	lastrespects: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			return 50 + 25 * pokemon.side.totalFainted;
		},
	},
	zippyzap: {
		inherit: true,
		basePower: 50,
		category: "Special",
		secondary: null,
	},
};
