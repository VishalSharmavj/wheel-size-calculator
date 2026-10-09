/**
 * Common wheel sizes, as ISO (bead seat) diameter plus tyre width.
 *
 * The ISO pair is the only unambiguous way to name a wheel. The inch and
 * French names repeat across different diameters — there are three unrelated
 * "26 inch" wheels and 27 inch is *larger* than 700c — so every entry here
 * carries its ISO numbers alongside the nickname.
 */
export const SIZES = [
	{ group: 'Road and gravel', name: '700c x 23 (622-23)', iso: 622, width: 23 },
	{ group: 'Road and gravel', name: '700c x 25 (622-25)', iso: 622, width: 25 },
	{ group: 'Road and gravel', name: '700c x 28 (622-28)', iso: 622, width: 28 },
	{ group: 'Road and gravel', name: '700c x 32 (622-32)', iso: 622, width: 32 },
	{ group: 'Road and gravel', name: '700c x 38 (622-38)', iso: 622, width: 38 },
	{ group: 'Road and gravel', name: '700c x 42 (622-42)', iso: 622, width: 42 },
	{ group: 'Road and gravel', name: '650b x 47 (584-47)', iso: 584, width: 47 },
	{ group: 'Road and gravel', name: '27in x 1 1/4 (630-32)', iso: 630, width: 32 },
	{ group: 'Mountain bike', name: '29 x 2.1 (622-53)', iso: 622, width: 53 },
	{ group: 'Mountain bike', name: '29 x 2.4 (622-61)', iso: 622, width: 61 },
	{ group: 'Mountain bike', name: '27.5 x 2.25 (584-57)', iso: 584, width: 57 },
	{ group: 'Mountain bike', name: '27.5 x 2.4 (584-61)', iso: 584, width: 61 },
	{ group: 'Mountain bike', name: '26 x 1.95 (559-50)', iso: 559, width: 50 },
	{ group: 'Mountain bike', name: '26 x 2.125 (559-54)', iso: 559, width: 54 },
	{ group: 'Mountain bike', name: 'Fat bike 26 x 4.0 (559-102)', iso: 559, width: 102 },
	{ group: 'Small wheels', name: '24 x 1.75 (507-44)', iso: 507, width: 44 },
	{ group: 'Small wheels', name: '20 x 1.75 (406-44)', iso: 406, width: 44 },
	{ group: 'Small wheels', name: '20 x 1 1/8 (451-28)', iso: 451, width: 28 },
	{ group: 'Small wheels', name: '18 x 1.75 (355-44)', iso: 355, width: 44 },
	{ group: 'Small wheels', name: '16 x 1.75 (305-44)', iso: 305, width: 44 },
	{ group: 'Small wheels', name: '12 1/2 x 2.25 (203-57)', iso: 203, width: 57 }
];

/**
 * How much the tyre flattens underneath you, as a percentage of the free
 * circumference. Pressure matters more than anything else here.
 */
export const SQUASH = [
	{ id: 'hard', name: 'Hard road tyre, high pressure', percent: 0.3 },
	{ id: 'normal', name: 'Normal road or gravel tyre', percent: 0.6 },
	{ id: 'soft', name: 'Wide tyre, low pressure', percent: 1.0 },
	{ id: 'mtb', name: 'Mountain bike or fat tyre', percent: 1.5 }
];
