# Wheel Size Calculator

Work out the rolling circumference to put into a bike computer, from your rim's
ISO diameter and tyre width.

No dependencies, no build step, no framework. The maths lives in one small file
that runs unchanged in a browser, in Node, and in the test suite.

**[Try the full version on Bikeshala →](https://bikeshala.com/tools/wheel-size-calculator/)**

```
700 x 28 (622-28), normal tyre

Put this in your computer
2117 mm
211.7 cm · 83.4 in

diameter 678 mm · circumference 2130 mm · 472 turns per km
```

---

## Run it

```bash
git clone https://github.com/VishalSharmavj/wheel-size-calculator.git
cd wheel-size-calculator
python3 -m http.server 8000     # or: npm start
```

Then open <http://localhost:8000>. It needs a server rather than opening
`index.html` directly, because the JavaScript is split into ES modules and
browsers block module imports over `file://`.

```bash
npm test        # 12 tests, no dependencies
```

---

## Use the maths on its own

`js/wheel.js` imports nothing:

```js
import { wheel, rollOut, settingError } from './js/wheel.js';

const w = wheel(622, 28);      // ISO diameter, tyre width, optional squash %

w.rolling;       // 2117.1  ← the number your computer wants
w.circumference; // 2129.9     the wheel measured round
w.diameter;      // 678
w.revsPerKm;     // 472.3
w.iso;           // '622-28'

rollOut(6351, 3);              // 2117 — measured distance over 3 turns
settingError(2100, 2117.1);    // -0.81 (%)
```

---

## How it works

### Two circumferences, and only one of them is the answer

```
D = bead seat diameter + 2 × tyre width
C = π × D
```

A 622 mm rim with a 28 mm tyre is 678 mm across and **2130 mm** round.

That is not the number your computer wants. A computer counts wheel
revolutions and multiplies, so what it needs is how far the wheel actually
*travels* per turn — and that is less, because the tyre flattens where it meets
the road and the wheel's effective radius there is shorter.

```
rolling = C × (1 − squash%/100)
```

At the 0.6% default that gives **2117 mm**. The 13 mm gap is about 0.6% of your
distance: 60 metres in every 10 km.

### Why tyre width is doubled

Easy one to get wrong. The tyre sits on top of the rim at *both* ends of the
diameter, so its height counts twice. Tyre height is taken as equal to its
measured width — a bicycle tyre's casing is roughly circular in section — and
that holds from 23 mm road tyres up to 4 inch fat tyres.

### What squash is worth

| Tyre | Squash | 700×28 |
|---|---|---|
| Hard road tyre, high pressure | 0.3% | 2123 mm |
| Normal road or gravel | 0.6% | 2117 mm |
| Wide tyre, low pressure | 1.0% | 2109 mm |
| Mountain bike or fat | 1.5% | 2098 mm |

Hard to soft is about **1.2%**, or 25 mm of circumference — roughly 120 m in
every 10 km. Worth redoing a roll-out if you change pressure a lot.

### Measuring beats estimating

```js
rollOut(distanceMm, turns)
```

Mark the tyre and the floor at the valve, sit on the bike, roll forward in a
straight line, measure between the marks.

**Use several turns.** The error in your tape measurement is divided by the
number of turns, so three turns is three times as accurate for the same care.
It is the one way to account for your weight, your pressure and your tyre's
real shape at once.

### Why wheel sizing confuses everyone

The ISO (bead seat) diameter is the only unambiguous name. The inch and French
names are nicknames that repeat across unrelated diameters:

- there are **three different "26 inch" wheels**
- **27 inch is larger than 700c** — 630 mm against 622 mm
- **29er and 700c are the same rim**, 622 mm, but a 29×2.1 tyre makes the wheel
  7.4% bigger round than a 700×28, which is why a road bike's computer setting
  is badly wrong on a mountain bike

Every entry in `js/sizes.js` carries its ISO pair for exactly this reason, and
a test asserts that they all do.

---

## Layout

```
index.html          the UI
css/base.css        tokens, layout, inputs
css/calculator.css  result card, stats, validation
js/wheel.js         the maths — pure functions, no DOM, no imports
js/sizes.js         common wheel sizes and squash figures
js/app.js           the only file that knows a browser exists
test/wheel.test.js  12 tests, node --test
```

---

## What this version leaves out

A deliberately simplified build. The full version on Bikeshala also:

- checks **whatever number is already in your computer** and tells you how far
  out it is, and how much distance that has cost you
- carries the **full size chart** across road, MTB, fat and kids' wheels
- explains **reading the size off your tyre** when the sidewall is worn
- suggests a **wheel size for your height**

**[Wheel Size Calculator on Bikeshala →](https://bikeshala.com/tools/wheel-size-calculator/)**

---

## Licence

MIT — see [LICENSE](LICENSE).
