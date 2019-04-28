"use strict";

const alphas = [0,1,-1,2,3,-1,4,5,6,-1,7,-1,8,9,10,-1,-1,11,12,13,14,-1,-1,-1,-1,15];  /* 16 */
const ord = str => str.charCodeAt(0);
const chr = i => String.fromCodePoint(i);
const rows = ['가','개','갸','걔','거','게','겨','계','고','과','괘','괴','교','구','궈',
'궤','귀','규','그','긔','기','나','내','냐','냬','너','네','녀','녜','노','놔','놰','뇌',
'뇨','누','눠','눼','뉘','뉴','느','늬','니','다','대','댜','댸','더','데','뎌','뎨','도',
'돠','돼','되','됴','두','둬','뒈','뒤','듀','드','듸','디','라','래','랴','럐','러','레',
'려','례','로','롸','뢔','뢰','료','루','뤄','뤠','뤼','류','르','릐','리','마','매','먀',
'먜','머','메','며','몌','모','뫄','뫠','뫼','묘','무','뭐','뭬','뮈','뮤','므','믜','미',
'바','배','뱌','뱨','버','베','벼','볘','보','봐','봬','뵈','뵤','부','붜','붸','뷔','뷰',
'브','븨','비','사','새','샤','섀','서','세','셔','셰','소','솨','쇄','쇠','쇼','수','숴',
'쉐','쉬','슈','스','싀','시','아','애','야','얘','어','에','여','예','오','와','왜','외',
'요','우','워','웨','위','유','으','의','이','자','재','쟈','쟤','저','제','져','졔','조',
'좌','좨','죄','죠','주','줘','줴','쥐','쥬','즈','즤','지','차','채','챠','챼','처','체',
'쳐','쳬','초','촤','쵀','최','쵸','추','춰','췌','취','츄','츠','츼','치','카','캐','캬',
'컈','커','케','켜','켸','코','콰','쾌','쾨','쿄','쿠','쿼','퀘','퀴','큐','크','킈','키',
'타','태','탸','턔','터','테','텨','톄','토','톼','퇘','퇴','툐','투','퉈','퉤','튀','튜',
'트','틔','티','파','패','퍄','퍠','퍼','페','펴','폐','포','퐈','퐤','푀','표','푸','풔',
'풰','퓌','퓨','프','픠','피','하','해','햐','햬','허','헤','혀','혜','호','화','홰','회',
'효','후','훠','훼','휘','휴','흐','희','히'];  /* 294 */
const cols = [27,21,19,17,16,13,12,11,10,9,8,7,4,1,0];  /* 15 */

function romanizeHangulChar(ch) {
	const thisCode = ord(ch) - ord('가'),
		thisFin = thisCode % 28,
		thisIniVow = thisCode / 28 | 0,
		thisVow = thisIniVow % 21,
		thisIni = thisIniVow / 21 | 0;

	return ['g','kk','n','d','tt','l','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'][thisIni]
	+ ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'][thisVow]
	+ ['','g','kk','gs','n','nj','nh','d','l','lg','lm','lb','ls','lt','lp','lh','m','b','bs','s','ss','ng','j','ch','k','t','p','h'][thisFin];
}

function int4Tohangul(a, b, c) {
	if (typeof c !== 'undefined' && c !== null) {
		const i = (a * 1 << 8) + (b * 1 << 4) + c;
		return ord(rows[i % 294]) + cols[i / 294 | 0];
	} else if (typeof b !== 'undefined' && b !== null) {
		const i = (1 << 12) + (a * 1 << 4) + b;
		return ord(rows[i % 294]) + cols[i / 294 | 0];
	} else {
		const i = (1 << 12) + (1 << 8) + a;
		return ord(rows[i % 294]) + cols[i / 294 | 0];
	}
}

const romanizeHangulStr = xs => xs.split('').map(romanizeHangulChar).join('-');
const japaneseChToInt4 = x => alphas[ord(x) - ord('a')];
const int4ToJapaneseCh = x => chr(ord('a') + alphas.indexOf(x));
const int4ToBinaryStr = x => x.toString(16);
const int8ToBinaryStr = x => x.toString(16).padStart(2, '0');
const binaryDoubleCharToInt8 = x => parseInt(x, 16);
const binaryCharToInt4 = x => parseInt(x, 16);
const binaryStrToInt4Arr = xs => xs.split('').map(binaryCharToInt4);
const int4ArrToBinaryStr = xs => xs.map(int4ToBinaryStr).join('');
const int8ArrToBinaryStr = xs => Array.from(xs).map(int8ToBinaryStr).join('');
const encoder = new TextEncoder('utf-8');
const decoder = new TextDecoder('utf-8');
const u8StrToInt8Arr = s => encoder.encode(s);
const int8ArrToU8Str = x => decoder.decode(x);
const japaneseStrToInt4Arr = s => s.split('').map(japaneseChToInt4);
const int4ArrToJapaneseStr = xs => xs.map(int4ToJapaneseCh).join('');

function binaryStrToInt8Arr(xs) {
	var res = [];
	for (var i = 0, len = xs.length; i < len; i += 2)
		res.push(binaryDoubleCharToInt8(xs.substr(i, 2)));
	return Uint8Array.from(res);
}

function int4ArrToHangulStr(xs) {
	var res = '';
	for (var i = 0, len = xs.length; i < len; i += 3)
		res += chr(int4Tohangul(xs[i], xs[i + 1], xs[i + 2]));
	return res;
}

function hangulChToInt4Arr(ch) {
	const cp = ord(ch) - ord('가'),
		row = cp / 28 | 0, col = cp % 28,
		row2 = rows.indexOf(chr(ord('가') + row * 28)), col2 = cols.indexOf(col),
		i = col2 * 294 + row2;
	if (i >= (1 << 12) + (1 << 8)) {
		const a = i - (1 << 12) - (1 << 8);
		return [a];
	} else if (i >= (1 << 12)) {
		const j = i - (1 << 12),
			a = j / (1 << 4) | 0, b = j % (1 << 4);
		return [a, b];
	} else {
		const a = i / (1 << 8) | 0, k = i % (1 << 8),
			b = k / (1 << 4) | 0, c = k % (1 << 4);
		return [a, b, c];
	}
}

const hangulStrToInt4Arr = s => s.split('').map(hangulChToInt4Arr).flat(1);

function handleDecode() {
	if (decodeMethod.value == 'japanese')
		encodeInput.value = decodeOutput.value = decodeInput.value.replace(/\b([abdeghikmnorstuz]+)\b/g, ($0, $1) => $0.replace($1, int4ArrToBinaryStr(japaneseStrToInt4Arr($1))));
	else if (decodeMethod.value == 'hangul')
		encodeInput.value = decodeOutput.value = decodeInput.value.replace(/([가-힣]+)/g, ($0, $1) => $0.replace($1, int4ArrToBinaryStr(hangulStrToInt4Arr($1))));
	else if (decodeMethod.value == 'utf8')
		encodeInput.value = decodeOutput.value = decodeInput.value.replace(/(\S+)/g, ($0, $1) => $0.replace($1, int8ArrToBinaryStr(u8StrToInt8Arr($1))));
}

function handleEncode() {
	if (encodeMethod.value == 'hangul')
		translitInput.value = encodeOutput.value = encodeInput.value.replace(/\b([0-9a-f]+)\b/g, ($0, $1) => $0.replace($1, int4ArrToHangulStr(binaryStrToInt4Arr($1))));
	else if (encodeMethod.value == 'japanese')
		encodeOutput.value = encodeInput.value.replace(/\b([0-9a-f]+)\b/g, ($0, $1) => $0.replace($1, int4ArrToJapaneseStr(binaryStrToInt4Arr($1))));
	else if (encodeMethod.value == 'utf8')
		encodeOutput.value = encodeInput.value.replace(/\b([0-9a-f]+)\b/g, ($0, $1) => $0.replace($1, int8ArrToU8Str(binaryStrToInt8Arr($1))));
}

function handleTranslit() {
	translitOutput.value = translitInput.value.replace(/([가-힣]+)/g, ($0, $1) => $0.replace($1, romanizeHangulStr($1)));
}
