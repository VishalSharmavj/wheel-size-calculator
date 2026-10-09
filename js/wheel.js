/**
 * Wheel size and rolling circumference.
 *
 * Pure functions. No DOM, no dependencies — the same file runs in a browser,
 * in Node and in the test suite.
 *
 * All lengths are millimetres unless the name says otherwise.
 */

export const MM_PER_INCH = 25.4;

/**
 * Overall diameter of a wheel.
 *
 *     D = bead seat diameter + 2 x tyre height
 *
 * Tyre height is taken as equal to the tyre's measured width. That is the
 * standard assumption for a bicycle tyre — the casing is roughly circular in
 * section — and it holds from 23 mm road tyres up to 4 inch fat tyres.
 *
 * The bead seat diameter (the ISO number) is what actually sets the size. The
 * inch and French names are nicknames that repeat across different diameters,
 * which is the entire reason wheel sizing confuses people: a "26 inch" MTB
 * wheel and a "26 inch" cruiser wheel are not the same wheel.
 */
export function overallDiameter(isoDiameter, tyreWidth) {
	return isoDiameter + 2 * tyreWidth;
}

/** The circumference of that circle, before anyone sits on it. */
export function freeCircumference(isoDiameter, tyreWidth) {
	return Math.PI * overallDiameter(isoDiameter, tyreWidth);
}

/**
 * The number a bike computer actually wants.
 *
 * Not the circumference above. A computer counts wheel revolutions and
 * multiplies, so it needs how far the wheel *travels* in one turn with a rider
 * on it — and that is slightly less, because the tyre flattens where it meets
 * the road and the wheel's effective radius there is shorter.
 *
 * `squashPercent` is how much shorter. 0.6% is a reasonable default for a
 * normally inflated tyre. A hard road tyre is nearer 0.3%, a soft mountain bike
 * tyre nearer 1.5%, and the gap between those two is about 1% of your distance
 * — roughly 100 m in every 10 km.
 *
 * Measuring a roll-out skips the estimate entirely. See rollOut().
 */
export function rollingCircumference(isoDiameter, tyreWidth, squashPercent = 0.6) {
	return freeCircumference(isoDiameter, tyreWidth) * (1 - squashPercent / 100);
}

/**
 * Everything at once, including the revolution counts that make a wrong
 * setting easy to spot.
 */
export function wheel(isoDiameter, tyreWidth, squashPercent = 0.6) {
	const diameter = overallDiameter(isoDiameter, tyreWidth);
	const circumference = freeCircumference(isoDiameter, tyreWidth);
	const rolling = rollingCircumference(isoDiameter, tyreWidth, squashPercent);

	return {
		diameter,
		diameterInches: diameter / MM_PER_INCH,
		circumference,
		rolling,
		rollingInches: rolling / MM_PER_INCH,
		revsPerKm: rolling > 0 ? 1000000 / rolling : 0,
		revsPerMile: rolling > 0 ? 1609344 / rolling : 0,
		/** The ETRTO designation, e.g. "622-28". */
		iso: `${isoDiameter}-${Math.round(tyreWidth)}`
	};
}

/**
 * Turn a measured roll-out into the setting, which is the only way to get this
 * exactly right for your bike, your weight and your pressure.
 *
 * Mark the tyre and the floor at the valve, sit on the bike, roll forward in a
 * straight line for a whole number of turns, and measure between the marks.
 *
 * Several turns beat one: the measurement error is divided by the number of
 * turns, so three turns is three times as accurate for the same careful
 * tape work.
 */
export function rollOut(distanceMm, turns = 1) {
	if (!(turns > 0) || !(distanceMm > 0)) return 0;
	return distanceMm / turns;
}

/** How far out a given setting is, as a percentage of the correct one. */
export function settingError(setting, correct) {
	if (!(correct > 0) || !(setting > 0)) return 0;
	return ((setting - correct) / correct) * 100;
}

/** What that error costs you over a distance, in the same units. */
export function distanceDrift(setting, correct, overDistance) {
	return (settingError(setting, correct) / 100) * overDistance;
}
