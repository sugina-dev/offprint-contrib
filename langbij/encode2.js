"use strict";

// should have the three external functions: chr ord

function jaDualToKo0(c1, v1, c2, v2) {
	const cMap = c => {
		if (c == '') {
			return 0;
		} else {
			const idx = 'ksthnmrgzdb'.split('').indexOf(c);
			if (idx != -1)
				return idx + 1;
			else
				return 12;
		}
	};

	const jaVToKoV = ['uu','ui','iu','ou','oo','oi','io','oa','ue','eu','ea','au','ie','aa','ao','ae','ai','ia','uo','ua','ii'];

	if (c2 !== null && typeof c2 != 'undefined' && v2 !== null && typeof v2 != 'undefined') {
		const regularize12 =
			{ 'ya': 'a'
			, 'qi': 'i'
			, 'yu': 'u'
			, 'wa': 'e'
			, 'yo': 'o'
			};

		const c1x = cMap(c1),
			c2x = cMap(c2),
			mergeC = c1x * 13 + c2x;

		let regV1 = v1, regV2 = v2;
		if (c1x == 12)
			regV1 = regularize12[c1 + v1];
		if (c2x == 12)
			regV2 = regularize12[c2 + v2];

		const koV = jaVToKoV.indexOf(regV1 + regV2);

		if (koV != -1) {  // 13 * 13 * 21 = 169 * 21
			if (mergeC < 11 * 10) {  // 11 * 10 * 21 = 110 * 21 = 11(con) * 21(vow) * 10(pat)
				const koPat = mergeC % 10,
					koCon = mergeC / 10 | 0,
					koPatX = [21,1,8,4,7,19,16,17,27,20][koPat],  // 'ng','g','l','n','d','s','m','b','h','ss'
					koConX = [11,6,7,0,5,10,2,15,9,3,16][koCon];
				return { 'type': 1, 'con': koConX, 'vow': koV, 'pat': koPatX };
			} else {  // 59 * 21 = 5(con) * 21(vow) * 11(pat) + 21(vow) * 4(pat)
				const num = mergeC - 11 * 10,
					koPat = num % 11,
					koCon = num / 11 | 0,
					koPatX = [0,21,1,8,4,7,19,16,17,27,20][koPat],  // '','ng','g','l','n','d','s','m','b','h','ss'
					koConX = [12,14,1,4,13,8][koCon];  // [0-7 9-16] * 11 (0,21,1,8,4,7,19,16,17,27,20) + 8 * 4 (0,21,1,8)
				return { 'type': 1, 'con': koConX, 'vow': koV, 'pat': koPatX };
			}
		} else {  // 13 * 13 * 4
			let vId;
			if (regV1 + regV2 == 'oe') { vId = 0; }
			else if (regV1 + regV2 == 'eo') { vId = 1; }
			else if (regV1 + regV2 == 'ei') { vId = 2; }
			else if (regV1 + regV2 == 'ee') { vId = 3; }
			else { throw 'Error ' + regV1 + ' ' + regV2; }
			return { 'type': 3, 'num': mergeC * 4 + vId };
		}
	} else {  // 13 * 5
		const vMap = (c, v) => {
			if (cMap(c) != 12) { return 'aiueo'.split('').indexOf(v); }
			else if (c + v == 'ya') { return 0; }
			else if (c + v == 'qi') { return 1; }
			else if (c + v == 'yu') { return 2; }
			else if (c + v == 'wa') { return 3; }
			else if (c + v == 'yo') { return 4; }
			else { throw 'Error ' + c + ' ' + v; }
		};

		const c1x = cMap(c1), v1x = vMap(c1, v1);
		const koV = [13,20,0,8,5][v1x];  // aeiou -> uoiea
		const koCon =
			[ 11  // a -> ''
			, 15  // k -> 'k'
			, 9  // s -> 's'
			, 16  // t -> 't'
			, 18  // h -> 'h'
			, 2  // n -> 'n'
			, 6  // m -> 'm'
			, 5  // r -> 'l'
			, 0  // g -> 'g'
			, 17  // z -> 'p'
			, 3  // d -> 'd'
			, 7  // b -> 'b'
			, 10  // miscellaneous -> 'ss'
			][c1x];
		return { 'type': 2, 'con': koCon, 'vow': koV };
	}
}

function ko0ToKo(obj) {
	const mkKo = (con, vow, pat) => chr(ord('가') + con * 21 * 28 + vow * 28 + pat);
	switch (obj.type) {
		case 1:  // 13 * 13 * 21 = 3549
			return mkKo(obj.con, obj.vow, obj.pat);
		case 2:  // 13 * 5 = 65
			return mkKo(obj.con, obj.vow, 0);
		case 3:  // 13 * 13 * 4
			// to fill still empty blocks
			// con = 0,2,3,5,6,7,9,10,11,15,16,17,18, vow = not a,e,i,o,u, pat = 0 => 13 * 16 * 1 = 208
			// con = 8, vow = all, pat = 4,7,19,16,17,27,20 => 1 * 21 * 7 = 147
			// con = 17,18, vow = all, pat = not 0 => 2 * 21 * 10 = 420
			if (obj.num < 208) {
				const num = obj.num,
					vow = [1,2,3,4,6,7,9,10,11,12,14,15,16,17,18,19][num % 16],
					con = [0,2,3,5,6,7,9,10,11,15,16,17,18][num / 16 | 0];
				return mkKo(con, vow, 0);
			} else if (obj.num - 208 < 147) {
				const num = obj.num - 208,
					pat = [4,7,19,16,17,27,20][num % 7],
					vow = num / 7 | 0;
				return mkKo(8, vow, pat);
			} else if (obj.num - 208 - 147 < 420) {
				const num = obj.num - 208 - 147,
					pat = [21,1,8,4,7,19,16,17,27,20][num % 10],
					conVow = num / 10 | 0,
					vow = conVow % 21,
					con = [17,18][conVow / 21 | 0];
				return mkKo(con, vow, pat);
			}
	}
}

function convertAll(str) {
	return convertAll_aux(str, '');
}

function convertAll_aux(str, acc) {
	if (!str)
		return acc;
	else {
		const m = /^([^aeiou]?)([aeiou])([^aeiou]?)([aeiou])(.*)$/.exec(str);
		if (m)
			return convertAll_aux(m[5], acc + ko0ToKo(jaDualToKo0(m[1], m[2], m[3], m[4])));
		else {
			const n = /^([^aeiou]?)([aeiou])(.*)$/.exec(str);
			return convertAll_aux(n[3], acc + ko0ToKo(jaDualToKo0(n[1], n[2])));
		}
	}
}

//========================= UI

function handleConvert() {
	translitInput.value = convertInput.value.replace(/\b(([ksthnmrgzdb]?[aiueo]|wa|ya|yu|yo|qi)+)\b/g, ($0, $1) => $0.replace($1, convertAll($1)));
}

function test() {
	const v =
		[ [ ['','a'], ['','i'], ['','u'], ['','e'], ['','o'] ]
		, [ ['k','a'], ['k','i'], ['k','u'], ['k','e'], ['k','o'] ]
		, [ ['s','a'], ['s','i'], ['s','u'], ['s','e'], ['s','o'] ]
		, [ ['t','a'], ['t','i'], ['t','u'], ['t','e'], ['t','o'] ]
		, [ ['h','a'], ['h','i'], ['h','u'], ['h','e'], ['h','o'] ]
		, [ ['n','a'], ['n','i'], ['n','u'], ['n','e'], ['n','o'] ]
		, [ ['m','a'], ['m','i'], ['m','u'], ['m','e'], ['m','o'] ]
		, [ ['r','a'], ['r','i'], ['r','u'], ['r','e'], ['r','o'] ]
		, [ ['g','a'], ['g','i'], ['g','u'], ['g','e'], ['g','o'] ]
		, [ ['z','a'], ['z','i'], ['z','u'], ['z','e'], ['z','o'] ]
		, [ ['d','a'], ['d','i'], ['d','u'], ['d','e'], ['d','o'] ]
		, [ ['b','a'], ['b','i'], ['b','u'], ['b','e'], ['b','o'] ]
		, [ ['y','a'], ['q','i'], ['y','u'], ['w','a'], ['y','o'] ]
		];

	for (var i = 0; i < v.length; i++) {
		for (var j = 0; j < v[i].length; j++) {
			for (var k = 0; k < v.length; k++) {
				for (var l = 0; l < v[k].length; l++) {
					const a = v[i][j][0],
						b = v[i][j][1],
						c = v[k][l][0],
						d = v[k][l][1];
					console.log(a+b+c+d, ko0ToKo(jaDualToKo0(a, b, c, d)));
				}
			}
			const a = v[i][j][0],
				b = v[i][j][1];
			console.log(a+b, ko0ToKo(jaDualToKo0(a, b)));
		}
	}
}
