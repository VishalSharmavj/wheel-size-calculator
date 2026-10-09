/**
 * DOM wiring. The only file here that knows a browser exists.
 */
import { wheel, rollOut, MM_PER_INCH } from './wheel.js';
import { SIZES, SQUASH } from './sizes.js';

const $ = (id) => document.getElementById(id);
const num = (id) => parseFloat($(id).value);

function validate(iso, width, squash) {
	const problems = [];
	if (!(iso > 0)) problems.push('Enter the ISO rim diameter.');
	else if (iso < 150 || iso > 650) problems.push(`An ISO diameter of ${iso} mm is outside the range bicycle rims come in (203–635 mm). It is the smaller number on the sidewall, not the tyre's nominal size.`);
	if (!(width > 0)) problems.push('Enter the tyre width.');
	else if (width > 150) problems.push(`A ${width} mm tyre is wider than any bicycle tyre made. Widths are in millimetres — a 2.1 inch tyre is 53 mm.`);
	if (!(squash >= 0)) problems.push('Squash cannot be negative.');
	return problems;
}

function render() {
	const iso = num('iso'), width = num('width'), squash = num('squash');
	const problems = validate(iso, width, squash);

	$('problems').hidden = problems.length === 0;
	$('problems').innerHTML = problems.map((p) => `<li>${esc(p)}</li>`).join('');

	if (problems.length) {
		$('rolling').textContent = '—';
		$('rolling-alt').textContent = '';
		$('meta').innerHTML = '';
		for (const id of ['stat-dia', 'stat-circ', 'stat-revs', 'stat-iso']) $(id).textContent = '—';
		$('card-main').classList.add('is-empty');
		/* The roll-out comparison is against a figure we no longer have, so it
		   has to go too rather than linger with a stale verdict. */
		$('ro-out').hidden = true;
		return;
	}

	const w = wheel(iso, width, squash);
	$('card-main').classList.remove('is-empty');
	$('rolling').textContent = Math.round(w.rolling);
	$('rolling-alt').innerHTML = `${(w.rolling / 10).toFixed(1)} cm &middot; ${w.rollingInches.toFixed(1)} in`;
	$('meta').innerHTML = [
		`<li>${w.iso}</li>`,
		`<li>${squash}% squash</li>`
	].join('');

	$('stat-dia').textContent = `${Math.round(w.diameter)} mm`;
	$('stat-circ').textContent = `${Math.round(w.circumference)} mm`;
	$('stat-revs').textContent = Math.round(w.revsPerKm);
	$('stat-iso').textContent = w.iso;

	renderRollOut(w);
}

function renderRollOut(w) {
	const dist = parseFloat($('ro-dist').value);
	const turns = parseFloat($('ro-turns').value);
	const out = $('ro-out');
	if (!(dist > 0) || !(turns > 0)) { out.hidden = true; return; }

	const measured = rollOut(dist, turns);
	const diff = measured - w.rolling;
	out.hidden = false;
	out.innerHTML = `Measured: <b>${Math.round(measured)} mm</b> per turn. `
		+ (Math.abs(diff) < 5
			? 'That matches the estimate above — use either.'
			: `That is ${Math.abs(Math.round(diff))} mm ${diff > 0 ? 'more' : 'less'} than the estimate. `
				+ 'Trust the measurement: it knows your weight and pressure.');
}

function fillPresets() {
	const sel = $('size-preset');
	let group = null;
	for (const s of SIZES) {
		if (s.group !== group) {
			group = s.group;
			sel.insertAdjacentHTML('beforeend', `<optgroup label="${group}"></optgroup>`);
		}
		sel.lastElementChild.insertAdjacentHTML('beforeend',
			`<option value="${s.iso}:${s.width}">${s.name}</option>`);
	}
	sel.addEventListener('change', () => {
		if (!sel.value) return;
		const [iso, width] = sel.value.split(':');
		$('iso').value = iso;
		$('width').value = width;
		render();
	});

	const sq = $('squash-preset');
	for (const s of SQUASH) {
		sq.insertAdjacentHTML('beforeend',
			`<option value="${s.percent}"${s.percent === 0.6 ? ' selected' : ''}>${s.name}</option>`);
	}
	sq.addEventListener('change', () => { $('squash').value = sq.value; render(); });
}

function esc(s) {
	return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function init() {
	fillPresets();
	for (const ev of ['input', 'change']) document.addEventListener(ev, (e) => {
		if (e.target.closest('form') || e.target.id.startsWith('ro-')) render();
	});
	render();
}

init();
