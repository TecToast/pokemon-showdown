const evioliteIds = ['phione', 'rotom', 'floetteeternal'];
export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	eviolite: {
		inherit: true,
		onModifyDef(def, pokemon) {
			if (evioliteIds.includes(pokemon.species.id)) {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd, pokemon) {
			if (evioliteIds.includes(pokemon.species.id)) {
				return this.chainModify(1.5);
			}
		},
	},
};
