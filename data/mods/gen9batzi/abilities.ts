export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	corrosion: {
		inherit: true,
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
			}
		},
		shortDesc: "This Pokemon can poison or badly poison a Pokemon regardless of its typing. Poison moves can hit steel.",
	},
};
