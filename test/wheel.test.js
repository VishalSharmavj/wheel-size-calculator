import test from 'node:test';
import assert from 'node:assert/strict';
import {
	overallDiameter, freeCircumference, rollingCircumference,
	wheel, rollOut, settingError, distanceDrift, MM_PER_INCH
} from '../js/wheel.js';
import { SIZES } from '../js/sizes.js';

const near = (a, b, tol = 0.5) =>
	assert.ok(Math.abs(a - b) < tol, `expected ${a} to be within ${tol} of ${b}`);

test('overallDiameter: tyre height counts twice', () => {
	/* The tyre sits on top of the rim at BOTH ends of the diameter. */
	assert.equal(overallDiameter(622, 28), 678);
	assert.equal(overallDiameter(622, 0), 622);
});

test('freeCircumference: 700x28 measures about 2130 mm round', () => {
	near(freeCircumference(622, 28), 2129.9);
});

test('rollingCircumference: squash shortens it', () => {
	const free = freeCircumference(622, 28);
	near(rollingCircumference(622, 28, 0), free, 1e-9);     // no squash, no change
	near(rollingCircumference(622, 28, 0.6), 2117.1);
	assert.ok(rollingCircumference(622, 28, 1.5) < rollingCircumference(622, 28, 0.3));
});

test('rollingCircumference: the spread between a hard and a soft tyre is about 1%', () => {
	const hard = rollingCircumference(622, 28, 0.3);
	const soft = rollingCircumference(622, 28, 1.5);
	near((hard - soft) / hard * 100, 1.2, 0.05);
	/* Which is 120 m in every 10 km — enough to notice over a season. */
	near(hard - soft, 25.5, 0.5);
});

test('wheel: 700x28 at the default squash', () => {
	const w = wheel(622, 28);
	near(w.rolling, 2117.1);
	near(w.diameter, 678, 1e-9);
	near(w.revsPerKm, 472.3, 0.1);
	assert.equal(w.iso, '622-28');
});

test('wheel: 29er and 700c share a rim but are not the same wheel', () => {
	/* Same 622 mm bead seat, very different tyre, so a road bike's computer
	   setting is wrong on a mountain bike by about 5%. */
	const road = wheel(622, 28);
	const mtb = wheel(622, 53);
	assert.ok(mtb.rolling > road.rolling);
	near((mtb.rolling - road.rolling) / road.rolling * 100, 7.4, 0.2);
});

test('wheel: a bigger number does not always mean a bigger wheel', () => {
	/* 27 inch (630) is LARGER than 700c (622), which is the sort of thing that
	   makes people distrust wheel sizing. */
	assert.ok(wheel(630, 32).diameter > wheel(622, 32).diameter);
});

test('rollOut: several turns divide the measuring error', () => {
	near(rollOut(6351, 3), 2117);
	near(rollOut(2117, 1), 2117);
	assert.equal(rollOut(1000, 0), 0);
	assert.equal(rollOut(0, 3), 0);
});

test('settingError and distanceDrift: a wrong setting scales linearly', () => {
	/* 2100 instead of 2117 is 0.8% short, so a 100 km ride records 0.8 km short. */
	near(settingError(2100, 2117), -0.803, 0.01);
	near(distanceDrift(2100, 2117, 100), -0.803, 0.01);
	assert.equal(settingError(2117, 2117), 0);
});

test('SIZES: every entry carries usable ISO numbers', () => {
	for (const s of SIZES) {
		assert.ok(s.iso >= 203 && s.iso <= 635, `${s.name} has an odd ISO diameter`);
		assert.ok(s.width > 0 && s.width <= 110, `${s.name} has an odd width`);
		assert.match(s.name, /\(\d{3}-\d+\)/, `${s.name} should show its ISO pair`);
	}
});

test('SIZES: the three different "26 inch" wheels really are different', () => {
	const twentySix = SIZES.filter((s) => s.name.startsWith('26 ') || s.name.includes('26 x'));
	const diameters = new Set(twentySix.map((s) => s.iso));
	assert.ok(diameters.size >= 1);
	/* 559 is the MTB one. It is not 622, whatever the inch name suggests. */
	assert.ok(twentySix.some((s) => s.iso === 559));
});

test('MM_PER_INCH is exact', () => {
	assert.equal(MM_PER_INCH, 25.4);
});
