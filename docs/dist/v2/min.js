// node_modules/json-write-path/src/v4/utils/toArray.js
var e = (e) => Array.isArray(e) ? e : [e], t = (e, t, n) => {
	e[t] = n;
}, n = {
	set: t,
	push: (t, n, r) => {
		t[n].push(...e(r));
	},
	unshift: (t, n, r) => {
		t[n].unshift(...e(r));
	},
	pushToRows: (t, n, r) => {
		t[n].forEach((t) => {
			t.children.push(...structuredClone(e(r)));
		});
	},
	unshiftToRows: (t, n, r) => {
		t[n].forEach((t) => {
			t.children.unshift(...structuredClone(e(r)));
		});
	},
	unshiftSerialToRows: (e, t, n) => {
		e[t].forEach((e, t) => {
			let r = structuredClone(n);
			r.textContent = t + 1, e.children.unshift(r);
		});
	}
}, r = Object.defineProperty, i = Object.getOwnPropertySymbols, a = Object.prototype.hasOwnProperty, o = Object.prototype.propertyIsEnumerable, s = Math.pow, c = (e, t, n) => t in e ? r(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, l = (e, t) => {
	for (var n in t ||= {}) a.call(t, n) && c(e, n, t[n]);
	if (i) for (var n of i(t)) o.call(t, n) && c(e, n, t[n]);
	return e;
}, u = class extends Error {
	constructor(e, t, n) {
		super(n), this.name = "JSONPathSyntaxError", this.line = e, this.charPositionInLine = t, this.msg = n;
	}
}, d = class extends Error {
	constructor() {
		super(...arguments), this.name = "JSONPathLimitError";
	}
}, f = () => void 0, p = (e, t, n, r) => {
	if (r(), typeof e == "string" && typeof t == "string" && e.length === t.length && r(e.length), e === t) return !0;
	if (e === null || t === null || e === void 0 || t === void 0 || typeof e != typeof t || Array.isArray(e) !== Array.isArray(t)) return !1;
	if (Array.isArray(e) && Array.isArray(t)) {
		let r = y(e);
		return r === y(t) && (n.push({
			x: e,
			y: t,
			keys: null,
			length: r,
			i: 0
		}), !0);
	}
	if (typeof e == "object" && typeof t == "object") {
		let i = v(e), a = v(t);
		return r(i.length + a.length), i.length === a.length && (n.push({
			x: e,
			y: t,
			keys: i,
			length: i.length,
			i: 0
		}), !0);
	}
	return !1;
}, m = (e, t, n = f) => {
	let r = [];
	if (!p(e, t, r, n)) return !1;
	for (; r.length > 0;) {
		let e = r[r.length - 1];
		if (e.i >= e.length) r.pop();
		else if (e.keys === null) {
			let t = e.i++;
			if (!p(g(e.x, t), g(e.y, t), r, n)) return !1;
		} else {
			let t = e.i++, i = e.keys[t], a = e.x, o = e.y;
			if (n(i.length), !h(o, i) || !h(a, i)) return !1;
			let s = a[i];
			if (!h(o, i) || !p(s, o[i], r, n)) return !1;
		}
	}
	return !0;
}, h = (e, t) => Object.prototype.hasOwnProperty.call(e, t), g = (e, t) => h(e, t) ? e[t] : void 0, ee = 16383, _ = 1e3, v = (e) => {
	let t = Object.keys(e);
	for (let e of t) if (e.length > _) throw new d(`Member name too long (maximum ${_} characters)`);
	return t;
}, y = (e) => {
	let t = e.length;
	if (!Number.isSafeInteger(t) || t < 0 || t > 4294967295) throw TypeError("Invalid array length");
	return t;
}, b = (e) => e instanceof RangeError && /call stack/i.test(e.message), x = (e) => Array.isArray(e), te = (e) => e instanceof RangeError && /Invalid (string|array|typed array) length|maximum size exceeded/i.test(e.message), S = (e) => {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return t !== null && Object.getPrototypeOf(t) === null;
}, C = (e) => typeof e == "number", w = (e) => typeof e == "string", ne = (e) => e === void 0, T = (e) => e !== void 0;
function re(e) {
	if (!e || e.length === 0) return null;
	let t = null;
	for (let n = e.length - 1; n >= 0; n--) t = {
		type: "subscript",
		value: e[n],
		next: t
	};
	return t;
}
function ie(e) {
	return e.type === "root" || e.type === "current" || e.type === "functionCall" || e.type === "value" && (e.subtype === "boolean" || e.subtype === "null");
}
function ae(e, t, n) {
	return t.reduce((e, t) => n(e, t), e);
}
var oe = class extends SyntaxError {
	constructor(e, t, n, r) {
		super(e), this.expected = t, this.found = n, this.location = r, this.name = "SyntaxError";
	}
	format(e) {
		let t = "Error: " + this.message;
		if (this.location) {
			let n = null, r = e.find((e) => e.source === this.location.source);
			r && (n = r.text.split(/\r\n|\n|\r/g));
			let i = this.location.start, a = this.location.source && typeof this.location.source.offset == "function" ? this.location.source.offset(i) : i, o = this.location.source + ":" + a.line + ":" + a.column;
			if (n) {
				let e = this.location.end, r = "".padEnd(a.line.toString().length, " "), s = n[i.line - 1], c = (i.line === e.line ? e.column : s.length + 1) - i.column || 1;
				t += "\n --> " + o + "\n" + r + " |\n" + a.line + " | " + s + "\n" + r + " | " + "".padEnd(i.column - 1, " ") + "".padEnd(c, "^");
			} else t += "\n at " + o;
		}
		return t;
	}
	static buildMessage(e, t) {
		function n(e) {
			return e.codePointAt(0).toString(16).toUpperCase();
		}
		let r = Object.prototype.hasOwnProperty.call(RegExp.prototype, "unicode") ? /* @__PURE__ */ RegExp("[\\p{C}\\p{Mn}\\p{Mc}]", "gu") : null;
		function i(e) {
			return r ? e.replace(r, (e) => "\\u{" + n(e) + "}") : e;
		}
		function a(e) {
			return i(e.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, (e) => "\\x0" + n(e)).replace(/[\x10-\x1F\x7F-\x9F]/g, (e) => "\\x" + n(e)));
		}
		function o(e) {
			return i(e.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, (e) => "\\x0" + n(e)).replace(/[\x10-\x1F\x7F-\x9F]/g, (e) => "\\x" + n(e)));
		}
		let s = {
			literal(e) {
				return "\"" + a(e.text) + "\"";
			},
			class(e) {
				let t = e.parts.map((e) => Array.isArray(e) ? o(e[0]) + "-" + o(e[1]) : o(e));
				return "[" + (e.inverted ? "^" : "") + t.join("") + "]" + (e.unicode ? "u" : "");
			},
			any() {
				return "any character";
			},
			end() {
				return "end of input";
			},
			other(e) {
				return e.description;
			}
		};
		function c(e) {
			return s[e.type](e);
		}
		function l(e) {
			let t = e.map(c);
			if (t.sort(), t.length > 0) {
				let e = 1;
				for (let n = 1; n < t.length; n++) t[n - 1] !== t[n] && (t[e] = t[n], e++);
				t.length = e;
			}
			switch (t.length) {
				case 1: return t[0];
				case 2: return t[0] + " or " + t[1];
				default: return t.slice(0, -1).join(", ") + ", or " + t[t.length - 1];
			}
		}
		function u(e) {
			return e ? "\"" + a(e) + "\"" : "end of input";
		}
		return "Expected " + l(e) + " but " + u(t) + " found.";
	}
};
function se(e, t) {
	t = t === void 0 ? {} : t;
	let n = {}, r = t.grammarSource, i = { jsonpath: zr }, a = zr, o = "length", s = "count", c = "match", l = "search", u = "value", d = "subsetof", f = "anyof", p = "noneof", m = "sizeof", h = "size", g = "empty", ee = "true", _ = "false", v = "null", y = /^[,\]]/, b = /^[+\-]/, x = /^[*\/]/, te = /^[a-zA-Z_]/, S = /^[\x80-\uFFFF_]/, C = /^[a-zA-Z0-9_]/, w = /^[0-9@$\-]/, ne = /^[^\/\\]/, T = /^[gimsuy]/, se = /^[a-zA-Z_\x80-\uD7FF\uE000-\uFFFF]/, ce = /^[\uD800-\uDBFF]/, le = /^[\uDC00-\uDFFF]/, E = /^[0-9]/, ue = /^[1-9]/, de = /^[eE]/, fe = /^["\\]/, pe = /^['\\]/, me = /^[ -\uD7FF\uE000-\uFFFF]/, he = /^[dD]/, ge = /^[89abAB]/, _e = /^[c-fC-F]/, ve = /^[0-9a-fA-F]/, ye = /^[ \t\n\r]/, be = q([",", "]"], !1, !1, !1), xe = K("length", !1), Se = K("count", !1), Ce = K("match", !1), we = K("search", !1), Te = K("value", !1), D = q(["+", "-"], !1, !1, !1), Ee = q(["*", "/"], !1, !1, !1), De = Pr("string"), Oe = q([
		["a", "z"],
		["A", "Z"],
		"_"
	], !1, !1, !1), ke = q([["", "￿"], "_"], !1, !1, !1), O = q([
		["a", "z"],
		["A", "Z"],
		["0", "9"],
		"_"
	], !1, !1, !1), k = K("-", !1), Ae = q([
		["0", "9"],
		"@",
		"$",
		"-"
	], !1, !1, !1), je = K("$", !1), Me = K("@", !1), Ne = K("..", !1), Pe = K(".", !1), Fe = K("*", !1), Ie = K("&&", !1), Le = K("||", !1), Re = K("!", !1), ze = K("==", !1), Be = K("!=", !1), Ve = K(">=", !1), He = K(">", !1), Ue = K("<=", !1), We = K("<", !1), Ge = K("=~", !1), Ke = K("in", !1), qe = K("nin", !1), Je = K("subsetof", !1), Ye = K("anyof", !1), Xe = K("noneof", !1), Ze = K("sizeof", !1), Qe = K("size", !1), $e = K("empty", !1), et = K("true", !1), tt = K("false", !1), nt = K("null", !1), rt = K("{", !1), it = K("}", !1), at = K("[", !1), ot = K("]", !1), st = K(":", !1), ct = K(",", !1), lt = K("(", !1), ut = K(")", !1), dt = K("?", !1), ft = Pr("regex"), pt = K("/", !1), mt = q(["/", "\\"], !0, !1, !1), A = K("\\", !1), ht = Mr(), gt = q([
		"g",
		"i",
		"m",
		"s",
		"u",
		"y"
	], !1, !1, !1), _t = q([
		["a", "z"],
		["A", "Z"],
		"_",
		["", "퟿"],
		["", "￿"]
	], !1, !1, !1), vt = q([["\ud800", "\udbff"]], !1, !1, !1), yt = q([["\udc00", "\udfff"]], !1, !1, !1), j = q([["0", "9"]], !1, !1, !1), bt = Pr("number"), xt = K("0", !1), St = q([["1", "9"]], !1, !1, !1), Ct = Pr("integer"), wt = q(["e", "E"], !1, !1, !1), M = K("\"", !1), N = K("'", !1), P = q(["\"", "\\"], !1, !1, !1), Tt = q(["'", "\\"], !1, !1, !1), F = q([[" ", "퟿"], ["", "￿"]], !1, !1, !1), Et = K("b", !1), Dt = K("f", !1), Ot = K("n", !1), kt = K("r", !1), At = K("t", !1), jt = K("u", !1), Mt = q(["d", "D"], !1, !1, !1), Nt = q([
		"8",
		"9",
		"a",
		"b",
		"A",
		"B"
	], !1, !1, !1), Pt = K("\\u", !1), Ft = q([["c", "f"], ["C", "F"]], !1, !1, !1), It = q([
		["0", "9"],
		["a", "f"],
		["A", "F"]
	], !1, !1, !1), Lt = q([
		" ",
		"	",
		"\n",
		"\r"
	], !1, !1, !1);
	function Rt(e) {
		return {
			type: "root",
			next: re(e)
		};
	}
	function zt(e) {
		return e.map((e) => e[1]);
	}
	function Bt(e) {
		return {
			type: "dot",
			value: e
		};
	}
	function Vt(e) {
		return e;
	}
	function Ht(e) {
		return {
			type: "dotdot",
			value: e
		};
	}
	function Ut() {
		return { type: "wildcard" };
	}
	function Wt(e) {
		return {
			type: "identifier",
			value: e
		};
	}
	function I() {
		return { type: "wildcard" };
	}
	function Gt(e) {
		return {
			type: "identifier",
			value: e
		};
	}
	function Kt(e) {
		return e;
	}
	function qt(e) {
		return e;
	}
	function L(e, t) {
		return t.length > 0 ? {
			type: "bracketExpression",
			value: {
				type: "unions",
				values: [e, ...t.map((e) => e[3])]
			}
		} : {
			type: e.type === "numericLiteral" || e.type === "stringLiteral" || e.type === "identifier" ? "bracketMember" : "bracketExpression",
			value: e
		};
	}
	function Jt(e) {
		return {
			type: "filterExpression",
			value: e
		};
	}
	function Yt(e) {
		return {
			type: "filterExpression",
			value: e
		};
	}
	function Xt(e, t) {
		return ae(e, t, (e, t) => ({
			type: "logicalExpression",
			operator: "or",
			left: e,
			right: t[3]
		}));
	}
	function Zt(e, t) {
		return ae(e, t, (e, t) => ({
			type: "logicalExpression",
			operator: "and",
			left: e,
			right: t[3]
		}));
	}
	function Qt(e) {
		return {
			type: "notExpression",
			value: e
		};
	}
	function $t(e) {
		return {
			type: "notExpression",
			value: e
		};
	}
	function en(e, t) {
		return t !== null || ie(e);
	}
	function tn(e, t) {
		if (t === null) return e;
		let n = t[1];
		return n.operator === "reg" ? {
			type: "comparator",
			operator: "reg",
			left: e,
			right: n.right
		} : n.operator === "empty" ? {
			type: "comparator",
			operator: "empty",
			left: e,
			right: null
		} : {
			type: "comparator",
			operator: n.operator,
			left: e,
			right: n.right
		};
	}
	function nn(e, t) {
		return {
			operator: e,
			right: t
		};
	}
	function rn(e) {
		return {
			operator: "reg",
			right: e
		};
	}
	function an() {
		return { operator: "empty" };
	}
	function on() {
		return "eq";
	}
	function sn() {
		return "ne";
	}
	function cn() {
		return "le";
	}
	function R() {
		return "lt";
	}
	function ln() {
		return "ge";
	}
	function un() {
		return "gt";
	}
	function dn() {
		return "in";
	}
	function fn() {
		return "nin";
	}
	function pn() {
		return "subsetof";
	}
	function mn() {
		return "anyof";
	}
	function hn() {
		return "noneof";
	}
	function gn() {
		return "sizeof";
	}
	function _n() {
		return "size";
	}
	function vn(e) {
		return {
			type: "groupExpression",
			value: e
		};
	}
	function yn() {
		return {
			type: "value",
			value: !0,
			subtype: "boolean"
		};
	}
	function bn() {
		return {
			type: "value",
			value: !1,
			subtype: "boolean"
		};
	}
	function xn() {
		return {
			type: "value",
			value: null,
			subtype: "null"
		};
	}
	function Sn(e, t) {
		return {
			type: "functionCall",
			name: e,
			args: t || []
		};
	}
	function Cn() {
		return "length";
	}
	function wn() {
		return "count";
	}
	function Tn() {
		return "match";
	}
	function En() {
		return "search";
	}
	function Dn() {
		return "value";
	}
	function On(e, t) {
		return [e, ...t.map((e) => e[3])];
	}
	function kn(e, t) {
		return t.length === 0 ? e : ae(e, t, (e, t) => ({
			type: "operation",
			operator: t[1] === "+" ? "plus" : "minus",
			left: e,
			right: t[3]
		}));
	}
	function An(e, t) {
		return t.length === 0 ? e : ae(e, t, (e, t) => ({
			type: "operation",
			operator: t[1] === "*" ? "multi" : "div",
			left: e,
			right: t[3]
		}));
	}
	function jn(e) {
		return {
			type: "groupOperation",
			value: e
		};
	}
	function Mn(e) {
		return {
			type: "root",
			next: re(e)
		};
	}
	function Nn(e) {
		return {
			type: "current",
			next: re(e)
		};
	}
	function Pn(e, t, n) {
		return {
			type: "slices",
			start: e === null ? null : e[0],
			end: t === null ? null : t[0],
			step: n ? n[2] === null ? null : n[2] : null
		};
	}
	function Fn() {
		return { type: "wildcard" };
	}
	function In(e) {
		return {
			type: "numericLiteral",
			value: e
		};
	}
	function Ln(e) {
		return {
			type: "stringLiteral",
			value: $(e)
		};
	}
	function Rn(e) {
		return {
			type: "identifier",
			value: e
		};
	}
	function zn(e, t) {
		return {
			type: "value",
			subtype: "regex",
			value: e,
			opts: t || ""
		};
	}
	function Bn(e) {
		return {
			type: "value",
			subtype: "string",
			value: e
		};
	}
	function Vn(e) {
		return {
			type: "value",
			subtype: "number",
			value: e
		};
	}
	function Hn() {
		return {
			type: "value",
			value: !0,
			subtype: "boolean"
		};
	}
	function Un() {
		return {
			type: "value",
			value: !1,
			subtype: "boolean"
		};
	}
	function Wn() {
		return {
			type: "value",
			value: null,
			subtype: "null"
		};
	}
	function Gn(e) {
		return e;
	}
	function Kn(e) {
		for (let [t] of e || []) $(t);
		return {
			type: "value",
			subtype: "object",
			value: Object.fromEntries(e || [])
		};
	}
	function qn(e, t) {
		return [e, ...t.map((e) => e[3])];
	}
	function Jn(e, t) {
		return [e, t.value];
	}
	function Yn(e) {
		return {
			type: "value",
			subtype: "array",
			value: e || []
		};
	}
	function Xn(e, t) {
		return [e.value, ...t.map((e) => e[3].value)];
	}
	function Zn(e) {
		return $(e);
	}
	function Qn(e) {
		return $(e);
	}
	function $n() {
		return "true";
	}
	function er() {
		return "false";
	}
	function tr() {
		return "null";
	}
	function nr(e) {
		return $(e);
	}
	function rr() {
		return "true";
	}
	function ir() {
		return "false";
	}
	function ar() {
		return "null";
	}
	function or(e) {
		return "/" + e.map((e) => Array.isArray(e) ? e.join("") : e).join("") + "/";
	}
	function sr(e) {
		return e.join("");
	}
	function cr(e, t) {
		let n = parseFloat(kr());
		return !e && !t && (n < -9007199254740991 || n > 9007199254740991) && Ar("Integer out of I-JSON range [-(2^53)+1, (2^53)-1]"), n;
	}
	function lr() {
		let e = parseInt(kr(), 10);
		return (e < -9007199254740991 || e > 9007199254740991) && Ar("Integer out of I-JSON range [-(2^53)+1, (2^53)-1]"), e;
	}
	function ur(e) {
		return e.join("");
	}
	function dr(e) {
		return e.join("");
	}
	function fr(e) {
		return e;
	}
	function pr() {
		return "\"";
	}
	function mr(e) {
		return e;
	}
	function z(e) {
		return e;
	}
	function hr() {
		return "'";
	}
	function B(e) {
		return e;
	}
	function gr() {
		return "\\";
	}
	function _r() {
		return "/";
	}
	function vr() {
		return "\b";
	}
	function yr() {
		return "\f";
	}
	function br() {
		return "\n";
	}
	function xr() {
		return "\r";
	}
	function Sr() {
		return "	";
	}
	function Cr(e, t) {
		return String.fromCharCode(parseInt(e, 16), parseInt(t, 16));
	}
	function wr(e) {
		let t = parseInt(e, 16);
		return t >= 55296 && t <= 57343;
	}
	function Tr(e) {
		return String.fromCharCode(parseInt(e, 16));
	}
	let V = t.peg$currPos | 0, H = V, U = [{
		line: 1,
		column: 1
	}], W = V, Er = t.peg$maxFailExpected || [], G = t.peg$silentFails | 0, Dr = /* @__PURE__ */ new Map(), Or;
	if (t.startRule) {
		if (!(t.startRule in i)) throw Error("Can't start parsing from rule \"" + t.startRule + "\".");
		a = i[t.startRule];
	}
	function kr() {
		return e.substring(H, V);
	}
	function Ar(e, t) {
		throw t = t === void 0 ? Ir(H, V) : t, Lr(e, t);
	}
	function jr(t = V) {
		let n = e.codePointAt(t);
		return n === void 0 ? "" : String.fromCodePoint(n);
	}
	function K(e, t) {
		return {
			type: "literal",
			text: e,
			ignoreCase: t
		};
	}
	function q(e, t, n, r) {
		return {
			type: "class",
			parts: e,
			inverted: t,
			ignoreCase: n,
			unicode: r
		};
	}
	function Mr() {
		return { type: "any" };
	}
	function Nr() {
		return { type: "end" };
	}
	function Pr(e) {
		return {
			type: "other",
			description: e
		};
	}
	function Fr(t) {
		let n = U[t], r;
		if (n) return n;
		if (t >= U.length) r = U.length - 1;
		else for (r = t; !U[--r];);
		for (n = U[r], n = {
			line: n.line,
			column: n.column
		}; r < t;) e.charCodeAt(r) === 10 ? (n.line++, n.column = 1) : n.column++, r++;
		return U[t] = n, n;
	}
	function Ir(e, t, n) {
		let i = Fr(e), a = Fr(t), o = {
			source: r,
			start: {
				offset: e,
				line: i.line,
				column: i.column
			},
			end: {
				offset: t,
				line: a.line,
				column: a.column
			}
		};
		return n && r && typeof r.offset == "function" && (o.start = r.offset(o.start), o.end = r.offset(o.end)), o;
	}
	function J(e) {
		V < W || (V > W && (W = V, Er = []), Er.push(e));
	}
	function Lr(e, t) {
		return new oe(e, null, null, t);
	}
	function Rr(e, t, n) {
		return new oe(oe.buildMessage(e, t), e, t, n);
	}
	function zr() {
		let e, t, r, i;
		return e = V, t = Ci(), t === n ? (V = e, e = n) : (r = Br(), i = _a(), i === n ? (V = e, e = n) : (H = e, e = Rt(r))), e;
	}
	function Br() {
		let e, t, r, i, a;
		for (e = V, t = [], r = V, i = Q(), a = Vr(), a === n ? (V = r, r = n) : (i = [i, a], r = i); r !== n;) t.push(r), r = V, i = Q(), a = Vr(), a === n ? (V = r, r = n) : (i = [i, a], r = i);
		return H = e, t = zt(t), e = t, e;
	}
	function Vr() {
		let e;
		return e = Ur(), e === n && (e = Hr()), e;
	}
	function Hr() {
		let e, t, r;
		return e = V, t = Ei(), t === n ? (V = e, e = n) : (r = Wr(), r === n ? (V = e, e = n) : (H = e, e = Bt(r))), e === n && (e = V, t = Kr(), t !== n && (H = e, t = Vt(t)), e = t), e;
	}
	function Ur() {
		let e, t, r;
		return e = V, t = Ti(), t === n ? (V = e, e = n) : (r = Gr(), r === n ? (V = e, e = n) : (H = e, e = Ht(r))), e;
	}
	function Wr() {
		let e, t;
		return e = V, t = Di(), t !== n && (H = e, t = Ut()), e = t, e === n && (e = V, t = Si(), t !== n && (H = e, t = Wt(t)), e = t), e;
	}
	function Gr() {
		let e, t;
		return e = V, t = Di(), t !== n && (H = e, t = I()), e = t, e === n && (e = V, t = Si(), t !== n && (H = e, t = Gt(t)), e = t, e === n && (e = V, t = Kr(), t !== n && (H = e, t = Kt(t)), e = t)), e;
	}
	function Kr() {
		let e, t, r, i;
		return e = V, t = Zi(), t === n ? (V = e, e = n) : (Q(), r = qr(), r === n ? (V = e, e = n) : (Q(), i = Qi(), i === n ? (V = e, e = n) : (H = e, e = qt(r)))), e;
	}
	function qr() {
		let e, t, r, i, a, o, s, c;
		if (e = V, t = di(), t !== n) {
			for (r = [], i = V, a = Q(), o = Y(), o === n ? (V = i, i = n) : (s = Q(), c = di(), c === n ? (V = i, i = n) : (a = [
				a,
				o,
				s,
				c
			], i = a)); i !== n;) r.push(i), i = V, a = Q(), o = Y(), o === n ? (V = i, i = n) : (s = Q(), c = di(), c === n ? (V = i, i = n) : (a = [
				a,
				o,
				s,
				c
			], i = a));
			H = e, e = L(t, r);
		} else V = e, e = n;
		return e;
	}
	function Jr() {
		let t, r, i, a, o, s, c, l, u;
		return t = V, r = na(), r === n ? (V = t, t = n) : (Q(), i = ea(), i === n ? (V = t, t = n) : (Q(), a = Yr(), a === n ? (V = t, t = n) : (Q(), o = ta(), o === n ? (V = t, t = n) : (s = V, G++, c = V, l = Q(), u = e.charAt(V), y.test(u) ? V++ : (u = n, G === 0 && J(be)), u === n ? (V = c, c = n) : (l = [l, u], c = l), G--, c === n ? s = n : (V = s, s = void 0), s === n ? (V = t, t = n) : (H = t, t = Jt(a)))))), t === n && (t = V, r = na(), r === n ? (V = t, t = n) : (Q(), i = Yr(), i === n ? (V = t, t = n) : (H = t, t = Yt(i)))), t;
	}
	function Yr() {
		let e, t, r, i, a, o, s, c, l = V * 91 + 10, u = Dr.get(l);
		if (u) return V = u.nextPos, u.result;
		if (e = V, t = Xr(), t !== n) {
			for (r = [], i = V, a = Q(), o = ki(), o === n ? (V = i, i = n) : (s = Q(), c = Xr(), c === n ? (V = i, i = n) : (a = [
				a,
				o,
				s,
				c
			], i = a)); i !== n;) r.push(i), i = V, a = Q(), o = ki(), o === n ? (V = i, i = n) : (s = Q(), c = Xr(), c === n ? (V = i, i = n) : (a = [
				a,
				o,
				s,
				c
			], i = a));
			H = e, e = Xt(t, r);
		} else V = e, e = n;
		return Dr.set(l, {
			nextPos: V,
			result: e
		}), e;
	}
	function Xr() {
		let e, t, r, i, a, o, s, c;
		if (e = V, t = Zr(), t !== n) {
			for (r = [], i = V, a = Q(), o = Oi(), o === n ? (V = i, i = n) : (s = Q(), c = Zr(), c === n ? (V = i, i = n) : (a = [
				a,
				o,
				s,
				c
			], i = a)); i !== n;) r.push(i), i = V, a = Q(), o = Oi(), o === n ? (V = i, i = n) : (s = Q(), c = Zr(), c === n ? (V = i, i = n) : (a = [
				a,
				o,
				s,
				c
			], i = a));
			H = e, e = Zt(t, r);
		} else V = e, e = n;
		return e;
	}
	function Zr() {
		let e, t, r, i, a;
		return e = V, t = Ai(), t === n ? (V = e, e = n) : (Q(), r = ea(), r === n ? (V = e, e = n) : (Q(), i = Yr(), i === n ? (V = e, e = n) : (Q(), a = ta(), a === n ? (V = e, e = n) : (H = e, e = Qt(i))))), e === n && (e = V, t = Ai(), t === n ? (V = e, e = n) : (Q(), r = ti(), r === n ? (V = e, e = n) : (H = e, e = $t(r))), e === n && (e = Qr())), e;
	}
	function Qr() {
		let e, t, r, i, a;
		return e = V, t = oi(), t === n ? (V = e, e = n) : (r = V, i = Q(), a = $r(), a === n ? (V = r, r = n) : (i = [i, a], r = i), r === n && (r = null), H = V, i = en(t, r), i = i ? void 0 : n, i === n ? (V = e, e = n) : (H = e, e = tn(t, r))), e === n && (e = ti()), e;
	}
	function $r() {
		let e, t, r;
		return e = V, t = ei(), t === n ? (V = e, e = n) : (Q(), r = oi(), r === n ? (V = e, e = n) : (H = e, e = nn(t, r))), e === n && (e = V, t = Li(), t === n ? (V = e, e = n) : (Q(), r = fi(), r === n ? (V = e, e = n) : (H = e, e = rn(r))), e === n && (e = V, t = Gi(), t !== n && (H = e, t = an()), e = t)), e;
	}
	function ei() {
		let e, t;
		return e = V, t = ji(), t !== n && (H = e, t = on()), e = t, e === n && (e = V, t = Mi(), t !== n && (H = e, t = sn()), e = t, e === n && (e = V, t = Fi(), t !== n && (H = e, t = cn()), e = t, e === n && (e = V, t = Ii(), t !== n && (H = e, t = R()), e = t, e === n && (e = V, t = Ni(), t !== n && (H = e, t = ln()), e = t, e === n && (e = V, t = Pi(), t !== n && (H = e, t = un()), e = t, e === n && (e = V, t = Ri(), t !== n && (H = e, t = dn()), e = t, e === n && (e = V, t = zi(), t !== n && (H = e, t = fn()), e = t, e === n && (e = V, t = Bi(), t !== n && (H = e, t = pn()), e = t, e === n && (e = V, t = Vi(), t !== n && (H = e, t = mn()), e = t, e === n && (e = V, t = Hi(), t !== n && (H = e, t = hn()), e = t, e === n && (e = V, t = Ui(), t !== n && (H = e, t = gn()), e = t, e === n && (e = V, t = Wi(), t !== n && (H = e, t = _n()), e = t)))))))))))), e;
	}
	function ti() {
		let e, t, r, i;
		return e = V, t = ea(), t === n ? (V = e, e = n) : (Q(), r = Yr(), r === n ? (V = e, e = n) : (Q(), i = ta(), i === n ? (V = e, e = n) : (H = e, e = vn(r)))), e === n && (e = ni(), e === n && (e = li(), e === n && (e = V, t = Ki(), t !== n && (H = e, t = yn()), e = t, e === n && (e = V, t = qi(), t !== n && (H = e, t = bn()), e = t, e === n && (e = V, t = Ji(), t !== n && (H = e, t = xn()), e = t))))), e;
	}
	function ni() {
		let e, t, r, i, a;
		return e = V, t = ri(), t === n ? (V = e, e = n) : (r = ea(), r === n ? (V = e, e = n) : (Q(), i = ii(), i === n && (i = null), Q(), a = ta(), a === n ? (V = e, e = n) : (H = e, e = Sn(t, i)))), e;
	}
	function ri() {
		let t, r;
		return t = V, e.substr(V, 6) === o ? (r = o, V += 6) : (r = n, G === 0 && J(xe)), r !== n && (H = t, r = Cn()), t = r, t === n && (t = V, e.substr(V, 5) === s ? (r = s, V += 5) : (r = n, G === 0 && J(Se)), r !== n && (H = t, r = wn()), t = r, t === n && (t = V, e.substr(V, 5) === c ? (r = c, V += 5) : (r = n, G === 0 && J(Ce)), r !== n && (H = t, r = Tn()), t = r, t === n && (t = V, e.substr(V, 6) === l ? (r = l, V += 6) : (r = n, G === 0 && J(we)), r !== n && (H = t, r = En()), t = r, t === n && (t = V, e.substr(V, 5) === u ? (r = u, V += 5) : (r = n, G === 0 && J(Te)), r !== n && (H = t, r = Dn()), t = r)))), t;
	}
	function ii() {
		let e, t, r, i, a, o, s, c;
		if (e = V, t = ai(), t !== n) {
			for (r = [], i = V, a = Q(), o = Y(), o === n ? (V = i, i = n) : (s = Q(), c = ai(), c === n ? (V = i, i = n) : (a = [
				a,
				o,
				s,
				c
			], i = a)); i !== n;) r.push(i), i = V, a = Q(), o = Y(), o === n ? (V = i, i = n) : (s = Q(), c = ai(), c === n ? (V = i, i = n) : (a = [
				a,
				o,
				s,
				c
			], i = a));
			H = e, e = On(t, r);
		} else V = e, e = n;
		return e;
	}
	function ai() {
		let e;
		return e = oi(), e === n && (e = mi()), e;
	}
	function oi() {
		let t, r, i, a, o, s, c, l, u = V * 91 + 21, d = Dr.get(u);
		if (d) return V = d.nextPos, d.result;
		if (t = V, r = si(), r !== n) {
			for (i = [], a = V, o = Q(), s = e.charAt(V), b.test(s) ? V++ : (s = n, G === 0 && J(D)), s === n ? (V = a, a = n) : (c = Q(), l = si(), l === n ? (V = a, a = n) : (o = [
				o,
				s,
				c,
				l
			], a = o)); a !== n;) i.push(a), a = V, o = Q(), s = e.charAt(V), b.test(s) ? V++ : (s = n, G === 0 && J(D)), s === n ? (V = a, a = n) : (c = Q(), l = si(), l === n ? (V = a, a = n) : (o = [
				o,
				s,
				c,
				l
			], a = o));
			H = t, t = kn(r, i);
		} else V = t, t = n;
		return Dr.set(u, {
			nextPos: V,
			result: t
		}), t;
	}
	function si() {
		let t, r, i, a, o, s, c, l;
		if (t = V, r = ci(), r !== n) {
			for (i = [], a = V, o = Q(), s = e.charAt(V), x.test(s) ? V++ : (s = n, G === 0 && J(Ee)), s === n ? (V = a, a = n) : (c = Q(), l = ci(), l === n ? (V = a, a = n) : (o = [
				o,
				s,
				c,
				l
			], a = o)); a !== n;) i.push(a), a = V, o = Q(), s = e.charAt(V), x.test(s) ? V++ : (s = n, G === 0 && J(Ee)), s === n ? (V = a, a = n) : (c = Q(), l = ci(), l === n ? (V = a, a = n) : (o = [
				o,
				s,
				c,
				l
			], a = o));
			H = t, t = An(r, i);
		} else V = t, t = n;
		return t;
	}
	function ci() {
		let e, t, r, i;
		return e = V, t = ea(), t === n ? (V = e, e = n) : (Q(), r = oi(), r === n ? (V = e, e = n) : (Q(), i = ta(), i === n ? (V = e, e = n) : (H = e, e = jn(r)))), e === n && (e = ni(), e === n && (e = pi(), e === n && (e = li()))), e;
	}
	function li() {
		let e, t, r;
		return e = V, t = Ci(), t === n ? (V = e, e = n) : (r = Br(), r === n ? (V = e, e = n) : (H = e, e = Mn(r))), e === n && (e = V, t = wi(), t === n ? (V = e, e = n) : (r = Br(), r === n ? (V = e, e = n) : (H = e, e = Nn(r)))), e;
	}
	function ui() {
		let e, t, r, i, a, o, s, c, l;
		return e = V, t = V, r = ua(), r === n ? (V = t, t = n) : (i = Q(), r = [r, i], t = r), t === n && (t = null), r = $i(), r === n ? (V = e, e = n) : (i = Q(), a = V, o = ua(), o === n ? (V = a, a = n) : (s = Q(), o = [o, s], a = o), a === n && (a = null), o = V, s = $i(), s === n ? (V = o, o = n) : (c = Q(), l = ua(), l === n && (l = null), s = [
			s,
			c,
			l
		], o = s), o === n && (o = null), H = e, e = Pn(t, a, o)), e;
	}
	function di() {
		let e, t;
		return e = Jr(), e === n && (e = ui(), e === n && (e = V, t = Di(), t !== n && (H = e, t = Fn()), e = t, e === n && (e = V, t = ua(), t !== n && (H = e, t = In(t)), e = t, e === n && (e = V, t = fa(), t !== n && (H = e, t = Ln(t)), e = t, e === n && (e = V, t = bi(), t !== n && (H = e, t = Rn(t)), e = t))))), e;
	}
	function fi() {
		let e, t, r;
		return e = V, t = ra(), t === n ? (V = e, e = n) : (r = ia(), H = e, e = zn(t, r)), e;
	}
	function pi() {
		let e, t;
		return e = V, t = mi(), t !== n && (H = e, t = Bn(t)), e = t, e === n && (e = V, t = ca(), t !== n && (H = e, t = Vn(t)), e = t, e === n && (e = hi(), e === n && (e = vi(), e === n && (e = V, t = Ki(), t !== n && (H = e, t = Hn()), e = t, e === n && (e = V, t = qi(), t !== n && (H = e, t = Un()), e = t, e === n && (e = V, t = Ji(), t !== n && (H = e, t = Wn()), e = t)))))), e;
	}
	function mi() {
		let e, t;
		return G++, e = V, t = fa(), t !== n && (H = e, t = Gn(t)), e = t, G--, e === n && (t = n, G === 0 && J(De)), e;
	}
	function hi() {
		let e, t, r, i;
		return e = V, t = Yi(), t === n ? (V = e, e = n) : (Q(), r = gi(), r === n && (r = null), Q(), i = Xi(), i === n ? (V = e, e = n) : (H = e, e = Kn(r))), e;
	}
	function gi() {
		let e, t, r, i, a, o, s, c;
		if (e = V, t = _i(), t !== n) {
			for (r = [], i = V, a = Q(), o = Y(), o === n ? (V = i, i = n) : (s = Q(), c = _i(), c === n ? (V = i, i = n) : (a = [
				a,
				o,
				s,
				c
			], i = a)); i !== n;) r.push(i), i = V, a = Q(), o = Y(), o === n ? (V = i, i = n) : (s = Q(), c = _i(), c === n ? (V = i, i = n) : (a = [
				a,
				o,
				s,
				c
			], i = a));
			H = e, e = qn(t, r);
		} else V = e, e = n;
		return e;
	}
	function _i() {
		let e, t, r, i;
		return e = V, t = fa(), t === n ? (V = e, e = n) : (Q(), r = $i(), r === n ? (V = e, e = n) : (Q(), i = pi(), i === n ? (V = e, e = n) : (H = e, e = Jn(t, i)))), e;
	}
	function vi() {
		let e, t, r, i;
		return e = V, t = Zi(), t === n ? (V = e, e = n) : (Q(), r = yi(), r === n && (r = null), Q(), i = Qi(), i === n ? (V = e, e = n) : (H = e, e = Yn(r))), e;
	}
	function yi() {
		let e, t, r, i, a, o, s, c;
		if (e = V, t = pi(), t !== n) {
			for (r = [], i = V, a = Q(), o = Y(), o === n ? (V = i, i = n) : (s = Q(), c = pi(), c === n ? (V = i, i = n) : (a = [
				a,
				o,
				s,
				c
			], i = a)); i !== n;) r.push(i), i = V, a = Q(), o = Y(), o === n ? (V = i, i = n) : (s = Q(), c = pi(), c === n ? (V = i, i = n) : (a = [
				a,
				o,
				s,
				c
			], i = a));
			H = e, e = Xn(t, r);
		} else V = e, e = n;
		return e;
	}
	function bi() {
		let t, r, i, a, o, s;
		if (t = V, r = V, i = V, a = e.charAt(V), te.test(a) ? V++ : (a = n, G === 0 && J(Oe)), a !== n) {
			for (o = [], s = xi(); s !== n;) o.push(s), s = xi();
			a = [a, o], i = a;
		} else V = i, i = n;
		if (r = i === n ? i : e.substring(r, V), r !== n && (H = t, r = Zn(r)), t = r, t === n) {
			if (t = V, r = V, i = [], a = e.charAt(V), S.test(a) ? V++ : (a = n, G === 0 && J(ke)), a !== n) for (; a !== n;) i.push(a), a = e.charAt(V), S.test(a) ? V++ : (a = n, G === 0 && J(ke));
			else i = n;
			r = i === n ? i : e.substring(r, V), r !== n && (H = t, r = Qn(r)), t = r, t === n && (t = V, r = Ki(), r !== n && (H = t, r = $n()), t = r, t === n && (t = V, r = qi(), r !== n && (H = t, r = er()), t = r, t === n && (t = V, r = Ji(), r !== n && (H = t, r = tr()), t = r)));
		}
		return t;
	}
	function xi() {
		let t, r, i, a;
		return t = e.charAt(V), C.test(t) ? V++ : (t = n, G === 0 && J(O)), t === n && (t = V, e.charCodeAt(V) === 45 ? (r = "-", V++) : (r = n, G === 0 && J(k)), r === n ? (V = t, t = n) : (i = V, G++, a = e.charAt(V), w.test(a) ? V++ : (a = n, G === 0 && J(Ae)), G--, a === n ? i = void 0 : (V = i, i = n), i === n ? (V = t, t = n) : (r = [r, i], t = r))), t;
	}
	function Si() {
		let e, t;
		return e = V, t = aa(), t !== n && (H = e, t = nr(t)), e = t, e === n && (e = V, t = Ki(), t !== n && (H = e, t = rr()), e = t, e === n && (e = V, t = qi(), t !== n && (H = e, t = ir()), e = t, e === n && (e = V, t = Ji(), t !== n && (H = e, t = ar()), e = t))), e;
	}
	function Ci() {
		let t;
		return e.charCodeAt(V) === 36 ? (t = "$", V++) : (t = n, G === 0 && J(je)), t;
	}
	function wi() {
		let t;
		return e.charCodeAt(V) === 64 ? (t = "@", V++) : (t = n, G === 0 && J(Me)), t;
	}
	function Ti() {
		let t;
		return e.substr(V, 2) === ".." ? (t = "..", V += 2) : (t = n, G === 0 && J(Ne)), t;
	}
	function Ei() {
		let t;
		return e.charCodeAt(V) === 46 ? (t = ".", V++) : (t = n, G === 0 && J(Pe)), t;
	}
	function Di() {
		let t;
		return e.charCodeAt(V) === 42 ? (t = "*", V++) : (t = n, G === 0 && J(Fe)), t;
	}
	function Oi() {
		let t;
		return e.substr(V, 2) === "&&" ? (t = "&&", V += 2) : (t = n, G === 0 && J(Ie)), t;
	}
	function ki() {
		let t;
		return e.substr(V, 2) === "||" ? (t = "||", V += 2) : (t = n, G === 0 && J(Le)), t;
	}
	function Ai() {
		let t;
		return e.charCodeAt(V) === 33 ? (t = "!", V++) : (t = n, G === 0 && J(Re)), t;
	}
	function ji() {
		let t;
		return e.substr(V, 2) === "==" ? (t = "==", V += 2) : (t = n, G === 0 && J(ze)), t;
	}
	function Mi() {
		let t;
		return e.substr(V, 2) === "!=" ? (t = "!=", V += 2) : (t = n, G === 0 && J(Be)), t;
	}
	function Ni() {
		let t;
		return e.substr(V, 2) === ">=" ? (t = ">=", V += 2) : (t = n, G === 0 && J(Ve)), t;
	}
	function Pi() {
		let t;
		return e.charCodeAt(V) === 62 ? (t = ">", V++) : (t = n, G === 0 && J(He)), t;
	}
	function Fi() {
		let t;
		return e.substr(V, 2) === "<=" ? (t = "<=", V += 2) : (t = n, G === 0 && J(Ue)), t;
	}
	function Ii() {
		let t;
		return e.charCodeAt(V) === 60 ? (t = "<", V++) : (t = n, G === 0 && J(We)), t;
	}
	function Li() {
		let t;
		return e.substr(V, 2) === "=~" ? (t = "=~", V += 2) : (t = n, G === 0 && J(Ge)), t;
	}
	function Ri() {
		let t, r, i, a;
		return t = V, e.substr(V, 2) === "in" ? (r = "in", V += 2) : (r = n, G === 0 && J(Ke)), r === n ? (V = t, t = n) : (i = V, G++, a = Z(), G--, a === n ? i = void 0 : (V = i, i = n), i === n ? (V = t, t = n) : (r = [r, i], t = r)), t;
	}
	function zi() {
		let t, r, i, a;
		return t = V, e.substr(V, 3) === "nin" ? (r = "nin", V += 3) : (r = n, G === 0 && J(qe)), r === n ? (V = t, t = n) : (i = V, G++, a = Z(), G--, a === n ? i = void 0 : (V = i, i = n), i === n ? (V = t, t = n) : (r = [r, i], t = r)), t;
	}
	function Bi() {
		let t, r, i, a;
		return t = V, e.substr(V, 8) === d ? (r = d, V += 8) : (r = n, G === 0 && J(Je)), r === n ? (V = t, t = n) : (i = V, G++, a = Z(), G--, a === n ? i = void 0 : (V = i, i = n), i === n ? (V = t, t = n) : (r = [r, i], t = r)), t;
	}
	function Vi() {
		let t, r, i, a;
		return t = V, e.substr(V, 5) === f ? (r = f, V += 5) : (r = n, G === 0 && J(Ye)), r === n ? (V = t, t = n) : (i = V, G++, a = Z(), G--, a === n ? i = void 0 : (V = i, i = n), i === n ? (V = t, t = n) : (r = [r, i], t = r)), t;
	}
	function Hi() {
		let t, r, i, a;
		return t = V, e.substr(V, 6) === p ? (r = p, V += 6) : (r = n, G === 0 && J(Xe)), r === n ? (V = t, t = n) : (i = V, G++, a = Z(), G--, a === n ? i = void 0 : (V = i, i = n), i === n ? (V = t, t = n) : (r = [r, i], t = r)), t;
	}
	function Ui() {
		let t, r, i, a;
		return t = V, e.substr(V, 6) === m ? (r = m, V += 6) : (r = n, G === 0 && J(Ze)), r === n ? (V = t, t = n) : (i = V, G++, a = Z(), G--, a === n ? i = void 0 : (V = i, i = n), i === n ? (V = t, t = n) : (r = [r, i], t = r)), t;
	}
	function Wi() {
		let t, r, i, a;
		return t = V, e.substr(V, 4) === h ? (r = h, V += 4) : (r = n, G === 0 && J(Qe)), r === n ? (V = t, t = n) : (i = V, G++, a = Z(), G--, a === n ? i = void 0 : (V = i, i = n), i === n ? (V = t, t = n) : (r = [r, i], t = r)), t;
	}
	function Gi() {
		let t, r, i, a;
		return t = V, e.substr(V, 5) === g ? (r = g, V += 5) : (r = n, G === 0 && J($e)), r === n ? (V = t, t = n) : (i = V, G++, a = Z(), G--, a === n ? i = void 0 : (V = i, i = n), i === n ? (V = t, t = n) : (r = [r, i], t = r)), t;
	}
	function Ki() {
		let t, r, i, a;
		return t = V, e.substr(V, 4) === ee ? (r = ee, V += 4) : (r = n, G === 0 && J(et)), r === n ? (V = t, t = n) : (i = V, G++, a = Z(), G--, a === n ? i = void 0 : (V = i, i = n), i === n ? (V = t, t = n) : (r = [r, i], t = r)), t;
	}
	function qi() {
		let t, r, i, a;
		return t = V, e.substr(V, 5) === _ ? (r = _, V += 5) : (r = n, G === 0 && J(tt)), r === n ? (V = t, t = n) : (i = V, G++, a = Z(), G--, a === n ? i = void 0 : (V = i, i = n), i === n ? (V = t, t = n) : (r = [r, i], t = r)), t;
	}
	function Ji() {
		let t, r, i, a;
		return t = V, e.substr(V, 4) === v ? (r = v, V += 4) : (r = n, G === 0 && J(nt)), r === n ? (V = t, t = n) : (i = V, G++, a = Z(), G--, a === n ? i = void 0 : (V = i, i = n), i === n ? (V = t, t = n) : (r = [r, i], t = r)), t;
	}
	function Yi() {
		let t;
		return e.charCodeAt(V) === 123 ? (t = "{", V++) : (t = n, G === 0 && J(rt)), t;
	}
	function Xi() {
		let t;
		return e.charCodeAt(V) === 125 ? (t = "}", V++) : (t = n, G === 0 && J(it)), t;
	}
	function Zi() {
		let t;
		return e.charCodeAt(V) === 91 ? (t = "[", V++) : (t = n, G === 0 && J(at)), t;
	}
	function Qi() {
		let t;
		return e.charCodeAt(V) === 93 ? (t = "]", V++) : (t = n, G === 0 && J(ot)), t;
	}
	function $i() {
		let t;
		return e.charCodeAt(V) === 58 ? (t = ":", V++) : (t = n, G === 0 && J(st)), t;
	}
	function Y() {
		let t;
		return e.charCodeAt(V) === 44 ? (t = ",", V++) : (t = n, G === 0 && J(ct)), t;
	}
	function ea() {
		let t;
		return e.charCodeAt(V) === 40 ? (t = "(", V++) : (t = n, G === 0 && J(lt)), t;
	}
	function ta() {
		let t;
		return e.charCodeAt(V) === 41 ? (t = ")", V++) : (t = n, G === 0 && J(ut)), t;
	}
	function na() {
		let t;
		return e.charCodeAt(V) === 63 ? (t = "?", V++) : (t = n, G === 0 && J(dt)), t;
	}
	function ra() {
		let t, r, i, a, o, s;
		if (G++, t = V, e.charCodeAt(V) === 47 ? (r = "/", V++) : (r = n, G === 0 && J(pt)), r !== n) {
			for (i = [], a = e.charAt(V), ne.test(a) ? V++ : (a = n, G === 0 && J(mt)), a === n && (a = V, e.charCodeAt(V) === 92 ? (o = "\\", V++) : (o = n, G === 0 && J(A)), o === n ? (V = a, a = n) : (e.length > V ? (s = e.charAt(V), V++) : (s = n, G === 0 && J(ht)), s === n ? (V = a, a = n) : (o = [o, s], a = o))); a !== n;) i.push(a), a = e.charAt(V), ne.test(a) ? V++ : (a = n, G === 0 && J(mt)), a === n && (a = V, e.charCodeAt(V) === 92 ? (o = "\\", V++) : (o = n, G === 0 && J(A)), o === n ? (V = a, a = n) : (e.length > V ? (s = e.charAt(V), V++) : (s = n, G === 0 && J(ht)), s === n ? (V = a, a = n) : (o = [o, s], a = o)));
			e.charCodeAt(V) === 47 ? (a = "/", V++) : (a = n, G === 0 && J(pt)), a === n ? (V = t, t = n) : (H = t, t = or(i));
		} else V = t, t = n;
		return G--, t === n && (r = n, G === 0 && J(ft)), t;
	}
	function ia() {
		let t, r, i;
		for (t = V, r = [], i = e.charAt(V), T.test(i) ? V++ : (i = n, G === 0 && J(gt)); i !== n;) r.push(i), i = e.charAt(V), T.test(i) ? V++ : (i = n, G === 0 && J(gt));
		return H = t, r = sr(r), t = r, t;
	}
	function aa() {
		let t, r, i, a, o;
		if (t = V, r = V, i = oa(), i !== n) {
			for (a = [], o = sa(); o !== n;) a.push(o), o = sa();
			i = [i, a], r = i;
		} else V = r, r = n;
		return t = r === n ? r : e.substring(t, V), t;
	}
	function oa() {
		let t, r, i;
		return t = e.charAt(V), se.test(t) ? V++ : (t = n, G === 0 && J(_t)), t === n && (t = V, r = e.charAt(V), ce.test(r) ? V++ : (r = n, G === 0 && J(vt)), r === n ? (V = t, t = n) : (i = e.charAt(V), le.test(i) ? V++ : (i = n, G === 0 && J(yt)), i === n ? (V = t, t = n) : (r = [r, i], t = r))), t;
	}
	function sa() {
		let t;
		return t = oa(), t === n && (t = e.charAt(V), E.test(t) ? V++ : (t = n, G === 0 && J(j))), t;
	}
	function ca() {
		let t, r, i, a, o, s, c;
		if (G++, t = V, e.charCodeAt(V) === 45 ? (r = "-", V++) : (r = n, G === 0 && J(k)), r === n && (r = null), i = la(), i !== n) {
			if (a = V, e.charCodeAt(V) === 46 ? (o = ".", V++) : (o = n, G === 0 && J(Pe)), o !== n) {
				if (s = [], c = e.charAt(V), E.test(c) ? V++ : (c = n, G === 0 && J(j)), c !== n) for (; c !== n;) s.push(c), c = e.charAt(V), E.test(c) ? V++ : (c = n, G === 0 && J(j));
				else s = n;
				s === n ? (V = a, a = n) : (o = [o, s], a = o);
			} else V = a, a = n;
			a === n && (a = null), o = da(), o === n && (o = null), H = t, t = cr(a, o);
		} else V = t, t = n;
		return G--, t === n && (r = n, G === 0 && J(bt)), t;
	}
	function la() {
		let t, r, i, a;
		if (e.charCodeAt(V) === 48 ? (t = "0", V++) : (t = n, G === 0 && J(xt)), t === n) {
			if (t = V, r = e.charAt(V), ue.test(r) ? V++ : (r = n, G === 0 && J(St)), r !== n) {
				for (i = [], a = e.charAt(V), E.test(a) ? V++ : (a = n, G === 0 && J(j)); a !== n;) i.push(a), a = e.charAt(V), E.test(a) ? V++ : (a = n, G === 0 && J(j));
				r = [r, i], t = r;
			} else V = t, t = n;
		}
		return t;
	}
	function ua() {
		let t, r, i, a, o, s;
		if (G++, t = V, e.charCodeAt(V) === 48 ? (r = "0", V++) : (r = n, G === 0 && J(xt)), r === n) {
			if (r = V, e.charCodeAt(V) === 45 ? (i = "-", V++) : (i = n, G === 0 && J(k)), i === n && (i = null), a = e.charAt(V), ue.test(a) ? V++ : (a = n, G === 0 && J(St)), a !== n) {
				for (o = [], s = e.charAt(V), E.test(s) ? V++ : (s = n, G === 0 && J(j)); s !== n;) o.push(s), s = e.charAt(V), E.test(s) ? V++ : (s = n, G === 0 && J(j));
				i = [
					i,
					a,
					o
				], r = i;
			} else V = r, r = n;
		}
		return r !== n && (H = t, r = lr()), t = r, G--, t === n && (r = n, G === 0 && J(Ct)), t;
	}
	function da() {
		let t, r, i, a, o;
		if (t = V, r = e.charAt(V), de.test(r) ? V++ : (r = n, G === 0 && J(wt)), r !== n) {
			if (i = e.charAt(V), b.test(i) ? V++ : (i = n, G === 0 && J(D)), i === n && (i = null), a = [], o = e.charAt(V), E.test(o) ? V++ : (o = n, G === 0 && J(j)), o !== n) for (; o !== n;) a.push(o), o = e.charAt(V), E.test(o) ? V++ : (o = n, G === 0 && J(j));
			else a = n;
			a === n ? (V = t, t = n) : (r = [
				r,
				i,
				a
			], t = r);
		} else V = t, t = n;
		return t;
	}
	function fa() {
		let t, r, i, a;
		if (G++, t = V, e.charCodeAt(V) === 34 ? (r = "\"", V++) : (r = n, G === 0 && J(M)), r !== n) {
			for (i = [], a = pa(); a !== n;) i.push(a), a = pa();
			e.charCodeAt(V) === 34 ? (a = "\"", V++) : (a = n, G === 0 && J(M)), a === n ? (V = t, t = n) : (H = t, t = ur(i));
		} else V = t, t = n;
		if (t === n) {
			if (t = V, e.charCodeAt(V) === 39 ? (r = "'", V++) : (r = n, G === 0 && J(N)), r !== n) {
				for (i = [], a = ma(); a !== n;) i.push(a), a = ma();
				e.charCodeAt(V) === 39 ? (a = "'", V++) : (a = n, G === 0 && J(N)), a === n ? (V = t, t = n) : (H = t, t = dr(i));
			} else V = t, t = n;
		}
		return G--, t === n && (r = n, G === 0 && J(De)), t;
	}
	function pa() {
		let t, r, i;
		return t = V, r = V, G++, i = e.charAt(V), fe.test(i) ? V++ : (i = n, G === 0 && J(P)), G--, i === n ? r = void 0 : (V = r, r = n), r === n ? (V = t, t = n) : (i = ha(), i === n ? (V = t, t = n) : (H = t, t = fr(i))), t === n && (t = V, e.charCodeAt(V) === 92 ? (r = "\\", V++) : (r = n, G === 0 && J(A)), r === n ? (V = t, t = n) : (e.charCodeAt(V) === 34 ? (i = "\"", V++) : (i = n, G === 0 && J(M)), i === n ? (V = t, t = n) : (H = t, t = pr())), t === n && (t = V, e.charCodeAt(V) === 92 ? (r = "\\", V++) : (r = n, G === 0 && J(A)), r === n ? (V = t, t = n) : (i = ga(), i === n ? (V = t, t = n) : (H = t, t = mr(i))))), t;
	}
	function ma() {
		let t, r, i;
		return t = V, r = V, G++, i = e.charAt(V), pe.test(i) ? V++ : (i = n, G === 0 && J(Tt)), G--, i === n ? r = void 0 : (V = r, r = n), r === n ? (V = t, t = n) : (i = ha(), i === n ? (V = t, t = n) : (H = t, t = z(i))), t === n && (t = V, e.charCodeAt(V) === 92 ? (r = "\\", V++) : (r = n, G === 0 && J(A)), r === n ? (V = t, t = n) : (e.charCodeAt(V) === 39 ? (i = "'", V++) : (i = n, G === 0 && J(N)), i === n ? (V = t, t = n) : (H = t, t = hr())), t === n && (t = V, e.charCodeAt(V) === 92 ? (r = "\\", V++) : (r = n, G === 0 && J(A)), r === n ? (V = t, t = n) : (i = ga(), i === n ? (V = t, t = n) : (H = t, t = B(i))))), t;
	}
	function ha() {
		let t, r, i, a;
		return t = e.charAt(V), me.test(t) ? V++ : (t = n, G === 0 && J(F)), t === n && (t = V, r = V, i = e.charAt(V), ce.test(i) ? V++ : (i = n, G === 0 && J(vt)), i === n ? (V = r, r = n) : (a = e.charAt(V), le.test(a) ? V++ : (a = n, G === 0 && J(yt)), a === n ? (V = r, r = n) : (i = [i, a], r = i)), t = r === n ? r : e.substring(t, V)), t;
	}
	function ga() {
		let t, r, i, a, o, s, c, l, u, d;
		return t = V, e.charCodeAt(V) === 92 ? (r = "\\", V++) : (r = n, G === 0 && J(A)), r !== n && (H = t, r = gr()), t = r, t === n && (t = V, e.charCodeAt(V) === 47 ? (r = "/", V++) : (r = n, G === 0 && J(pt)), r !== n && (H = t, r = _r()), t = r, t === n && (t = V, e.charCodeAt(V) === 98 ? (r = "b", V++) : (r = n, G === 0 && J(Et)), r !== n && (H = t, r = vr()), t = r, t === n && (t = V, e.charCodeAt(V) === 102 ? (r = "f", V++) : (r = n, G === 0 && J(Dt)), r !== n && (H = t, r = yr()), t = r, t === n && (t = V, e.charCodeAt(V) === 110 ? (r = "n", V++) : (r = n, G === 0 && J(Ot)), r !== n && (H = t, r = br()), t = r, t === n && (t = V, e.charCodeAt(V) === 114 ? (r = "r", V++) : (r = n, G === 0 && J(kt)), r !== n && (H = t, r = xr()), t = r, t === n && (t = V, e.charCodeAt(V) === 116 ? (r = "t", V++) : (r = n, G === 0 && J(At)), r !== n && (H = t, r = Sr()), t = r, t === n && (t = V, e.charCodeAt(V) === 117 ? (r = "u", V++) : (r = n, G === 0 && J(jt)), r === n ? (V = t, t = n) : (i = V, a = V, o = e.charAt(V), he.test(o) ? V++ : (o = n, G === 0 && J(Mt)), o === n ? (V = a, a = n) : (s = e.charAt(V), ge.test(s) ? V++ : (s = n, G === 0 && J(Nt)), s === n ? (V = a, a = n) : (c = X(), c === n ? (V = a, a = n) : (l = X(), l === n ? (V = a, a = n) : (o = [
			o,
			s,
			c,
			l
		], a = o)))), i = a === n ? a : e.substring(i, V), i === n ? (V = t, t = n) : (e.substr(V, 2) === "\\u" ? (a = "\\u", V += 2) : (a = n, G === 0 && J(Pt)), a === n ? (V = t, t = n) : (o = V, s = V, c = e.charAt(V), he.test(c) ? V++ : (c = n, G === 0 && J(Mt)), c === n ? (V = s, s = n) : (l = e.charAt(V), _e.test(l) ? V++ : (l = n, G === 0 && J(Ft)), l === n ? (V = s, s = n) : (u = X(), u === n ? (V = s, s = n) : (d = X(), d === n ? (V = s, s = n) : (c = [
			c,
			l,
			u,
			d
		], s = c)))), o = s === n ? s : e.substring(o, V), o === n ? (V = t, t = n) : (H = t, t = Cr(i, o))))), t === n && (t = V, e.charCodeAt(V) === 117 ? (r = "u", V++) : (r = n, G === 0 && J(jt)), r === n ? (V = t, t = n) : (i = V, a = V, o = X(), o === n ? (V = a, a = n) : (s = X(), s === n ? (V = a, a = n) : (c = X(), c === n ? (V = a, a = n) : (l = X(), l === n ? (V = a, a = n) : (o = [
			o,
			s,
			c,
			l
		], a = o)))), i = a === n ? a : e.substring(i, V), i === n ? (V = t, t = n) : (H = V, a = wr(i), a = a ? n : void 0, a === n ? (V = t, t = n) : (H = t, t = Tr(i)))))))))))), t;
	}
	function X() {
		let t;
		return t = e.charAt(V), ve.test(t) ? V++ : (t = n, G === 0 && J(It)), t;
	}
	function Z() {
		let t;
		return t = e.charAt(V), C.test(t) ? V++ : (t = n, G === 0 && J(O)), t;
	}
	function Q() {
		let t, r;
		for (G++, t = [], r = e.charAt(V), ye.test(r) ? V++ : (r = n, G === 0 && J(Lt)); r !== n;) t.push(r), r = e.charAt(V), ye.test(r) ? V++ : (r = n, G === 0 && J(Lt));
		return G--, t;
	}
	function _a() {
		let t, r;
		return t = V, G++, e.length > V ? (r = e.charAt(V), V++) : (r = n, G === 0 && J(ht)), G--, r === n ? t = void 0 : (V = t, t = n), t;
	}
	function $(e) {
		return e.length > 1e3 && Ar("Member name too long (maximum 1000 characters)"), e;
	}
	Or = a();
	let va = Or !== n && V === e.length;
	function ya() {
		throw Or !== n && V < e.length && J(Nr()), Rr(Er, W < e.length ? jr(W) : null, W < e.length ? Ir(W, W + 1) : Ir(W, W));
	}
	if (t.peg$library) return {
		peg$result: Or,
		peg$currPos: V,
		peg$FAILED: n,
		peg$maxFailExpected: Er,
		peg$maxFailPos: W,
		peg$success: va,
		peg$throw: va ? void 0 : ya
	};
	if (va) return Or;
	ya();
}
var ce = /* @__PURE__ */ new Set([
	"eq",
	"ne",
	"lt",
	"le",
	"gt",
	"ge"
]), le = {
	length: {
		args: ["value"],
		logical: !1
	},
	count: {
		args: ["nodes"],
		logical: !1
	},
	value: {
		args: ["nodes"],
		logical: !1
	},
	match: {
		args: ["value", "value"],
		logical: !0
	},
	search: {
		args: ["value", "value"],
		logical: !0
	}
}, E = (e) => {
	throw new u(1, 1, e);
}, ue = (e) => e.type === "root" || e.type === "current", de = (e) => {
	for (let t = e.next; t; t = t.next) {
		let e = t.value;
		if (e.type !== "bracketMember" && (e.type !== "dot" || e.value.type === "wildcard")) return !1;
	}
	return !0;
};
function fe(e) {
	let t = [{
		node: e,
		context: "nodes"
	}], n = (e) => {
		for (let n = e.next; n; n = n.next) {
			let e = n.value;
			if (e.type === "dotdot" && (e = e.value), e.type !== "bracketExpression") continue;
			let r = e.value, i = r.type === "unions" ? r.values : [r];
			for (let e of i) e.type === "filterExpression" && t.push({
				node: e.value,
				context: "test"
			});
		}
	};
	for (; t.length > 0;) {
		let { node: e, context: r } = t.pop();
		if (typeof e != "object" || !e) continue;
		let i = e;
		if (ue(i)) r === "value" && !de(i) && E("A non-singular query cannot be compared or used as a value: use a name or an index in each segment"), n(i);
		else switch (r === "nodes" && E(`Expected a query, found ${String(i.type)}`), i.type) {
			case "logicalExpression":
			case "notExpression":
			case "groupExpression":
				i.type === "logicalExpression" ? t.push({
					node: i.left,
					context: "test"
				}, {
					node: i.right,
					context: "test"
				}) : t.push({
					node: i.value,
					context: "test"
				});
				break;
			case "comparator": {
				let e = ce.has(i.operator) ? "value" : "any";
				t.push({
					node: i.left,
					context: e
				}), i.operator !== "reg" && t.push({
					node: i.right,
					context: e
				});
				break;
			}
			case "functionCall": {
				let e = i.name, n = le[e], a = i.args;
				a.length !== n.args.length && E(`${e}() takes ${n.args.length} argument${n.args.length > 1 ? "s" : ""}, found ${a.length}`), r === "test" && !n.logical && E(`The result of ${e}() must be compared`), r === "value" && n.logical && E(`The result of ${e}() cannot be compared`), a.forEach((e, r) => t.push({
					node: e,
					context: n.args[r]
				}));
				break;
			}
			case "operation":
				t.push({
					node: i.left,
					context: "value"
				}, {
					node: i.right,
					context: "value"
				});
				break;
			case "groupOperation":
				t.push({
					node: i.value,
					context: r === "any" ? "any" : "value"
				});
				break;
			case "value": r === "test" && E("A literal must be compared");
		}
	}
}
function pe(e) {
	let t;
	try {
		t = se(e);
	} catch (e) {
		if (b(e)) throw new u(1, 1, "Expression is nested too deeply");
		if (e instanceof RangeError) throw new u(1, 1, "Expression is too large to parse");
		if (e && typeof e == "object" && "location" in e && "message" in e) {
			let t = e;
			throw new u(t.location.start.line, t.location.start.column, t.message);
		}
		throw e;
	}
	return fe(t), t;
}
var me = /* @__PURE__ */ new Set([
	"(",
	")",
	"*",
	"+",
	"-",
	".",
	"?",
	"[",
	"\\",
	"]",
	"^",
	"n",
	"r",
	"t",
	"{",
	"|",
	"}"
]), he = /* @__PURE__ */ new Set(/* @__PURE__ */ "L.Ll.Lm.Lo.Lt.Lu.M.Mc.Me.Mn.N.Nd.Nl.No.P.Pc.Pd.Pe.Pf.Pi.Po.Ps.Z.Zl.Zp.Zs.S.Sc.Sk.Sm.So.C.Cc.Cf.Cn.Co".split(".")), ge = (e) => e >= 55296 && e <= 56319, _e = (e) => e >= 56320 && e <= 57343, ve = (e) => e !== void 0 && e >= "0" && e <= "9", ye = (e, t) => {
	let n = e.charCodeAt(t);
	return ge(n) && _e(e.charCodeAt(t + 1)) ? {
		text: e.slice(t, t + 2),
		length: 2,
		code: (n - 55296) * 1024 + (e.charCodeAt(t + 1) - 56320) + 65536
	} : ge(n) || _e(n) ? null : {
		text: e[t],
		length: 1,
		code: n
	};
}, be = (e, t) => {
	let n = e[t + 1];
	return n === void 0 || !me.has(n) ? null : n === "n" ? {
		text: "\\n",
		length: 2,
		code: 10
	} : n === "r" ? {
		text: "\\r",
		length: 2,
		code: 13
	} : n === "t" ? {
		text: "\\t",
		length: 2,
		code: 9
	} : {
		text: "\\" + n,
		length: 2,
		code: n.charCodeAt(0)
	};
}, xe = (e, t) => {
	if (e[t + 2] !== "{") return null;
	let n = e.indexOf("}", t + 3);
	if (n === -1 || n - (t + 3) > 2) return null;
	let r = e.slice(t + 3, n);
	return he.has(r) ? {
		text: `\\${e[t + 1]}{${r}}`,
		length: n + 1 - t
	} : null;
}, Se = (e, t) => {
	let n = e[t];
	return n === "\\" ? be(e, t) : n === void 0 || n === "-" || n === "[" || n === "]" ? null : ye(e, t);
}, Ce = (e, t) => {
	let n = t + 1, r = "[";
	e[n] === "^" && (r += "^", n++);
	let i = !0;
	for (;;) {
		let a = e[n];
		if (a === void 0) return null;
		if (a === "]") return i ? null : {
			text: r + "]",
			length: n + 1 - t
		};
		if (a === "-") {
			if (!i && e[n + 1] !== "]") return null;
			r += "-", n++, i = !1;
			continue;
		}
		if (i = !1, a === "\\" && (e[n + 1] === "p" || e[n + 1] === "P")) {
			let t = xe(e, n);
			if (t === null) return null;
			r += t.text, n += t.length;
			continue;
		}
		let o = Se(e, n);
		if (o === null) return null;
		if (n += o.length, e[n] === "-" && e[n + 1] !== "]") {
			let t = Se(e, n + 1);
			if (t === null || t.code < o.code) return null;
			r += o.text + "-" + t.text, n += 1 + t.length;
		} else r += o.text;
	}
}, we = (e, t) => {
	let n = t + 1, r = n;
	for (; ve(e[n]);) n++;
	if (n === r) return null;
	if (e[n] === ",") for (n++; ve(e[n]);) n++;
	return e[n] === "}" ? {
		text: e.slice(t, n + 1),
		length: n + 1 - t
	} : null;
}, Te = (e) => {
	let t = e, n = "", r = 0, i = !1, a = 0;
	for (; a < t.length;) {
		let e = t[a];
		switch (e) {
			case "|":
				n += "|", i = !1, a++;
				continue;
			case "(":
				r++, n += "(", i = !1, a++;
				continue;
			case ")":
				if (r === 0) return null;
				r--, n += ")", i = !0, a++;
				continue;
			case "*":
			case "+":
			case "?":
				if (!i) return null;
				n += e, i = !1, a++;
				continue;
			case "{": {
				let e = i ? we(t, a) : null;
				if (e === null) return null;
				n += e.text, i = !1, a += e.length;
				continue;
			}
			case ".":
				n += ".", a++;
				break;
			case "[": {
				let e = Ce(t, a);
				if (e === null) return null;
				n += e.text, a += e.length;
				break;
			}
			case "\\":
				if (t[a + 1] === "p" || t[a + 1] === "P") {
					let e = xe(t, a);
					if (e === null) return null;
					n += e.text, a += e.length;
				} else {
					let e = be(t, a);
					if (e === null) return null;
					n += e.text === "\\-" ? "-" : e.text, a += e.length;
				}
				break;
			case "]":
			case "}": return null;
			default: {
				let e = ye(t, a);
				if (e === null) return null;
				n += e.text, a += e.length;
			}
		}
		i = !0;
	}
	return r === 0 ? n : null;
}, D = 1e3, Ee = 1e3, De = 16, Oe = /^[dgimsuy]*$/, ke = (e) => {
	let t = 0;
	for (let n = 0; n + 2 < e.length; n++) e[n] === "\\" && (e[n + 1] === "p" || e[n + 1] === "P") && e[n + 2] === "{" && t++;
	return t;
}, O = class extends Error {}, k = 0, Ae = 1, je = 2, Me = 3, Ne = 4, Pe = 5, Fe = s(2, 31) - 1, Ie = (e, t) => {
	let n = e.op.length, r = e.scratch ?? {
		clist: new Int32Array(n),
		nlist: new Int32Array(n),
		onList: new Int32Array(n),
		stack: new Int32Array(n),
		atomGen: new Int32Array(e.atoms.length),
		atomHit: new Uint8Array(e.atoms.length),
		gen: 0,
		step: 0
	};
	return e.scratch = void 0, (r.gen > Fe - t - 2 || r.step > Fe - t - 2) && (r.onList.fill(0), r.atomGen.fill(0), r.gen = 0, r.step = 0), r;
}, Le = /* @__PURE__ */ new Set([
	"^",
	"$",
	"\\",
	".",
	"*",
	"+",
	"?",
	"(",
	")",
	"[",
	"]",
	"{",
	"}",
	"|",
	"/"
]), Re = /^\{(\d+)(?:,(\d*))?\}/, ze = /^[0-9a-fA-F]{4}/, Be = /^\(\?([ims]*)(?:-([ims]*))?:/, Ve = (e) => e === 10 || e === 13 || e === 8232 || e === 8233, He = class {
	constructor(e, t, n, r = !1) {
		this.src = e, this.unicode = t, this.iregexp = r, this.i = 0, this.mods = {
			i: n.includes("i"),
			m: n.includes("m"),
			s: n.includes("s")
		};
	}
	atom(e, t) {
		return {
			t: "atom",
			src: e,
			literal: t,
			mods: this.mods
		};
	}
	parse() {
		let e = this.parseAlt();
		if (this.i < this.src.length) throw new O("unexpected character");
		return e;
	}
	parseAlt() {
		let e = [this.parseSeq()];
		for (; this.src[this.i] === "|";) this.i++, e.push(this.parseSeq());
		return e.length === 1 ? e[0] : {
			t: "alt",
			alts: e
		};
	}
	parseSeq() {
		let e = [];
		for (; this.i < this.src.length && this.src[this.i] !== "|" && this.src[this.i] !== ")";) e.push(this.parseTerm());
		return e.length === 1 ? e[0] : {
			t: "cat",
			items: e
		};
	}
	parseTerm() {
		let e = this.src[this.i];
		return e === "^" ? (this.i++, {
			t: "bol",
			multiline: this.mods.m
		}) : e === "$" ? (this.i++, {
			t: "eol",
			multiline: this.mods.m
		}) : this.parseQuantifier(this.parseAtom());
	}
	parseAtom() {
		let { src: e } = this, t = this.i, n = e[t];
		if (n === "(") {
			let n = this.mods;
			if (e[t + 1] === "?") {
				let r = Be.exec(e.slice(t, t + 12));
				if (!r) throw new O("lookaround or named group");
				let i = l({}, n);
				for (let e of r[1]) i[e] = !0;
				for (let e of r[2] ?? "") i[e] = !1;
				this.mods = i, this.i = t + r[0].length;
			} else this.i = t + 1;
			let r = this.parseAlt();
			if (e[this.i] !== ")") throw new O("unclosed group");
			return this.i++, this.mods = n, r;
		}
		if (n === "[") {
			let n = t + 1;
			for (e[n] === "^" && n++; n < e.length && e[n] !== "]";) n += e[n] === "\\" ? 2 : 1;
			if (n >= e.length) throw new O("unclosed class");
			return this.i = n + 1, this.atom(e.slice(t, this.i));
		}
		if (n === ".") return this.i++, this.atom(this.iregexp ? "[^\\n\\r]" : ".");
		if (n === "\\") return !this.unicode && e[t + 1] === "c" && !/[a-zA-Z]/.test(e[t + 2] ?? "") ? (this.i = t + 1, this.atom("\\\\", "\\")) : (this.i = t + this.escapeLength(t), this.atom(e.slice(t, this.i)));
		if (n === "*" || n === "+" || n === "?" || n === ")") throw new O("nothing to repeat");
		let r = e.codePointAt(t), i = this.unicode && r > 65535 ? String.fromCodePoint(r) : n;
		return this.i = t + i.length, this.atom(Le.has(i) ? `\\${i}` : i, i);
	}
	escapeLength(e) {
		let { src: t, unicode: n } = this, r = t[e + 1];
		if (r === void 0) throw new O("trailing backslash");
		if (r === "b" || r === "B") throw new O("word boundary");
		if (r >= "1" && r <= "9") throw new O("backreference");
		if (r === "0") {
			if (n) return 2;
			let r = 2;
			for (; r < 4 && /[0-7]/.test(t[e + r] ?? "");) r++;
			return r;
		}
		if (r === "c") return 3;
		if (r === "x" && /^[0-9a-fA-F]{2}/.test(t.slice(e + 2))) return 4;
		if (n && (r === "p" || r === "P" || r === "u") && t[e + 2] === "{") {
			let n = t.indexOf("}", e + 3);
			if (n === -1) throw new O("unclosed escape");
			return n - e + 1;
		}
		if (r === "u" && ze.test(t.slice(e + 2))) {
			let r = parseInt(t.slice(e + 2, e + 6), 16);
			if (n && r >= 55296 && r <= 56319 && t.slice(e + 6, e + 8) === "\\u") {
				let n = t.slice(e + 8, e + 12);
				if (ze.test(n) && parseInt(n, 16) >= 56320 && parseInt(n, 16) <= 57343) return 12;
			}
			return 6;
		}
		return 2;
	}
	parseQuantifier(e) {
		let { src: t } = this, n = t[this.i], r, i;
		if (n === "*") r = 0, i = Infinity, this.i++;
		else if (n === "+") r = 1, i = Infinity, this.i++;
		else if (n === "?") r = 0, i = 1, this.i++;
		else if (n === "{") {
			let n = Re.exec(t.slice(this.i));
			if (!n) return e;
			r = Number(n[1]), i = n[2] === void 0 ? r : n[2] === "" ? Infinity : Number(n[2]), this.i += n[0].length;
		} else return e;
		if (t[this.i] === "?" && this.i++, r > D || i !== Infinity && i > D) throw new O("repetition too large");
		return {
			t: "rep",
			node: e,
			min: r,
			max: i
		};
	}
}, Ue = class {
	constructor(e) {
		this.unicode = e, this.op = [], this.x = [], this.y = [], this.atoms = [], this.atomIds = /* @__PURE__ */ new Map(), this.work = 0;
	}
	emit(e, t = 0, n = 0) {
		if (this.op.length >= D) throw new O("pattern too large");
		return this.op.push(e), this.x.push(t), this.y.push(n), this.op.length - 1;
	}
	atomId(e) {
		let t = (e.mods.i ? "i" : "") + (e.mods.s ? "s" : "") + (this.unicode ? "u" : ""), n = `${t}/${e.src}`, r = this.atomIds.get(n);
		return r === void 0 && (r = this.atoms.length, this.atoms.push({
			re: RegExp(`^(?:${e.src})$`, t),
			literal: e.mods.i ? void 0 : e.literal
		}), this.atomIds.set(n, r)), r;
	}
	finish() {
		this.emit(Pe);
	}
	compile(e) {
		if (++this.work > 4 * D) throw new O("pattern too large");
		switch (e.t) {
			case "atom":
				this.emit(k, this.atomId(e));
				return;
			case "bol":
				this.emit(Me, +!!e.multiline);
				return;
			case "eol":
				this.emit(Ne, +!!e.multiline);
				return;
			case "cat":
				for (let t of e.items) this.compile(t);
				return;
			case "alt": {
				let t = [];
				for (let n = 0; n < e.alts.length - 1; n++) {
					let r = this.emit(Ae);
					this.x[r] = r + 1, this.compile(e.alts[n]), t.push(this.emit(je)), this.y[r] = this.op.length;
				}
				this.compile(e.alts[e.alts.length - 1]);
				for (let e of t) this.x[e] = this.op.length;
				return;
			}
			case "rep":
				for (let t = 0; t < e.min; t++) this.compile(e.node);
				if (e.max === Infinity) {
					let t = this.emit(Ae);
					this.x[t] = t + 1, this.compile(e.node), this.emit(je, t), this.y[t] = this.op.length;
				} else {
					let t = [];
					for (let n = e.min; n < e.max; n++) {
						let n = this.emit(Ae);
						this.x[n] = n + 1, t.push(n), this.compile(e.node);
					}
					for (let e of t) this.y[e] = this.op.length;
				}
				return;
		}
	}
}, We = (e, t, n) => {
	try {
		new RegExp(e, t);
		let r = t.includes("u"), i = new He(e, r, t, n).parse(), a = new Ue(r);
		return a.compile(i), a.finish(), {
			op: a.op,
			x: a.x,
			y: a.y,
			atoms: a.atoms,
			unicode: r,
			sticky: t.includes("y")
		};
	} catch (e) {
		if (e instanceof RangeError) throw e;
		return null;
	}
}, Ge = (e, t, n, r) => {
	let { op: i, x: a, y: o, atoms: s, unicode: c, sticky: l } = e, u = n.regexWork ?? n, { clist: d, nlist: f } = r, p = 0, m = 0, { onList: h, stack: g, atomGen: ee, atomHit: _ } = r, v = r.gen, y = r.step;
	r.gen = v + t.length + 2, r.step = y + t.length + 2;
	let b = 0, x = !1, te = (e, n, r) => {
		let s = 0;
		g[s++] = r;
		let c = 0;
		for (; s > 0;) {
			let r = g[--s];
			if (h[r] !== v) switch (h[r] = v, ++c === 64 && (u(c), c = 0), i[r]) {
				case k:
					e[n++] = r;
					break;
				case Pe: return u(c), x = !0, n;
				case je:
					g[s++] = a[r];
					break;
				case Ae:
					g[s++] = o[r], g[s++] = a[r];
					break;
				case Me:
					(b === 0 || a[r] === 1 && Ve(t.charCodeAt(b - 1))) && (g[s++] = r + 1);
					break;
				case Ne: (b === t.length || a[r] === 1 && Ve(t.charCodeAt(b))) && (g[s++] = r + 1);
			}
		}
		return u(c), n;
	};
	if (v++, p = te(d, 0, 0), x) return !0;
	for (; b < t.length;) {
		if (p === 0 && l) return !1;
		let e = (c ? t.codePointAt(b) : t.charCodeAt(b)) > 65535 ? 2 : 1, n = t.slice(b, b + e), r = y + b + 1;
		v++, m = 0, b += e;
		for (let e = 0; e < p; e++) {
			let t = d[e], i = a[t];
			if (ee[i] !== r) {
				ee[i] = r;
				let e = s[i];
				_[i] = (e.literal === void 0 ? e.re.test(n) : e.literal === n) ? 1 : 0;
			}
			if (_[i] === 1 && (m = te(f, m, t + 1), x)) return !0;
		}
		if (!l && (m = te(f, m, 0), x)) return !0;
		let i = d;
		d = f, f = i, p = m;
	}
	return !1;
}, Ke = (e, t, n) => {
	let r = Ie(e, t.length);
	try {
		return Ge(e, t, n, r);
	} finally {
		e.scratch = r;
	}
}, qe = 256, Je = /* @__PURE__ */ new Map(), Ye = 0, Xe = (e, t, n, r, i = !1) => {
	if (e.length > Ee || t.length > 7 || !Oe.test(t)) return null;
	let a = `${t}/${+!!n}/${+!!i}`, o = Je.get(e)?.get(a);
	if (o !== void 0) return r(e.length), o;
	let s = Array.from(e).join(""), c = ke(s) > De ? null : We(n ? `^(?:${s})$` : s, t, i);
	Ye >= qe && (Je.clear(), Ye = 0);
	let l = Je.get(s);
	return l === void 0 && Je.set(s, l = /* @__PURE__ */ new Map()), l.set(a, c), Ye++, r(s.length + (c === null ? 0 : c.op.length)), c;
}, Ze = (e, t, n) => {
	var r;
	return (r = n.regexProgram) == null || r.call(n, e.op.length), Ke(e, t, n);
}, Qe = class {
	constructor(e) {
		this.nodes = e;
	}
}, $e = (e) => {
	let t = !1;
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		if (r === "\\" && n + 1 < e.length) {
			let r = e[n + 1];
			if ((r === "b" || r === "B") && !t) return !0;
			n++;
		} else r === "[" && !t ? t = !0 : r === "]" && t && (t = !1);
	}
	return !1;
}, et = (e) => {
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		if (n === "\\") {
			let n = e[t + 1];
			if (n >= "1" && n <= "9") return !1;
			t++;
		} else if (n === "(" && e[t + 1] === "?") {
			let n = e[t + 2];
			if (n === "=" || n === "!") return !1;
			if (n === "<") {
				let n = e[t + 3];
				if (n === "=" || n === "!" || /[a-zA-Z]/.test(n ?? "")) return !1;
			}
		}
	}
	return !$e(e);
}, tt = 256, nt = /* @__PURE__ */ new Map(), rt = (e, t) => {
	let n = nt.get(e);
	return n === void 0 && (n = et(e), nt.size >= tt && nt.clear(), nt.set(Array.from(e).join(""), n)), t(e.length), n;
}, it = /* @__PURE__ */ new Map(), at = (e, t) => {
	let n = it.get(e);
	return n === void 0 && (n = Te(e), n !== null && (n = Array.from(n).join("")), it.size >= tt && it.clear(), it.set(Array.from(e).join(""), n)), t(e.length), n;
}, ot = 256, st = (e, t, n, r, i, a, o = !1) => {
	let s = a === void 0 ? void 0 : i.regexSites, c = s?.get(a);
	if (c === void 0) {
		if (e.length > Ee) c = null;
		else if (o) {
			let n = at(e, i);
			c = n === null ? null : Xe(n, t, r, i, !0);
		} else c = rt(e, i) ? Xe(e, t, r, i) : null;
		s !== void 0 && (s.size >= ot && s.clear(), s.set(a, c));
	}
	return c !== null && Ze(c, n, i);
}, ct = {
	length: (e, t) => {
		let n = e[0];
		if (w(n)) {
			t(n.length);
			let e = n.length;
			for (let t = 0; t < n.length - 1; t++) {
				let r = n.charCodeAt(t);
				if (r >= 55296 && r <= 56319) {
					let r = n.charCodeAt(t + 1);
					r >= 56320 && r <= 57343 && (e--, t++);
				}
			}
			return e;
		}
		if (x(n)) return y(n);
		if (S(n)) {
			let e = v(n);
			return t(e.length), e.length;
		}
	},
	count: (e) => e[0].nodes.length,
	match: (e, t, n) => {
		let r = e[0], i = e[1];
		return !w(r) || !w(i) ? !1 : st(i, "u", r, !0, t, n, !0);
	},
	search: (e, t, n) => {
		let r = e[0], i = e[1];
		return !w(r) || !w(i) ? !1 : st(i, "u", r, !1, t, n, !0);
	},
	value: (e) => {
		let { nodes: t } = e[0];
		return t.length === 1 ? t[0] : void 0;
	}
}, lt = (e, t, n = f) => e === void 0 && t === void 0 || m(e, t, n), ut = (e, t, n = f) => !m(e, t, n), dt = (e) => e >= 55296 && e <= 57343 ? e + 8192 : e >= 57344 ? e - 2048 : e, ft = (e, t) => {
	let n = Math.min(e.length, t.length);
	for (let r = 0; r < n; r++) {
		let n = e.charCodeAt(r), i = t.charCodeAt(r);
		if (n !== i) return dt(n) - dt(i);
	}
	return e.length - t.length;
}, pt = (e, t, n = f) => C(e) && C(t) ? e < t : w(e) && w(t) ? (n(Math.min(e.length, t.length)), ft(e, t) < 0) : !1, mt = (e, t, n = f) => pt(e, t, n) || lt(e, t, n), A = (e, t, n = f) => C(e) && C(t) ? e > t : w(e) && w(t) ? (n(Math.min(e.length, t.length)), ft(e, t) > 0) : !1, ht = (e, t, n = f) => A(e, t, n) || lt(e, t, n), gt = (e, t) => typeof e == "string" && typeof t == "string" && e.length === t.length ? e.length : 0, _t = (e, t, n) => {
	let r = y(e);
	for (let i = 0; i < r; i++) {
		let r = g(e, i);
		if (n(1 + gt(r, t)), r === t || r !== r && t !== t) return i;
	}
	return -1;
}, vt = (e) => typeof e == "number" ? "n" + String(e) : typeof e == "string" ? "s" + e : e, yt = (e) => typeof e == "string" && e.length + 1 > ee, j = (e, t, n) => {
	let r = n?.get(e);
	if (r) return r;
	let i = {
		set: /* @__PURE__ */ new Set(),
		long: []
	}, a = y(e);
	for (let n = 0; n < a; n++) {
		let r = g(e, n);
		t(1 + (typeof r == "string" ? r.length : 0)), yt(r) ? i.long.push(r) : i.set.add(vt(r));
	}
	return n?.set(e, i), i;
}, bt = ({ set: e, long: t }, n, r) => {
	if (yt(n)) {
		for (let e of t) if (r(1 + gt(e, n)), e === n) return !0;
		return !1;
	}
	return e.size === 0 ? (r(), !1) : (r(1 + (typeof n == "string" ? 2 * n.length : 0)), e.has(vt(n)));
}, xt = (e, t, n) => {
	let r = y(e);
	for (let i = 0; i < r; i++) if (n(), h(e, i) && t(e[i])) return !0;
	return !1;
}, St = {
	eq: lt,
	ne: ut,
	lt: pt,
	le: mt,
	gt: A,
	ge: ht,
	in: (e, t, n = f) => x(t) ? _t(t, e, n) !== -1 : !1,
	nin: (e, t, n = f) => x(t) ? _t(t, e, n) === -1 : !1,
	subsetof: (e, t, n = f, r) => {
		if (!x(e) || !x(t)) return !1;
		let i = j(t, n, r);
		return !xt(e, (e) => !bt(i, e, n), n);
	},
	anyof: (e, t, n = f, r) => {
		if (!x(e) || !x(t)) return !1;
		let i = j(t, n, r);
		return xt(e, (e) => bt(i, e, n), n);
	},
	noneof: (e, t, n = f, r) => {
		if (!x(e) || !x(t)) return !1;
		let i = j(t, n, r);
		return !xt(e, (e) => bt(i, e, n), n);
	},
	sizeof: (e, t) => !x(e) && !w(e) || !x(t) && !w(t) ? !1 : (x(e) ? y(e) : e.length) === (x(t) ? y(t) : t.length),
	size: (e, t) => !x(e) && !w(e) || !C(t) ? !1 : (x(e) ? y(e) : e.length) === t
}, Ct = (e) => !x(e) && !w(e) ? !1 : (x(e) ? y(e) : e.length) === 0, wt = (e, t, n, r = f, i) => !w(e) || !w(t) ? !1 : st(i !== void 0 && r.regexSites?.has(i) === !0 ? "" : t.slice(1, -1), n, e, !1, r, i), M = (e) => e.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\x08/g, "\\b").replace(/\f/g, "\\f").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/[\x00-\x07\x0b\x0e-\x1f]/g, (e) => "\\u00" + e.charCodeAt(0).toString(16).padStart(2, "0")), N = (e, t) => e.concat(`[${t}]`), P = (e, t) => e < 0 ? t + e : e, Tt = (e, t) => {
	let n = y(e), r = P(t, n);
	return r >= 0 && r < n ? {
		exists: !0,
		value: h(e, r) ? e[r] : void 0,
		index: r
	} : { exists: !1 };
}, F = (e, t) => {
	for (let n of t) e.push(n);
}, Et = 1e6, Dt = 100, Ot = 1e6, kt = 20, At = 1e4, jt = 1e4, Mt = class {
	constructor(e) {
		this.weight = 0, this.nodes = 0, this.stringPositions = 0, this.done = !1, this.seen = /* @__PURE__ */ new Set(), this.frames = [], this.visit(e);
	}
	advance(e) {
		let t = this.nodes + e, { frames: n } = this;
		for (; n.length > 0 && this.nodes < t;) {
			let e = n[n.length - 1];
			if (e.i >= e.length) {
				n.pop();
				continue;
			}
			let t = e.i++;
			if (e.keys === null) {
				let n = e.container;
				if (e.indices !== null) {
					let r = Number(e.indices[t]);
					h(n, r) && this.visit(n[r]);
				} else if (h(n, t)) this.visit(n[t]);
				else if (++e.holes > jt) {
					let r = e.length, i = Object.getOwnPropertyNames(n).filter((e) => {
						let n = Number(e);
						return Number.isInteger(n) && n > t && n < r && String(n) === e;
					});
					e.indices = i, e.length = i.length, e.i = 0;
				}
			} else {
				let n = e.container, r = e.keys[t];
				if (!h(n, r)) continue;
				this.weight += r.length, this.visit(n[r]);
			}
		}
		n.length === 0 && (this.done = !0);
	}
	visit(e) {
		if (this.nodes++, this.weight += typeof e == "string" ? 1 + e.length : 1, typeof e == "string" && (this.stringPositions += 1 + e.length), typeof e == "object" && e && !this.seen.has(e)) {
			if (this.seen.add(e), x(e)) this.frames.push({
				container: e,
				keys: null,
				indices: null,
				length: y(e),
				i: 0,
				holes: 0
			});
			else if (S(e)) {
				let t = Object.keys(e);
				this.frames.push({
					container: e,
					keys: t,
					indices: null,
					length: t.length,
					i: 0,
					holes: 0
				});
			}
		}
	}
}, Nt = class {
	constructor(e, t = {}) {
		this.steps = 0, this.largestRegexProgram = 0, this.regexSteps = 0, this.rootQueryCache = /* @__PURE__ */ new Map(), this.setCaches = /* @__PURE__ */ new Map(), this.siteSetCache = (e) => {
			let t = this.setCaches.get(e);
			return t === void 0 && (t = /* @__PURE__ */ new WeakMap(), this.setCaches.set(e, t)), t;
		}, this.canonicalNames = /* @__PURE__ */ new Map(), this.canonicalName = (e, t) => {
			let n = this.canonicalNames.get(e);
			return n === void 0 && (this.tick(t.length), n = Object.keys({ [t]: 0 })[0], this.canonicalNames.set(e, n), this.escapedNames.has(n) || this.escapedNames.set(n, M(n))), n;
		}, this.escapedNames = /* @__PURE__ */ new Map(), this.formatStringLiteralPath = (e, t) => {
			let n = this.escapedNames.get(t);
			return n === void 0 && (this.tick(t.length), n = M(t), this.escapedNames.set(t, n)), e.concat(`['${n}']`);
		}, this.forEachElement = (e, t) => {
			let n = y(e);
			for (let r = 0; r < n; r++) this.tick(), h(e, r) && t(e[r], r);
		}, this.retained = 0, this.retain = () => {
			if (!(++this.retained <= this.retainedLimit)) {
				if (this.adaptiveLimit) {
					let e = this.weigher ??= new Mt(this.rootPayload.value);
					for (; !e.done;) if (e.advance(Math.max(At, Math.ceil((this.retained - this.retainedLimit) / kt))), this.raiseLimits(e), this.retained <= this.retainedLimit) return;
					if (this.raiseLimits(e), this.retained <= this.retainedLimit) return;
				}
				throw new d(`Query retains more than ${this.retainedLimit} nodes`);
			}
		}, this.raiseLimits = (e) => {
			let t = Math.min(this.regexSteps, this.largestRegexProgram * e.stringPositions);
			this.stepLimit = Math.max(Et, Dt * e.weight) + t, this.retainedLimit = Math.max(Ot, kt * e.nodes);
		}, this.tick = Object.assign((e = 1) => {
			if (this.steps += e, !(this.steps <= this.stepLimit)) {
				if (this.adaptiveLimit) {
					let e = this.weigher ??= new Mt(this.rootPayload.value);
					for (; !e.done;) if (e.advance(Math.max(At, Math.ceil((this.steps - this.stepLimit) / Dt))), this.raiseLimits(e), this.steps <= this.stepLimit) return;
					if (this.raiseLimits(e), this.steps <= this.stepLimit) return;
				}
				throw new d(`Query exceeded ${this.stepLimit} evaluation steps`);
			}
		}, {
			regexProgram: (e) => {
				this.largestRegexProgram = Math.max(this.largestRegexProgram, e);
			},
			regexWork: (e) => {
				this.regexSteps += e, this.tick(e);
			},
			regexSites: /* @__PURE__ */ new Map()
		}), this.readsCurrent = /* @__PURE__ */ new WeakMap(), this.invariantResults = /* @__PURE__ */ new Map(), this.isInvariant = (e) => (this.readsCurrent.has(e) || this.classify(e), !this.readsCurrent.get(e)), this.classify = (e) => {
			let t = this.readsCurrent, n = [], r = (e) => {
				if (typeof e != "object" || !e) return !1;
				let r = t.get(e);
				if (r !== void 0) return r;
				let i = e.type;
				if (i === "current") return t.set(e, !0), !0;
				if (i === "filterExpression" || i === "value") return t.set(e, !1), !1;
				let a = Object.values(e);
				n.push({
					node: e,
					children: a,
					i: 0,
					reads: !1
				});
			};
			for (r(e); n.length > 0;) {
				let e = n[n.length - 1];
				e.i < e.children.length ? r(e.children[e.i++]) === !0 && (e.reads = !0) : (t.set(e.node, e.reads), n.pop(), e.reads && n.length > 0 && (n[n.length - 1].reads = !0));
			}
		}, this.memoInvariant = (e, t) => {
			if (!this.isInvariant(e)) return t();
			if (this.invariantResults.has(e)) return this.invariantResults.get(e);
			let n = t();
			return this.invariantResults.set(e, n), n;
		}, this.handleRootQuery = (e, t) => {
			if (this.rootQueryCache.has(e)) return this.rootQueryCache.get(e);
			let n = this.handleSubscript(this.rootPayload, t);
			return this.rootQueryCache.set(e, n), n;
		}, this.handleIdentifier = (e, t) => this.selectMember(e, t), this.handleStringLiteral = (e, t) => this.selectMember(e, t), this.selectMember = ({ value: e, paths: t }, n) => {
			if (!S(e)) return;
			let r = this.canonicalName(n, n.value);
			if (h(e, r)) return {
				value: e[r],
				paths: this.formatStringLiteralPath(t, r)
			};
		}, this.handleWildcard = ({ value: e, paths: t }) => {
			if (x(e)) {
				let n = [];
				return this.forEachElement(e, (e, r) => {
					this.retain(), n.push({
						value: e,
						paths: N(t, r)
					});
				}), n;
			}
			if (S(e)) {
				let n = v(e);
				this.tick(n.length);
				let r = [];
				for (let i of n) h(e, i) && (this.retain(), r.push({
					value: e[i],
					paths: this.formatStringLiteralPath(t, i)
				}));
				return r;
			}
			return [];
		}, this.handleNumericLiteral = ({ value: e, paths: t }, n) => {
			if (!x(e)) return;
			let r = Tt(e, n.value);
			if (r.exists) return {
				value: r.value,
				paths: N(t, r.index)
			};
		}, this.handleDotNumericLiteral = ({ value: e, paths: t }, n) => {
			if (x(e)) {
				let r = Tt(e, n.value);
				return r.exists ? {
					value: r.value,
					paths: N(t, r.index)
				} : void 0;
			}
			if (S(e)) {
				let r = String(n.value);
				return h(e, r) ? {
					value: e[r],
					paths: this.formatStringLiteralPath(t, r)
				} : void 0;
			}
		}, this.handleSlices = ({ value: e, paths: t }, n) => {
			if (!x(e)) return [];
			let r = y(e), i = n.step ?? 1;
			if (i === 0) return [];
			let a, o;
			i > 0 ? (a = n.start === null ? 0 : P(n.start, r), o = n.end === null ? r : P(n.end, r)) : (a = n.start === null ? r - 1 : P(n.start, r), o = n.end === null ? -r - 1 : P(n.end, r));
			let s, c;
			i > 0 ? (s = Math.max(a, 0), c = Math.min(o, r)) : (c = Math.min(a, r - 1), s = Math.max(o, -1));
			let l = [], u = i > 0 ? s : c;
			for (; i > 0 && u < c || i < 0 && u > s;) this.tick(), this.retain(), l.push({
				value: h(e, u) ? e[u] : void 0,
				paths: N(t, u)
			}), u += i;
			return l;
		}, this.handleUnions = (e, t) => {
			let n = [];
			for (let r of t.values) switch (this.tick(), r.type) {
				case "identifier":
					if (S(e.value)) {
						let t = this.handleIdentifier(e, r);
						T(t) && (this.retain(), n.push(t));
					}
					break;
				case "stringLiteral":
					if (S(e.value)) {
						let t = this.handleStringLiteral(e, r);
						T(t) && (this.retain(), n.push(t));
					}
					break;
				case "numericLiteral":
					if (x(e.value)) {
						let t = this.handleNumericLiteral(e, r);
						T(t) && (this.retain(), n.push(t));
					}
					break;
				case "wildcard":
					F(n, this.handleWildcard(e));
					break;
				case "slices":
				case "filterExpression": F(n, this.handleBracketExpressionContent(e, r));
			}
			return n;
		}, this.handleDotdot = (e, t) => {
			let n = [];
			return this.collectDotdot(e, t, n), n;
		}, this.collectDotdot = (e, t, n) => {
			let r = t.value, i = [];
			this.tick();
			let a = e;
			for (; a !== void 0;) {
				let e = a.value;
				switch (r.type) {
					case "bracketMember": {
						let e = this.handleBracketMemberContent(a, r.value);
						T(e) && (this.retain(), n.push(e));
						break;
					}
					case "bracketExpression":
						F(n, this.handleBracketExpressionContent(a, r.value));
						break;
					case "wildcard":
						F(n, this.handleWildcard(a));
						break;
					case "identifier": {
						let e = this.handleIdentifier(a, r);
						T(e) && (this.retain(), n.push(e));
						break;
					}
				}
				if (S(e)) {
					let t = v(e);
					this.tick(t.length), i.push({
						parent: a,
						keys: t,
						length: t.length,
						i: 0
					});
				} else x(e) && i.push({
					parent: a,
					keys: null,
					length: y(e),
					i: 0
				});
				for (a = void 0; i.length > 0;) {
					let e = i[i.length - 1];
					if (e.i >= e.length) {
						i.pop();
						continue;
					}
					let t = e.i++;
					if (e.keys === null) {
						this.tick();
						let n = e.parent.value;
						if (!h(n, t)) continue;
						a = {
							value: n[t],
							paths: N(e.parent.paths, t)
						};
					} else {
						let n = e.parent.value, r = e.keys[t];
						if (!h(n, r)) continue;
						a = {
							value: n[r],
							paths: this.formatStringLiteralPath(e.parent.paths, r)
						};
					}
					break;
				}
			}
		}, this.handleOperationContent = (e, t) => {
			switch (this.tick(), t.type) {
				case "root": return this.handleRootQuery(t, t.next);
				case "current": return this.handleSubscript(e, t.next);
				case "value": return {
					value: t.value,
					paths: e.paths
				};
				case "groupOperation": return this.memoInvariant(t, () => this.handleOperationContent(e, t.value));
				case "functionCall": return {
					value: this.handleFunctionCall(e, t),
					paths: e.paths
				};
				case "operation": {
					let n = [], r = t;
					for (; r.type === "operation";) n.push({
						operator: r.operator,
						right: r.right
					}), r = r.left;
					let i = this.handleOperationContent(e, r)?.value;
					this.tick(n.length);
					for (let t = n.length - 1; t >= 0; t--) {
						let r = this.handleOperationContent(e, n[t].right)?.value;
						if (!C(i) || !C(r)) i = void 0;
						else switch (n[t].operator) {
							case "plus":
								i += r;
								break;
							case "minus":
								i -= r;
								break;
							case "div":
								i = r === 0 ? void 0 : i / r;
								break;
							case "multi": i *= r;
						}
					}
					return C(i) ? {
						value: i,
						paths: e.paths
					} : void 0;
				}
			}
		}, this.handleComparator = (e, t) => this.memoInvariant(t, () => this.evaluateComparator(e, t)), this.evaluateComparator = (e, t) => {
			let n = this.handleOperationContent(e, t.left)?.value;
			if (t.operator === "empty") return Ct(n);
			if (t.operator === "reg") return wt(n, t.right.value, t.right.opts, this.tick, t);
			let r = this.handleOperationContent(e, t.right)?.value, i = St[t.operator];
			if (i) {
				let e = this.isInvariant(t.right) ? this.siteSetCache(t.right) : void 0;
				return i(n, r, this.tick, e);
			}
			return !1;
		}, this.handleLogicalExpression = (e, t) => this.memoInvariant(t, () => this.evaluateLogicalExpression(e, t)), this.evaluateLogicalExpression = (e, t) => {
			let n = [], r = !this.isInvariant(t), i = t;
			for (; i.type === "logicalExpression" && (i === t || !r || !this.isInvariant(i));) n.push({
				operator: i.operator,
				right: i.right
			}), i = i.left;
			this.tick(n.length);
			let a = this.handleFilterExpressionContent(e, i);
			for (let t = n.length - 1; t >= 0; t--) (n[t].operator === "and" ? a : !a) && (a = this.handleFilterExpressionContent(e, n[t].right));
			return a;
		}, this.handleFunctionCall = (e, t) => this.memoInvariant(t, () => this.evaluateFunctionCall(e, t)), this.evaluateFunctionCall = (e, t) => {
			let n = t.name === "count" || t.name === "value", r = t.args.map((t) => {
				let r = this.handleOperationContent(e, t);
				return !n || t.type !== "root" && t.type !== "current" ? r?.value : r?.isIndefinite ? new Qe(r.value) : new Qe(T(r?.value) ? [r?.value] : []);
			}), i = ct[t.name], a = t.args[1], o = a?.type === "stringLiteral" || a?.subtype === "string";
			return i ? i(r, this.tick, o ? t : void 0) : void 0;
		}, this.handleFilterExpressionContent = (e, t) => {
			switch (this.tick(), t.type) {
				case "logicalExpression": return this.handleLogicalExpression(e, t);
				case "comparator": return this.handleComparator(e, t);
				case "groupExpression": return this.memoInvariant(t, () => this.handleFilterExpressionContent(e, t.value));
				case "notExpression": return this.memoInvariant(t, () => !this.handleFilterExpressionContent(e, t.value));
				case "functionCall": return !!this.handleFunctionCall(e, t);
				case "root": {
					let e = this.handleRootQuery(t, t.next);
					return e?.isIndefinite ? Array.isArray(e.value) && e.value.length > 0 : T(e);
				}
				case "current": {
					let n = this.handleSubscript(e, t.next);
					return n?.isIndefinite ? Array.isArray(n.value) && n.value.length > 0 : T(n);
				}
				case "value": return !!t.value;
			}
		}, this.handleBracketMemberContent = (e, t) => {
			switch (t.type) {
				case "identifier": return this.handleIdentifier(e, t);
				case "numericLiteral": return this.handleNumericLiteral(e, t);
				case "stringLiteral": return this.handleStringLiteral(e, t);
			}
		}, this.handleBracketExpressionContent = (e, t) => {
			let n = e.value;
			switch (t.type) {
				case "filterExpression": {
					let r = [];
					if (x(n)) this.forEachElement(n, (n, i) => {
						let a = {
							value: n,
							paths: N(e.paths, i)
						};
						this.handleFilterExpressionContent(a, t.value) && (this.retain(), r.push(a));
					});
					else if (S(n)) {
						let i = v(n);
						this.tick(i.length);
						for (let a of i) {
							if (!h(n, a)) continue;
							let i = {
								value: n[a],
								paths: this.formatStringLiteralPath(e.paths, a)
							};
							this.handleFilterExpressionContent(i, t.value) && (this.retain(), r.push(i));
						}
					}
					return r;
				}
				case "unions": return this.handleUnions(e, t);
				case "wildcard": return this.handleWildcard(e);
				case "slices": return this.handleSlices(e, t);
			}
		}, this.isIndefiniteSegment = (e) => {
			let t = e.value;
			return t.type === "bracketExpression" || t.type === "dotdot" || t.type === "dot" && t.value.type === "wildcard";
		}, this.selectMany = (e, t) => {
			let n = t.value;
			switch (n.type) {
				case "bracketExpression": return this.handleBracketExpressionContent(e, n.value);
				case "dotdot": return this.handleDotdot(e, n);
				default: return this.handleWildcard(e);
			}
		}, this.selectOne = (e, t) => {
			let n = t.value;
			switch (n.type) {
				case "bracketMember": return this.handleBracketMemberContent(e, n.value);
				case "dot":
					if (n.value.type === "identifier") return this.handleIdentifier(e, n.value);
					if (n.value.type === "numericLiteral") return this.handleDotNumericLiteral(e, n.value);
			}
		}, this.handleSubscript = (e, t) => {
			if (t === null) return e;
			let n = [], r = [{
				node: e,
				segment: t
			}], i = !1;
			for (; r.length > 0;) {
				let { node: e, segment: t } = r.pop(), a;
				if (this.isIndefiniteSegment(t)) i = !0, a = this.selectMany(e, t);
				else {
					this.tick();
					let n = this.selectOne(e, t);
					if (!T(n)) continue;
					a = [n];
				}
				let o = t.next;
				if (o === null) F(n, a);
				else for (let e = a.length - 1; e >= 0; e--) r.push({
					node: a[e],
					segment: o
				});
			}
			if (!i) return n[0];
			let a = [], o = [];
			for (let e of n) a.push(e.value), o.push(e.paths);
			return {
				value: a,
				paths: o,
				isIndefinite: !0
			};
		}, this.handleRoot = (e) => {
			try {
				return this.handleSubscript(this.rootPayload, e.next);
			} catch (e) {
				throw b(e) ? new d("Query is nested too deeply") : te(e) ? new d("Query result is too large") : e;
			}
		}, this.rootPayload = {
			value: e,
			paths: "$"
		}, this.adaptiveLimit = t.maxSteps === void 0, this.stepLimit = t.maxSteps ?? Et, this.retainedLimit = this.adaptiveLimit ? Ot : Infinity;
	}
}, Pt = (e, t, n) => {
	let r = pe(t), i = new Nt(e, n).handleRoot(r);
	return !i?.isIndefinite && n.returnArray ? ne(i) ? [] : [i.value] : i?.value;
}, Ft = (e, t, n) => {
	let r = [];
	for (let i of t) {
		let t = Pt(e, i, n);
		T(t) && r.push(t);
	}
	return r;
}, It = (e, t, n = {}) => {
	try {
		return x(t) ? Ft(e, t, n) : Pt(e, t, n);
	} catch (e) {
		if (!n.hideExceptions) throw e;
		return n.returnArray ? [] : void 0;
	}
}, Lt = (e) => typeof e == "object" && !!e && !Array.isArray(e), Rt = (e, t) => {
	if (!Lt(e)) return;
	let n = {};
	for (let [r, i] of Object.entries(e)) n[r] = I(t, i);
	return n;
}, zt = (e, t) => {
	let n = structuredClone(e);
	if (Array.isArray(n)) return n.map((e) => I(t, e));
}, Bt = (e, t, n) => {
	if (e === "${agg:count}" && "rowData" in t) {
		if (Array.isArray(t?.rowData)) return t?.rowData.length;
	} else if (e === "${rowValue}" && "rowData" in t) return t?.rowData;
	else return e.replace(/\$\{(\w+)\}/g, (e, n) => t[n] === void 0 ? e : t[n]);
}, Vt = (e, t) => Bt(e, t), Ht = (e, t, n) => {
	if (n && console.log("inElement : ", e), n && console.log("inTemplate : ", t), t == null) throw TypeError("inTemplate is required");
	if (typeof t != "object" && typeof t != "string") throw TypeError("inTemplate must be an object or string");
	if (!e || typeof e != "object" || Array.isArray(e)) throw TypeError("inElement must be an object");
	return !0;
}, Ut = {
	name: "json-transformer-funcs-primitive",
	version: "1.9.1"
}, Wt = (e) => {
	typeof globalThis < "u" && e && (globalThis.ks ??= {}, globalThis.ks.transformer ??= {}, globalThis.ks.transformer.funcs ??= {}, globalThis.ks.transformer.funcs.primitive = {
		meta: Ut,
		applyTemplate: e
	});
}, I = (e, t, n) => {
	let r = e, i = t;
	Ht(r, i, n);
	let a = structuredClone(i);
	return typeof a == "string" ? Bt(a, r) : (typeof a != "object" || !a || ("textContent" in a && (a.textContent = Vt(a?.textContent, r)), "attributes" in a && (a.attributes = Rt(a?.attributes, r)), "children" in a && (a.children = zt(a?.children, r))), a);
};
Wt(I);
// node_modules/json-transformer-funcs-one-dimension/src/v9/guard/index.js
var Gt = (e, t) => {
	if (!Array.isArray(e)) throw TypeError("inSource must be an Array");
	if (e.length === 0) throw Error("inSource cannot be empty");
	for (let t = 0; t < e.length; t++) if (!e[t] || typeof e[t] != "object") throw TypeError(`inSource[${t}] must be an object`);
	if (!t || typeof t != "object" && typeof t != "string") throw TypeError("inTemplate must be an object or string");
	return !0;
}, Kt = {
	name: "json-transformer-funcs-one-dimension",
	version: "1.9.1"
}, qt = (e, t) => {
	if (typeof globalThis < "u") return globalThis.ks ??= {}, globalThis.ks.transformer ??= {}, globalThis.ks.transformer.funcs ??= {}, globalThis.ks.transformer.funcs.oneDimension = {
		meta: Kt,
		individualTemplate: e,
		template: t
	}, globalThis.ks.transformer.funcs.oneDimension;
}, L = (e, t) => {
	let n = e, r = t;
	return Gt(n, r), n.map((e) => I(e, r));
};
qt((e, t) => {
	let n = e;
	return Gt(n, t), n.map((e) => I(e, e[t]));
}, L);
// node_modules/json-transformer-funcs-two-dimensions/src/v8/addRowData.js
var Jt = (e, t) => e.map((e) => ({
	...e,
	rowData: t[e.columnName]
})), Yt = (e, t) => {
	if (!Array.isArray(e)) throw TypeError("inColumns must be an Array");
	if (e.length === 0) throw Error("inColumns cannot be empty");
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		if (!n || typeof n != "object") throw TypeError(`inColumns[${t}] must be an object`);
		if (typeof n.columnName != "string" || !n.columnName.trim()) throw TypeError(`inColumns[${t}].columnName must be a non-empty string`);
	}
	if (!Array.isArray(t)) throw TypeError("inData must be an Array");
	for (let e = 0; e < t.length; e++) {
		let n = t[e];
		if (!n || typeof n != "object") throw TypeError(`inData[${e}] must be an object`);
	}
	return !0;
}, Xt = ({ columns: e, data: t, columnSpec: n, rowSpec: r }) => {
	Yt(e, t);
	let i = e;
	return t.map((e) => {
		let t = I(e, r);
		return t.children = L(Jt(i, e), n), t;
	});
}, Zt = (e, t) => {
	if (e?.attributes?.["data-role"] === t) return e;
	for (let n of e?.children ?? []) {
		let e = Zt(n, t);
		if (e) return e;
	}
	return null;
}, Qt = (e, t, n) => {
	let r = e?.[t.fileName];
	if (r === void 0) throw Error(`Registry entry not found: ${t.fileName}`);
	let i = r;
	if (t.jsonPath) {
		let e = It(r, t.jsonPath, { returnArray: !0 });
		if (e.length === 0) throw Error(`Destination JSONPath matched no nodes: ${t.jsonPath}`);
		if (e.length > 1) throw Error(`Destination JSONPath must identify exactly one node; matched ${e.length}: ${t.jsonPath}`);
		i = e[0];
	} else if (t.dataRole && (i = Zt(r, t.dataRole), i == null)) throw Error(`Destination dataRole not found: ${t.dataRole}`);
	let a = [...t.filePath ?? []];
	if (a.length === 0) throw Error("destinationPath.filePath must contain the property to write");
	let o = a.pop(), s = a.reduce((e, t) => {
		if (e == null) throw Error(`Cannot resolve destination filePath at: ${t}`);
		return e[t];
	}, i);
	if (s == null) throw Error(`Destination parent not found for filePath: ${t.filePath.join(".")}`);
	return n && console.log("json-write-path v6 resolved:", {
		fileName: t.fileName,
		jsonPath: t.jsonPath,
		dataRole: t.dataRole,
		filePath: t.filePath,
		parent: s,
		key: o
	}), {
		parent: s,
		key: o,
		target: i
	};
}, $t = (e, r, i, a) => {
	let { parent: o, key: s } = Qt(e, r, a);
	return (n[r.action] || t)(o, s, i), e;
}, en = (e, t) => {
	if (e?.attributes?.["data-role"] === t) return e;
	for (let n of e?.children ?? []) {
		let e = en(n, t);
		if (e) return e;
	}
	return null;
}, tn = (e, t) => {
	let n = e[t.fileName], r = t.dataRole ? en(n, t.dataRole) : n;
	return (t.filePath ?? []).reduce((e, t) => e[t], r);
}, nn = {
	buildBodyTr: {
		tagName: "tr",
		attributes: { class: "align-middle" },
		children: []
	},
	buildColGroup: {
		tagName: "col",
		attributes: { width: "${width}" }
	},
	buildHeader: {
		tagName: "th",
		textContent: "${columnName}",
		attributes: { class: "py-3 px-3 fw-semibold text-uppercase small" }
	},
	buildFooter: {
		tagName: "td",
		children: [{
			tagName: "input",
			attributes: {
				type: "text",
				placeholder: "enter ${columnName}",
				name: "${columnName}",
				id: "${columnName}",
				list: "${columnName}",
				class: "form-control"
			}
		}]
	},
	buildBodyCell: {
		tagName: "td",
		textContent: "${rowValue}",
		attributes: { class: "py-3 px-3 text-secondary" }
	},
	button: {
		tagName: "button",
		textContent: "${columnName}",
		attributes: { class: "btn btn-primary btn-sm" }
	},
	buttonCell: {
		tagName: "td",
		attributes: { class: "py-2 px-3 text-center" },
		children: [{
			tagName: "button",
			textContent: "${agg:count}",
			attributes: { class: "btn btn-primary btn-sm" }
		}]
	},
	optionsButtonCell: {
		tagName: "td",
		attributes: { class: "py-2 px-3 text-center" },
		children: [{
			tagName: "button",
			textContent: "show",
			attributes: { class: "btn btn-primary btn-sm ks-btn-show" }
		}]
	},
	buildOption: {
		tagName: "option",
		textContent: "${rowValue}",
		attributes: { value: "${rowValue}" }
	},
	buildSelect: {
		tagName: "select",
		attributes: {
			id: "${columnName}",
			name: "${columnName}",
			"data-name": "${columnName}",
			class: "form-select shadow-sm mb-3"
		},
		children: []
	},
	buildDataList: {
		tagName: "datalist",
		attributes: {
			id: "${columnName}",
			"data-name": "${columnName}"
		},
		children: []
	},
	buildFormField: {
		tagName: "div",
		attributes: { class: "mb-3" },
		children: [{
			tagName: "label",
			textContent: "${columnName}",
			attributes: {
				for: "${columnName}",
				class: "form-label fw-semibold text-capitalize"
			}
		}, {
			tagName: "input",
			attributes: {
				type: "text",
				id: "${columnName}",
				name: "${columnName}",
				placeholder: "Enter ${columnName}...",
				class: "form-control"
			}
		}]
	},
	emptyCell: {
		tagName: "td",
		children: []
	},
	headerSerialCell: {
		tagName: "th",
		textContent: "#",
		attributes: { class: "py-3 px-3 fw-semibold text-uppercase small" }
	},
	colGroupForSerial: {
		tagName: "col",
		attributes: { width: "50px" }
	},
	colGroupForOption: {
		tagName: "col",
		attributes: { width: "100px" }
	},
	headerForOption: {
		tagName: "th",
		textContent: "options",
		attributes: { class: "py-3 px-3 fw-semibold text-uppercase small" }
	},
	tdWithButtonSaveWarning: {
		tagName: "td",
		attributes: { class: "py-2 px-3 text-center" },
		children: [{
			tagName: "button",
			textContent: "save",
			attributes: { class: "btn btn-warning btn-sm ks-btn-save" }
		}]
	},
	tableSearch: {
		tagName: "div",
		attributes: { class: "row mb-3 justify-content-end" },
		children: [{
			tagName: "div",
			attributes: { class: "col-md-4" },
			children: [{
				tagName: "div",
				attributes: { class: "input-group" },
				children: [{
					tagName: "span",
					attributes: { class: "input-group-text bg-white" },
					children: [{
						tagName: "i",
						attributes: { class: "bi bi-search" },
						textContent: "🔍"
					}]
				}, {
					tagName: "input",
					attributes: {
						type: "text",
						id: "tableSearch",
						class: "form-control",
						placeholder: "Search table..."
					}
				}]
			}]
		}]
	}
}, rn = {
	$schema: "./tags.schema.json",
	div: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: ["title", "role"],
		childTags: []
	},
	input: {
		allowsTextContent: !1,
		allowsChildren: !1,
		allowedAttributes: [
			"type",
			"placeholder",
			"value",
			"name",
			"disabled",
			"readonly",
			"required",
			"list"
		]
	},
	checkbox: {
		allowsTextContent: !1,
		allowsChildren: !1,
		allowedAttributes: [
			"type",
			"checked",
			"name",
			"value",
			"disabled",
			"required"
		]
	},
	colgroup: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: ["span"],
		childTags: ["col"]
	},
	col: {
		allowsTextContent: !1,
		allowsChildren: !1,
		allowedAttributes: [
			"span",
			"style",
			"width"
		]
	},
	label: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: ["for"],
		childTags: []
	},
	form: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [
			"action",
			"method",
			"autocomplete",
			"enctype",
			"name",
			"novalidate",
			"target"
		],
		childTags: []
	},
	select: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [
			"name",
			"disabled",
			"required",
			"multiple",
			"size"
		],
		childTags: ["option"]
	},
	p: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: []
	},
	h1: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: []
	},
	h2: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: []
	},
	span: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: []
	},
	img: {
		allowsTextContent: !1,
		allowsChildren: !1,
		allowedAttributes: [
			"src",
			"alt",
			"width",
			"height",
			"loading"
		]
	},
	button: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [
			"type",
			"disabled",
			"name",
			"value"
		],
		childTags: []
	},
	table: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [
			"border",
			"cellpadding",
			"cellspacing"
		],
		childTags: [
			"caption",
			"colgroup",
			"thead",
			"tbody",
			"tfoot",
			"tr"
		]
	},
	thead: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: ["tr"]
	},
	tbody: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: ["tr"]
	},
	tfoot: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: ["tr"]
	},
	tr: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: ["td", "th"]
	},
	th: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [
			"scope",
			"colspan",
			"rowspan"
		],
		childTags: []
	},
	td: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: ["colspan", "rowspan"],
		childTags: []
	},
	datalist: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: ["option"]
	},
	option: {
		allowsTextContent: !0,
		allowsChildren: !1,
		allowedAttributes: [
			"value",
			"label",
			"selected",
			"disabled"
		]
	},
	header: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: ["role"],
		childTags: []
	},
	a: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [
			"href",
			"target",
			"rel",
			"title",
			"download"
		],
		childTags: []
	},
	i: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: ["aria-hidden"],
		childTags: []
	},
	small: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: [],
		childTags: []
	},
	ul: {
		allowsTextContent: !1,
		allowsChildren: !0,
		allowedAttributes: ["type"],
		childTags: ["li"]
	},
	li: {
		allowsTextContent: !0,
		allowsChildren: !0,
		allowedAttributes: ["value"],
		childTags: []
	},
	hr: {
		allowsTextContent: !1,
		allowsChildren: !1,
		allowedAttributes: []
	}
}, an = {
	$schema: "https://json-schema.org/draft/2020-12/schema",
	title: "TagsCatalogSchema",
	description: "JSON Schema for @keshavsoft/spec-repo tags.json catalog",
	type: "object",
	patternProperties: { "^[a-z0-9]+$": {
		type: "object",
		required: [
			"allowsTextContent",
			"allowsChildren",
			"allowedAttributes"
		],
		properties: {
			allowsTextContent: {
				type: "boolean",
				description: "Indicates whether the element permits direct textContent"
			},
			allowsChildren: {
				type: "boolean",
				description: "Indicates whether the element can contain child DOM elements"
			},
			allowedAttributes: {
				type: "array",
				items: { type: "string" },
				description: "List of specifically allowed HTML attributes for this tag"
			},
			childTags: {
				type: "array",
				items: { type: "string" },
				description: "Permitted child tag names if restricted"
			}
		},
		additionalProperties: !1
	} }
}, on = {
	table: /* @__PURE__ */ JSON.parse("{\"simple\":{\"base\":{\"tagName\":\"div\",\"attributes\":{\"data-role\":\"table-parent\",\"id\":\"table-simple-id\"},\"children\":[{\"tagName\":\"table\",\"attributes\":{\"class\":\"table table-hover table-striped align-middle border mb-0\",\"id\":\"table-simple-table-id\"},\"children\":[{\"tagName\":\"colgroup\",\"attributes\":{\"data-role\":\"table-colgroup\",\"id\":\"table-simple-colgroup-id\"},\"children\":[]},{\"tagName\":\"thead\",\"attributes\":{\"class\":\"table-dark\",\"data-role\":\"table-header\",\"id\":\"table-simple-header-id\"},\"children\":[{\"tagName\":\"tr\",\"attributes\":{\"data-role\":\"table-header-row\",\"id\":\"table-simple-header-row-id\"},\"children\":[]}]},{\"tagName\":\"tbody\",\"attributes\":{\"data-role\":\"table-body\",\"id\":\"table-simple-body-id\"},\"children\":[]},{\"tagName\":\"tfoot\",\"attributes\":{\"data-role\":\"table-footer\",\"id\":\"table-simple-footer-id\"},\"children\":[{\"tagName\":\"tr\",\"attributes\":{\"data-role\":\"table-footer-row\",\"id\":\"table-simple-footer-row-id\"},\"children\":[]}]}]}]},\"single\":[{\"narration\":\"Build column widths\",\"destinationPath\":{\"fileName\":\"base\",\"filePath\":[\"children\"],\"jsonPath\":\"$..*[?@.attributes['data-role'] == 'table-colgroup']\"},\"sourcePath\":{\"fileName\":\"data\",\"jsonPath\":\"$.columns\"},\"templateKey\":\"buildColGroup\",\"func\":\"fromCollection\"},{\"narration\":\"Build table header\",\"destinationPath\":{\"fileName\":\"base\",\"filePath\":[\"children\"],\"jsonPath\":\"$..*[?@.attributes['data-role'] == 'table-header-row']\"},\"sourcePath\":{\"fileName\":\"data\",\"jsonPath\":\"$.columns\"},\"templateKey\":\"buildHeader\",\"func\":\"fromCollection\"}],\"rowOnColumn\":[{\"narration\":\"Build table body\",\"destinationPath\":{\"fileName\":\"base\",\"jsonPath\":\"$.children[0].children[?(@.attributes['data-role'] == 'table-body')]\",\"filePath\":[\"children\"]},\"templateKey\":{\"rowKey\":\"buildBodyTr\",\"columnKey\":\"buildBodyCell\"}}],\"options\":{\"serial\":[{\"narration\":\"Prepend the serial column width to the table colgroup.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-colgroup\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"colGroupForSerial\",\"func\":null},{\"narration\":\"Prepend the serial header cell to the table header row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-header-row\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"headerSerialCell\",\"func\":null},{\"narration\":\"Prepend the serial number cell into each table body row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"],\"action\":\"unshiftSerialToRows\"},\"sourcePath\":null,\"templateKey\":\"buildBodyCell\",\"func\":null},{\"narration\":\"Prepend the serial footer cell to the table footer row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-footer-row\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"headerSerialCell\",\"func\":null}],\"options\":[{\"narration\":\"Append the options column width to the table colgroup.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-colgroup\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"colGroupForOption\",\"func\":null},{\"narration\":\"Append the options header cell to the table header row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-header-row\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"headerForOption\",\"func\":null},{\"narration\":\"Append the options button cell into each table body row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"],\"action\":\"pushToRows\"},\"sourcePath\":null,\"templateKey\":\"optionsButtonCell\",\"func\":null},{\"narration\":\"Append the options footer cell to the table footer row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-footer-row\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"tdWithButtonSaveWarning\",\"func\":null}],\"search\":[{\"narration\":\"Prepend the search row to top of the table.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-parent\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"tableSearch\",\"func\":null}]}},\"withFooter\":{\"base\":{\"tagName\":\"table\",\"attributes\":{\"class\":\"table table-hover table-striped align-middle border mb-0\",\"id\":\"table-with-footer-id\"},\"children\":[{\"tagName\":\"colgroup\",\"attributes\":{\"data-role\":\"table-colgroup\",\"id\":\"table-with-footer-colgroup-id\"},\"children\":[]},{\"tagName\":\"thead\",\"attributes\":{\"class\":\"table-dark\",\"data-role\":\"table-header\",\"id\":\"table-with-footer-header-id\"},\"children\":[{\"tagName\":\"tr\",\"attributes\":{\"data-role\":\"table-header-row\",\"id\":\"table-with-footer-header-row-id\"},\"children\":[]}]},{\"tagName\":\"tbody\",\"attributes\":{\"data-role\":\"table-body\",\"id\":\"table-with-footer-body-id\"},\"children\":[]},{\"tagName\":\"tfoot\",\"attributes\":{\"data-role\":\"table-footer\",\"id\":\"table-with-footer-footer-id\"},\"children\":[{\"tagName\":\"tr\",\"attributes\":{\"data-role\":\"table-footer-row\",\"id\":\"table-with-footer-footer-row-id\"},\"children\":[]}]}]},\"single\":[{\"narration\":\"Build column widths\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-colgroup\",\"filePath\":[\"children\"]},\"sourcePath\":{\"fileName\":\"data\",\"filePath\":[\"columns\"]},\"templateKey\":\"buildColGroup\",\"func\":\"fromCollection\"},{\"narration\":\"Build table header\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-header-row\",\"filePath\":[\"children\"]},\"sourcePath\":{\"fileName\":\"data\",\"filePath\":[\"columns\"]},\"templateKey\":\"buildHeader\",\"func\":\"fromCollection\"},{\"narration\":\"Build footer input cells\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-footer-row\",\"filePath\":[\"children\"]},\"sourcePath\":{\"fileName\":\"data\",\"filePath\":[\"columns\"]},\"templateKey\":\"buildFooter\",\"func\":\"fromCollection\"}],\"double\":[{\"narration\":\"Build table body\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"]},\"sourcePath\":{\"fileName\":\"data\",\"filePath\":[\"columns\"]},\"func\":\"twoDimensional\"}]},\"bodyOnly\":{\"base\":{\"tagName\":\"div\",\"attributes\":{\"id\":\"ks-id\"},\"children\":[]},\"rowOnColumn\":[{\"narration\":\"Build table body\",\"destinationPath\":{\"fileName\":\"base\",\"jsonPath\":\"$\",\"filePath\":[\"children\"]},\"destinationPath1\":{\"fileName\":\"base\",\"jsonPath\":\"$.children[0].children[?(@.attributes['data-role'] == 'table-body')]\",\"filePath\":[\"children\"]},\"templateKey\":{\"rowKey\":\"buildBodyTr\",\"columnKey\":\"buildBodyCell\"}}],\"options\":{\"serial\":[{\"narration\":\"Prepend the serial column width to the table colgroup.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-colgroup\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"colGroupForSerial\",\"func\":null},{\"narration\":\"Prepend the serial header cell to the table header row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-header-row\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"headerSerialCell\",\"func\":null},{\"narration\":\"Prepend the serial number cell into each table body row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"],\"action\":\"unshiftSerialToRows\"},\"sourcePath\":null,\"templateKey\":\"buildBodyCell\",\"func\":null},{\"narration\":\"Prepend the serial footer cell to the table footer row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-footer-row\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"headerSerialCell\",\"func\":null}],\"options\":[{\"narration\":\"Append the options column width to the table colgroup.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-colgroup\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"colGroupForOption\",\"func\":null},{\"narration\":\"Append the options header cell to the table header row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-header-row\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"headerForOption\",\"func\":null},{\"narration\":\"Append the options button cell into each table body row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"],\"action\":\"pushToRows\"},\"sourcePath\":null,\"templateKey\":\"optionsButtonCell\",\"func\":null},{\"narration\":\"Append the options footer cell to the table footer row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-footer-row\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"tdWithButtonSaveWarning\",\"func\":null}],\"search\":[{\"narration\":\"Prepend the search row to top of the table.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-parent\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"tableSearch\",\"func\":null}]}},\"bodyOnly1\":{\"base\":{\"tagName\":\"tbody\",\"attributes\":{\"data-role\":\"table-body\",\"id\":\"table-body-only-id\"},\"children\":[]},\"single\":[],\"double\":[{\"narration\":\"Build table body\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"]},\"sourcePath\":{\"fileName\":\"data\",\"filePath\":[\"columns\"]},\"func\":\"twoDimensional\"}]},\"footerOnly\":{\"base\":{\"tagName\":\"tfoot\",\"attributes\":{\"data-role\":\"table-footer\",\"id\":\"table-footer-only-id\"},\"children\":[{\"tagName\":\"tr\",\"attributes\":{\"data-role\":\"table-footer-row\",\"id\":\"table-footer-only-footer-row-id\"},\"children\":[]}]},\"single\":[{\"narration\":\"Build footer input cells\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-footer-row\",\"filePath\":[\"children\"]},\"sourcePath\":{\"fileName\":\"data\",\"filePath\":[\"columns\"]},\"templateKey\":\"buildFooter\",\"func\":\"fromCollection\"}],\"double\":[]},\"headerOnly\":{\"base\":{\"tagName\":\"div\",\"attributes\":{\"data-role\":\"table-parent\",\"id\":\"table-simple-id\"},\"children\":[{\"tagName\":\"table\",\"attributes\":{\"class\":\"table table-hover table-striped align-middle border mb-0\",\"id\":\"table-simple-table-id\"},\"children\":[{\"tagName\":\"colgroup\",\"attributes\":{\"data-role\":\"table-colgroup\",\"id\":\"table-simple-colgroup-id\"},\"children\":[]},{\"tagName\":\"thead\",\"attributes\":{\"class\":\"table-dark\",\"data-role\":\"table-header\",\"id\":\"table-simple-header-id\"},\"children\":[{\"tagName\":\"tr\",\"attributes\":{\"data-role\":\"table-header-row\",\"id\":\"table-simple-header-row-id\"},\"children\":[]}]},{\"tagName\":\"tbody\",\"attributes\":{\"data-role\":\"table-body\",\"id\":\"table-simple-body-id\"},\"children\":[]},{\"tagName\":\"tfoot\",\"attributes\":{\"data-role\":\"table-footer\",\"id\":\"table-simple-footer-id\"},\"children\":[{\"tagName\":\"tr\",\"attributes\":{\"data-role\":\"table-footer-row\",\"id\":\"table-simple-footer-row-id\"},\"children\":[]}]}]}]},\"single\":[{\"narration\":\"Build column widths\",\"destinationPath\":{\"fileName\":\"base\",\"filePath\":[\"children\"],\"jsonPath\":\"$..*[?@.attributes['data-role'] == 'table-colgroup']\"},\"sourcePath\":{\"fileName\":\"data\",\"jsonPath\":\"$.columns\"},\"templateKey\":\"buildColGroup\",\"func\":\"fromCollection\"},{\"narration\":\"Build table header\",\"destinationPath\":{\"fileName\":\"base\",\"filePath\":[\"children\"],\"jsonPath\":\"$..*[?@.attributes['data-role'] == 'table-header-row']\"},\"sourcePath\":{\"fileName\":\"data\",\"jsonPath\":\"$.columns\"},\"templateKey\":\"buildHeader\",\"func\":\"fromCollection\"}],\"options\":{\"serial\":[{\"narration\":\"Prepend the serial column width to the table colgroup.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-colgroup\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"colGroupForSerial\",\"func\":null},{\"narration\":\"Prepend the serial header cell to the table header row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-header-row\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"headerSerialCell\",\"func\":null},{\"narration\":\"Prepend the serial number cell into each table body row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"],\"action\":\"unshiftSerialToRows\"},\"sourcePath\":null,\"templateKey\":\"buildBodyCell\",\"func\":null},{\"narration\":\"Prepend the serial footer cell to the table footer row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-footer-row\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"headerSerialCell\",\"func\":null}],\"options\":[{\"narration\":\"Append the options column width to the table colgroup.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-colgroup\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"colGroupForOption\",\"func\":null},{\"narration\":\"Append the options header cell to the table header row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-header-row\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"headerForOption\",\"func\":null},{\"narration\":\"Append the options button cell into each table body row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"],\"action\":\"pushToRows\"},\"sourcePath\":null,\"templateKey\":\"optionsButtonCell\",\"func\":null},{\"narration\":\"Append the options footer cell to the table footer row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-footer-row\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"tdWithButtonSaveWarning\",\"func\":null}],\"search\":[{\"narration\":\"Prepend the search row to top of the table.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-parent\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"tableSearch\",\"func\":null}]}},\"headerOnly1\":{\"base\":{\"tagName\":\"table\",\"attributes\":{\"class\":\"table table-hover table-striped align-middle border mb-0\",\"id\":\"table-header-only-id\"},\"children\":[{\"tagName\":\"colgroup\",\"attributes\":{\"data-role\":\"table-colgroup\",\"id\":\"table-header-only-colgroup-id\"},\"children\":[]},{\"tagName\":\"thead\",\"attributes\":{\"class\":\"table-dark\",\"data-role\":\"table-header\",\"id\":\"table-header-only-header-id\"},\"children\":[{\"tagName\":\"tr\",\"attributes\":{\"data-role\":\"table-header-row\",\"id\":\"table-header-only-header-row-id\"},\"children\":[]}]},{\"tagName\":\"tbody\",\"attributes\":{\"data-role\":\"table-body\",\"id\":\"table-header-only-body-id\"},\"children\":[]}]},\"single\":[{\"narration\":\"Build column widths\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-colgroup\",\"filePath\":[\"children\"]},\"sourcePath\":{\"fileName\":\"data\",\"filePath\":[\"columns\"]},\"templateKey\":\"buildColGroup\",\"func\":\"fromCollection\"},{\"narration\":\"Build table header\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-header-row\",\"filePath\":[\"children\"]},\"sourcePath\":{\"fileName\":\"data\",\"filePath\":[\"columns\"]},\"templateKey\":\"buildHeader\",\"func\":\"fromCollection\"}],\"double\":[]},\"options\":{\"serial\":[{\"narration\":\"Prepend the serial column width to the table colgroup.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-colgroup\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"colGroupForSerial\",\"func\":null},{\"narration\":\"Prepend the serial header cell to the table header row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-header-row\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"headerSerialCell\",\"func\":null},{\"narration\":\"Prepend the serial number cell into each table body row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"],\"action\":\"unshiftSerialToRows\"},\"sourcePath\":null,\"templateKey\":\"buildBodyCell\",\"func\":null},{\"narration\":\"Prepend the serial footer cell to the table footer row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-footer-row\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"headerSerialCell\",\"func\":null}],\"options\":[{\"narration\":\"Append the options column width to the table colgroup.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-colgroup\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"colGroupForOption\",\"func\":null},{\"narration\":\"Append the options header cell to the table header row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-header-row\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"headerForOption\",\"func\":null},{\"narration\":\"Append the options button cell into each table body row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"],\"action\":\"pushToRows\"},\"sourcePath\":null,\"templateKey\":\"optionsButtonCell\",\"func\":null},{\"narration\":\"Append the options footer cell to the table footer row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-footer-row\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"tdWithButtonSaveWarning\",\"func\":null}],\"search\":[{\"narration\":\"Prepend the search row to top of the table.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-parent\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"tableSearch\",\"func\":null}]},\"headerAndFooter\":{\"base\":{\"tagName\":\"div\",\"attributes\":{\"data-role\":\"table-parent\",\"id\":\"table-simple-id\"},\"children\":[{\"tagName\":\"table\",\"attributes\":{\"class\":\"table table-hover table-striped align-middle border mb-0\",\"id\":\"table-simple-table-id\"},\"children\":[{\"tagName\":\"colgroup\",\"attributes\":{\"data-role\":\"table-colgroup\",\"id\":\"table-simple-colgroup-id\"},\"children\":[]},{\"tagName\":\"thead\",\"attributes\":{\"class\":\"table-dark\",\"data-role\":\"table-header\",\"id\":\"table-simple-header-id\"},\"children\":[{\"tagName\":\"tr\",\"attributes\":{\"data-role\":\"table-header-row\",\"id\":\"table-simple-header-row-id\"},\"children\":[]}]},{\"tagName\":\"tbody\",\"attributes\":{\"data-role\":\"table-body\",\"id\":\"table-simple-body-id\"},\"children\":[]},{\"tagName\":\"tfoot\",\"attributes\":{\"data-role\":\"table-footer\",\"id\":\"table-simple-footer-id\"},\"children\":[{\"tagName\":\"tr\",\"attributes\":{\"data-role\":\"table-footer-row\",\"id\":\"table-simple-footer-row-id\"},\"children\":[]}]}]}]},\"single\":[{\"narration\":\"Build column widths\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-colgroup\",\"filePath\":[\"children\"]},\"sourcePath\":{\"fileName\":\"data\",\"filePath\":[\"columns\"]},\"templateKey\":\"buildColGroup\",\"func\":\"fromCollection\"},{\"narration\":\"Build table header\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-header-row\",\"filePath\":[\"children\"]},\"sourcePath\":{\"fileName\":\"data\",\"filePath\":[\"columns\"]},\"templateKey\":\"buildHeader\",\"func\":\"fromCollection\"}],\"double\":[{\"narration\":\"Build table body\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"]},\"sourcePath\":{\"fileName\":\"data\",\"filePath\":[\"columns\"]},\"templateKey\":{\"rowKey\":\"buildBodyTr\",\"columnKey\":\"buildBodyCell\"},\"func\":\"twoDimensional\"}],\"rowOnColumn\":[{\"narration\":\"Build table body\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"]},\"templateKey\":{\"rowKey\":\"buildBodyTr\",\"columnKey\":\"buildBodyCell\"}}],\"options\":{\"serial\":[{\"narration\":\"Prepend the serial column width to the table colgroup.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-colgroup\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"colGroupForSerial\",\"func\":null},{\"narration\":\"Prepend the serial header cell to the table header row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-header-row\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"headerSerialCell\",\"func\":null},{\"narration\":\"Prepend the serial number cell into each table body row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"],\"action\":\"unshiftSerialToRows\"},\"sourcePath\":null,\"templateKey\":\"buildBodyCell\",\"func\":null},{\"narration\":\"Prepend the serial footer cell to the table footer row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-footer-row\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"headerSerialCell\",\"func\":null}],\"options\":[{\"narration\":\"Append the options column width to the table colgroup.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-colgroup\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"colGroupForOption\",\"func\":null},{\"narration\":\"Append the options header cell to the table header row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-header-row\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"headerForOption\",\"func\":null},{\"narration\":\"Append the options button cell into each table body row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-body\",\"filePath\":[\"children\"],\"action\":\"pushToRows\"},\"sourcePath\":null,\"templateKey\":\"optionsButtonCell\",\"func\":null},{\"narration\":\"Append the options footer cell to the table footer row.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-footer-row\",\"filePath\":[\"children\"],\"action\":\"push\"},\"sourcePath\":null,\"templateKey\":\"tdWithButtonSaveWarning\",\"func\":null}],\"search\":[{\"narration\":\"Prepend the search row to top of the table.\",\"destinationPath\":{\"fileName\":\"base\",\"dataRole\":\"table-parent\",\"filePath\":[\"children\"],\"action\":\"unshift\"},\"sourcePath\":null,\"templateKey\":\"tableSearch\",\"func\":null}]}}}"),
	select: {
		base: {
			tagName: "div",
			attributes: {
				"data-role": "select-container",
				id: "select-base-id"
			},
			children: []
		},
		single: [{
			narration: "Build select options",
			destinationPath: {
				fileName: "base",
				filePath: ["children"]
			},
			sourcePath: {
				fileName: "data",
				filePath: ["data"]
			},
			templateKey: "buildOption",
			func: "fromCollection"
		}],
		double: [],
		columnOnRow: [{
			narration: "Build selects with options",
			destinationPath: {
				fileName: "base",
				filePath: ["children"]
			},
			templateKey: {
				columnKey: "buildSelect",
				rowKey: "buildOption"
			}
		}]
	},
	dataList: {
		simple: {
			base: {
				tagName: "div",
				attributes: {
					"data-role": "datalist-container",
					id: "data-list-simple-id"
				},
				children: []
			},
			single: [],
			double: [],
			columnOnRow: [{
				narration: "Build datalists with options",
				destinationPath: {
					fileName: "base",
					filePath: ["children"]
				},
				templateKey: {
					columnKey: "buildDataList",
					rowKey: "buildOption"
				}
			}]
		},
		base: {
			tagName: "div",
			attributes: {
				"data-role": "datalist-container",
				id: "data-list-base-id"
			},
			children: []
		},
		single: [],
		double: [],
		columnOnRow: [{
			narration: "Build datalists with options",
			destinationPath: {
				fileName: "base",
				filePath: ["children"]
			},
			templateKey: {
				columnKey: "buildDataList",
				rowKey: "buildOption"
			}
		}]
	},
	selectOptionsOnly: {
		base: [],
		single: [{
			narration: "Build options array",
			destinationPath: {
				fileName: "base",
				filePath: []
			},
			sourcePath: {
				fileName: "data",
				filePath: ["data"]
			},
			templateKey: "buildOption",
			func: "fromCollection"
		}],
		double: []
	},
	searchInput: {
		base: {
			tagName: "div",
			attributes: {
				class: "d-flex align-items-center gap-2",
				id: "search-input-base-id"
			},
			children: [{
				tagName: "label",
				textContent: "${label}",
				attributes: {
					class: "form-label mb-0 text-nowrap fw-semibold",
					for: "${id}",
					id: "search-input-label-id"
				}
			}, {
				tagName: "input",
				attributes: {
					type: "search",
					placeholder: "${placeholder}",
					class: "form-control",
					id: "search-input-field-id"
				}
			}]
		},
		single: [],
		double: []
	},
	form: {
		simple: {
			base: {
				tagName: "div",
				attributes: {
					class: "card shadow-sm border-0",
					id: "form-simple-id"
				},
				children: [
					{
						tagName: "div",
						attributes: {
							class: "card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center",
							id: "form-simple-header-id"
						},
						children: [{
							tagName: "h2",
							textContent: "Data Entry Form",
							attributes: {
								class: "h5 fw-bold mb-0 text-dark",
								id: "form-simple-title-id"
							}
						}]
					},
					{
						tagName: "div",
						attributes: {
							class: "card-body p-4",
							id: "form-simple-body-id"
						},
						children: [{
							tagName: "form",
							attributes: {
								id: "form-simple-form-id",
								"data-role": "form-body"
							},
							children: []
						}]
					},
					{
						tagName: "div",
						attributes: {
							class: "card-footer bg-light px-4 py-3 d-flex justify-content-end gap-2",
							id: "form-simple-footer-id"
						},
						children: [{
							tagName: "button",
							textContent: "Reset",
							attributes: {
								type: "reset",
								class: "btn btn-outline-secondary",
								id: "form-simple-reset-button-id"
							}
						}, {
							tagName: "button",
							textContent: "Submit",
							attributes: {
								type: "submit",
								class: "btn btn-primary",
								id: "form-simple-submit-button-id"
							}
						}]
					}
				]
			},
			single: [{
				narration: "Build form fields from columns",
				destinationPath: {
					fileName: "base",
					dataRole: "form-body",
					filePath: ["children"]
				},
				sourcePath: {
					fileName: "data",
					filePath: ["columns"]
				},
				templateKey: "buildFormField",
				func: "fromCollection"
			}],
			double: []
		},
		base: {
			tagName: "div",
			attributes: {
				class: "card shadow-sm border-0",
				id: "form-base-id"
			},
			children: [
				{
					tagName: "div",
					attributes: {
						class: "card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center",
						id: "form-base-header-id"
					},
					children: [{
						tagName: "h2",
						textContent: "Data Entry Form",
						attributes: {
							class: "h5 fw-bold mb-0 text-dark",
							id: "form-base-title-id"
						}
					}]
				},
				{
					tagName: "div",
					attributes: {
						class: "card-body p-4",
						id: "form-base-body-id"
					},
					children: [{
						tagName: "form",
						attributes: {
							id: "form-base-form-id",
							"data-role": "form-body"
						},
						children: []
					}]
				},
				{
					tagName: "div",
					attributes: {
						class: "card-footer bg-light px-4 py-3 d-flex justify-content-end gap-2",
						id: "form-base-footer-id"
					},
					children: [{
						tagName: "button",
						textContent: "Reset",
						attributes: {
							type: "reset",
							class: "btn btn-outline-secondary",
							id: "form-base-reset-button-id"
						}
					}, {
						tagName: "button",
						textContent: "Submit",
						attributes: {
							type: "submit",
							class: "btn btn-primary",
							id: "form-base-submit-button-id"
						}
					}]
				}
			]
		},
		single: [{
			narration: "Build form fields from columns",
			destinationPath: {
				fileName: "base",
				dataRole: "form-body",
				filePath: ["children"]
			},
			sourcePath: {
				fileName: "data",
				filePath: ["columns"]
			},
			templateKey: "buildFormField",
			func: "fromCollection"
		}],
		double: []
	}
}, sn = {
	name: "spec-repo",
	version: "1.6.1"
}, cn = ({ spec: e, tags: t, tagsSchema: n, definitions: r }) => {
	typeof globalThis < "u" && e && t && n && r && (globalThis.ks ??= {}, globalThis.ks.specs ??= {}, globalThis.ks.specs.jsonFiles = {
		meta: sn,
		spec: e,
		tags: t,
		tagsSchema: n,
		definitions: r
	});
}, R = nn;
cn({
	spec: nn,
	tags: rn,
	tagsSchema: an,
	definitions: on
});
// node_modules/json-instruction-single/src/v8/getResult.js
var ln = {
	applyTemplate: I,
	fromCollection: L
}, un = (e, t, n) => {
	let r = e?.sourcePath;
	if (r === null) return null;
	if (r?.jsonPath) {
		let e = t?.[r.fileName];
		if (e === void 0) throw Error(`Registry entry not found: ${r.fileName}`);
		let i = It(e, r.jsonPath, { returnArray: !0 });
		if (i.length !== 1) throw Error(`Source JSONPath must identify exactly one value; matched ${i.length}: ${r.jsonPath}`);
		return n && console.log("json-instruction-single v8 source:", r, i[0]), i[0];
	}
	return tn(t, r);
}, dn = (e, t, n) => {
	let r = (t?.spec ?? R)[e.templateKey], i = un(e, t, n), a = e?.func === null ? r : ln[e.func](i, r);
	return i === null ? r : a;
}, fn = (e, t, n) => {
	n && console.log("runSingleInstruction v8:", e);
	let r = dn(e, t, n);
	return n && console.log("runSingleInstruction v8 result:", r), $t(t, e.destinationPath, r, n), r;
}, pn = (e, t, n, r) => (e.forEach((e) => fn(e, t, n, r)), t), mn = {
	applyTemplate: I,
	fromCollection: L,
	twoDimensional: Xt
}, hn = ({ instruction: e, registry: t, showLog: n, returnLog: r }) => {
	let i = R, a = mn[e.func]({
		columns: t?.data?.columns,
		data: t?.data?.data,
		columnSpec: i[e?.templateKey?.columnKey],
		rowSpec: i[e?.templateKey?.rowKey]
	});
	$t(t, e.destinationPath, a);
}, gn = ({ instructions: e, registry: t, showLog: n, returnLog: r }) => {
	e.forEach((e) => {
		hn({
			instruction: e,
			registry: t,
			showLog: n,
			returnLog: r
		});
	});
}, _n = (e, t) => e.map((e) => ({
	...e,
	rowData: t[e.columnName]
})), vn = (e, t) => {
	if (!Array.isArray(e)) throw TypeError("inColumns must be an Array");
	if (e.length === 0) throw Error("inColumns cannot be empty");
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		if (!n || typeof n != "object") throw TypeError(`inColumns[${t}] must be an object`);
		if (typeof n.columnName != "string" || !n.columnName.trim()) throw TypeError(`inColumns[${t}].columnName must be a non-empty string`);
	}
	if (!Array.isArray(t)) throw TypeError("inData must be an Array");
	for (let e = 0; e < t.length; e++) {
		let n = t[e];
		if (!n || typeof n != "object") throw TypeError(`inData[${e}] must be an object`);
	}
	return !0;
}, yn = ({ columns: e, data: t, columnSpec: n, rowSpec: r }) => (vn(e, t), t.map((t) => {
	let i = I(t, r);
	return i.children = L(_n(e, t), n), i;
})), bn = (e, t) => t.map((t) => ({
	...e,
	rowData: t[e.columnName]
})), xn = (e, t) => {
	if (!Array.isArray(e)) throw TypeError("inColumns must be an Array");
	if (e.length === 0) throw Error("inColumns cannot be empty");
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		if (!n || typeof n != "object") throw TypeError(`inColumns[${t}] must be an object`);
		if (typeof n.columnName != "string" || !n.columnName.trim()) throw TypeError(`inColumns[${t}].columnName must be a non-empty string`);
	}
	if (!Array.isArray(t)) throw TypeError("inData must be an Array");
	for (let e = 0; e < t.length; e++) {
		let n = t[e];
		if (!n || typeof n != "object") throw TypeError(`inData[${e}] must be an object`);
	}
	return !0;
}, Sn = ({ columns: e, data: t, columnSpec: n, rowSpec: r }) => (xn(e, t), e.map((e) => {
	let i = I(e, n);
	return i.children = t.length > 0 ? L(bn(e, t), r) : [], i;
})), Cn = ({ instructions: e = [], base: t, data: n, showLog: r = !1 } = {}) => {
	e.forEach((e) => {
		let i = R[e?.templateKey?.columnKey], a = R[e?.templateKey?.rowKey], o = yn({
			columns: n?.columns,
			data: n?.data,
			columnSpec: i,
			rowSpec: a
		});
		r && console.log("[runInstructions:rowOnColumn]", e.narration, o), $t({
			base: t,
			data: n
		}, e.destinationPath, o);
	});
}, wn = ({ instructions: e = [], base: t, data: n, showLog: r = !1 } = {}) => {
	e.forEach((e) => {
		let i = R[e?.templateKey?.columnKey], a = R[e?.templateKey?.rowKey], o = Sn({
			columns: n?.columns,
			data: n?.data,
			columnSpec: i,
			rowSpec: a
		});
		r && console.log("[runInstructions:columnOnRow]", e.narration, o), $t({
			base: t,
			data: n
		}, e.destinationPath, o);
	});
}, Tn = ({ single: e = [], double: t = [], rowOnColumn: n = [], columnOnRow: r = [], base: i, data: a, showLog: o = !1 } = {}) => {
	if (o && console.log("runInstructions input:", {
		single: e,
		double: t,
		rowOnColumn: n,
		columnOnRow: r,
		base: i,
		data: a
	}), !Array.isArray(e)) throw TypeError("single instructions must be an array");
	if (!Array.isArray(t)) throw TypeError("double instructions must be an array");
	if (!Array.isArray(n)) throw TypeError("rowOnColumn instructions must be an array");
	if (!Array.isArray(r)) throw TypeError("columnOnRow instructions must be an array");
	let s = {
		base: i,
		data: a
	};
	return e.length > 0 && pn(e, s, o), t.length > 0 && gn({
		instructions: t,
		registry: s,
		showLog: o
	}), n.length > 0 && Cn({
		instructions: n,
		base: i,
		data: a,
		showLog: o
	}), r.length > 0 && wn({
		instructions: r,
		base: i,
		data: a,
		showLog: o
	}), s;
}, En = (e, t) => !e || typeof e != "object" ? !1 : e.attributes?.["data-role"] === t || Array.isArray(e.children) && e.children.some((e) => En(e, t)), Dn = (e = [], t) => e.filter(({ destinationPath: e }) => En(t, e?.dataRole)), On = ({ base: e, options: t = {}, optionDefs: n = {}, showLog: r = !1 } = {}) => {
	if (!e) return e;
	let i = { base: e };
	if (t.showSearch && n.search) {
		let t = Dn(n.search, e);
		r && console.log("[runOptions:search]", t), pn(t, i, r);
	}
	if ((t.showSerial || t.serial) && n.serial) {
		let t = Dn(n.serial, e);
		r && console.log("[runOptions:serial]", t), pn(t, i, r);
	}
	if ((t.showOptions || t.options) && n.options) {
		let t = Dn(n.options, e);
		r && console.log("[runOptions:options]", t), pn(t, i, r);
	}
	return e;
}, kn = ({ definitions: e = on, type: t = "table.simple", data: n = [], columns: r = [], options: i = {}, showLog: a = !1 } = {}) => {
	let o = t.split("."), s = o[0], c = o[1], l = e[s], u = c && l?.[c] ? l[c] : l;
	if (!u) throw Error(`Unknown component definition for type "${t}".`);
	let d = Tn({
		single: u.single || [],
		double: u.double || [],
		rowOnColumn: u.rowOnColumn || [],
		columnOnRow: u.columnOnRow || [],
		base: structuredClone(u.base),
		data: {
			columns: r,
			data: n
		},
		showLog: a
	});
	return On({
		base: d,
		options: i,
		optionDefs: u.options || e[s]?.options || {},
		showLog: a
	}), d;
}, An = ({ definitions: e = on, renderers: t = [], data: n = [], columns: r = [], showLog: i = !1 } = {}) => {
	if (!Array.isArray(t) || t.length === 0) throw Error("renderers must be a non-empty array of renderer configurations.");
	return t.map((t) => {
		let a = typeof t == "string" ? { type: t } : t;
		return kn({
			definitions: e,
			type: a.type,
			data: a.data || n,
			columns: a.columns || r,
			options: a.options || {},
			showLog: i
		})?.base;
	});
}, jn = {
	version: "42.1.4",
	name: "json-to-dom"
}, Mn = (e) => {
	e && (globalThis.ks ??= {}, globalThis.ks.jsonToDom = {
		meta: jn,
		appendToDom: e
	});
}, Nn = {
	version: "v12",
	description: "JSON-to-DOM engine powered by decoupled external-action traversal engine"
}, Pn = (e) => {
	if (typeof globalThis > "u" || !e) return;
	globalThis.ks ??= {};
	let t = typeof e == "function" ? e : e.buildSpecElement, n = e.buildSpecElementWithValidate, r = {
		meta: Nn,
		buildSpecElement: t,
		...n ? { buildSpecElementWithValidate: n } : {}
	};
	globalThis.ks["json-to-tag"] = r, globalThis.ks.jsonToTag = r;
}, Fn = ({ inItems: e, inFunc: t }) => {
	let n = e, r = t;
	return Array.isArray(n) ? n.map((e) => Ln({
		inSpec: e,
		inFunc: r
	})).flat(Infinity).filter(Boolean) : [];
}, In = ({ inSpec: e, inFunc: t }) => {
	let n = e, r = t;
	if (!n || typeof n != "object" || Array.isArray(n)) return null;
	let i = typeof r == "function" ? r(n) : null;
	if (Array.isArray(n.children)) {
		let e = Fn({
			inItems: n.children,
			inFunc: r
		});
		if (i && typeof i.append == "function" && Array.isArray(e)) {
			let t = e.filter(Boolean);
			t.length && i.append(...t);
		}
	}
	return i;
}, Ln = ({ inSpec: e, inFunc: t }) => {
	let n = e, r = t;
	return n == null ? null : typeof Node < "u" && n instanceof Node ? n : Array.isArray(n) ? Fn({
		inItems: n,
		inFunc: r
	}) : typeof n == "object" ? In({
		inSpec: n,
		inFunc: r
	}) : typeof n == "string" || typeof n == "number" ? typeof document < "u" ? document.createTextNode(String(n)) : String(n) : null;
}, Rn = ({ inNode: e, inErrors: t }) => {
	let n = e, r = t;
	return !n || typeof n != "object" || Array.isArray(n) ? (r.push({ reason: "Node must be a plain object" }), !1) : !0;
}, zn = ({ inNode: e, inCatalog: t, inErrors: n }) => {
	let r = e, i = t, a = n, o = r.tagName;
	return !o || typeof o != "string" || o.trim() === "" ? (a.push({ reason: "Missing or empty 'tagName'" }), !1) : i && typeof i == "object" && !(i[o] || Object.keys(i).includes(o)) ? (a.push({
		tagName: o,
		reason: `Unrecognized tagName '${o}' not found in spec catalog`
	}), !1) : !0;
}, Bn = ({ inNode: e, inCatalog: t, inErrors: n }) => {
	let r = e, i = t, a = n, o = r.tagName, s = i ? i[o] : null;
	return s && s.allowsTextContent === !1 && r.textContent ? (a.push({
		tagName: o,
		reason: `Tag '${o}' does not allow direct textContent`
	}), !1) : !0;
}, Vn = ({ inNode: e, inCatalog: t, inErrors: n }) => {
	let r = e, i = t, a = n, o = r.tagName, s = i ? i[o] : null;
	return s && s.allowsChildren === !1 && Array.isArray(r.children) && r.children.length > 0 ? (a.push({
		tagName: o,
		reason: `Tag '${o}' does not allow children (void element)`
	}), !1) : "children" in r && !Array.isArray(r.children) ? (a.push({
		tagName: o,
		reason: "'children' must be an array"
	}), !1) : !0;
}, Hn = ({ inNode: e, inCatalog: t, inErrors: n }) => {
	let r = e, i = t, a = n, o = r.tagName, s = i ? i[o] : null;
	return s && Array.isArray(s.childTags) && s.childTags.length > 0 && Array.isArray(r.children) && r.children.forEach((e) => {
		e && e.tagName && !s.childTags.includes(e.tagName) && a.push({
			tagName: e.tagName,
			reason: `Tag '${e.tagName}' is not an allowed child of '${o}' (allowed: ${s.childTags.join(", ")})`
		});
	}), !0;
}, Un = ({ inNode: e, inErrors: t }) => {
	let n = e, r = t, i = n.tagName;
	return "attributes" in n && (!n.attributes || typeof n.attributes != "object" || Array.isArray(n.attributes)) ? (r.push({
		tagName: i,
		reason: "'attributes' must be a key-value object"
	}), !1) : !0;
}, Wn = ({ inNode: e, inCatalog: t, inErrors: n }) => {
	let r = e, i = t, a = n;
	Rn({
		inNode: r,
		inErrors: a
	}) && (zn({
		inNode: r,
		inCatalog: i,
		inErrors: a
	}), Bn({
		inNode: r,
		inCatalog: i,
		inErrors: a
	}), Vn({
		inNode: r,
		inCatalog: i,
		inErrors: a
	}), Hn({
		inNode: r,
		inCatalog: i,
		inErrors: a
	}), Un({
		inNode: r,
		inErrors: a
	}));
};
// node_modules/json-to-tag-validate/src/v4/index.js
function Gn({ inJson: e, inCatalog: t, inSpec: n }) {
	let r = e, i = t ?? n ?? rn, a = [];
	return Ln({
		inSpec: r,
		inFunc: (e) => {
			Wn({
				inNode: e,
				inCatalog: i,
				inErrors: a
			});
		}
	}), {
		isValid: a.length === 0,
		errors: a
	};
}
// node_modules/@keshavsoft/json-to-tag/src/v12/element/createElement.js
var Kn = "http://www.w3.org/2000/svg", qn = /* @__PURE__ */ new Set(/* @__PURE__ */ "svg.path.symbol.use.g.circle.ellipse.rect.line.polyline.polygon.text.tspan.defs.clippath.mask.pattern.marker.lineargradient.radialgradient.stop.image.filter.fegaussianblur.femerge.femergenode".split(".")), Jn = ({ inTagName: e }) => {
	let t = e?.toLowerCase();
	if (!t) return null;
	if (t === "checkbox") {
		let e = document.createElement("input");
		return e.type = "checkbox", e;
	}
	return qn.has(t) ? document.createElementNS(Kn, t) : document.createElement(t);
}, Yn = ({ inElement: e, inTextContent: t }) => (!e || t == null || (e.textContent = t), e), Xn = ({ inElement: e, inProperties: t }) => (e && t && typeof t == "object" && Object.assign(e, t), e), Zn = "http://www.w3.org/1999/xlink", Qn = ({ inElement: e, inAttributes: t }) => {
	let n = e, r = t;
	if (!n || !r || typeof r != "object") return n;
	let i = typeof SVGElement < "u" ? n instanceof SVGElement : n.namespaceURI === "http://www.w3.org/2000/svg";
	return Object.entries(r).forEach(([e, t]) => {
		if (e === "class") i ? n.setAttribute("class", String(t)) : n.className = t;
		else if (e === "xlink:href" || e === "href") {
			if (t != null) {
				let e = String(t);
				if (i) try {
					n.setAttributeNS(Zn, "href", e);
				} catch {}
				n.setAttribute("href", e), n.setAttribute("xlink:href", e);
			}
		} else typeof t == "boolean" ? t ? n.setAttribute(e, "") : n.removeAttribute(e) : t != null && n.setAttribute(e, String(t));
	}), n;
}, $n = ({ inElement: e, inClassList: t }) => {
	if (!e || !t) return e;
	let n = typeof t == "string" ? t.split(/\s+/).filter(Boolean) : Array.isArray(t) ? t.filter((e) => typeof e == "string" && e.trim()) : [];
	return n.length && e.classList.add(...n), e;
}, er = (e) => {
	if (!e || typeof e != "object" || Array.isArray(e) || !e.tagName) return null;
	let t = Jn({ inTagName: e.tagName });
	return t ? (Yn({
		inElement: t,
		inTextContent: e.textContent,
		inTagName: e.tagName
	}), Xn({
		inElement: t,
		inProperties: e.properties
	}), Qn({
		inElement: t,
		inAttributes: e.attributes
	}), $n({
		inElement: t,
		inClassList: e.classList
	}), t) : null;
}, tr = (e = {}) => Ln({
	inSpec: e?.spec ?? e?.inSpec ?? e,
	inFunc: er
});
Pn({
	buildSpecElement: tr,
	buildSpecElementWithValidate: (e = {}) => {
		let t = e?.spec ?? e?.inSpec ?? e, n = Gn({ inJson: t });
		return n.isValid || console.warn("[json-to-tag] Specification validation issues:", n.errors), Ln({
			inSpec: t,
			inFunc: er
		});
	}
});
// node_modules/spec-to-dom/src/v2/register/meta.js
var nr = {
	version: "2.1.1",
	name: "spec-to-dom"
}, rr = (e) => {
	e && (globalThis.ks ??= {}, globalThis.ks.specToDom = {
		meta: nr,
		appendToDom: e
	});
}, ir = ({ buildSpec: e, targetHtmlId: t, appendPosition: n, showLog: r }) => {
	let i = e, a = t, o = n, s = r;
	s && console.log("renderToDom 1 (content):", i);
	let c = document.getElementById(a);
	return c ? (Array.isArray(i) || i instanceof NodeList || i instanceof HTMLCollection ? o === "prepend" ? c.prepend(...i) : c.append(...i) : o === "prepend" ? c.prepend(i) : (c.innerHTML = "", c.append(i)), s && console.log("renderToDom 2 (mounted):", c), c) : null;
};
rr(ir);
// node_modules/@keshavsoft/json-to-dom/src/v42/index.js
var ar = ({ jsonSpec: e, targetHtmlId: t, appendPosition: n, showLog: r }) => ir({
	buildSpec: tr(e),
	targetHtmlId: t,
	appendPosition: n,
	showLog: r
});
Mn(ar);
// node_modules/json-renderers-guard/src/v5/spec/type/index.js
var or = (e) => {
	let t = e?.inConfig ?? e;
	if (!t || typeof t != "object") throw TypeError("Config must be an object");
	let n = t.type;
	if (n === void 0) throw Error("Missing compulsory key: \"type\"");
	if (typeof n != "string") throw TypeError("type must be a string");
	return !0;
}, sr = (e) => {
	let t = e?.inConfig ?? e;
	if (!t || typeof t != "object") throw TypeError("Config must be an object");
	let n = t.data;
	if (n === void 0) throw Error("Missing compulsory key: \"data\"");
	if (!Array.isArray(n)) throw TypeError("data must be an Array");
	return !0;
}, cr = (e) => {
	let t = e?.inConfig ?? e;
	if (!t || typeof t != "object") throw TypeError("Config must be an object");
	let n = t.columns;
	if (n === void 0) throw Error("Missing compulsory key: \"columns\"");
	if (!Array.isArray(n)) throw TypeError("columns must be an Array");
	return !0;
}, lr = (e) => {
	let t = e?.inConfig ?? e;
	if (!t || typeof t != "object") throw TypeError("Config must be an object");
	let n = t.showLog;
	if (n !== void 0 && typeof n != "boolean") throw TypeError("showLog must be a boolean");
	return !0;
}, ur = (e) => {
	let t = e?.inConfig ?? e;
	if (!t || typeof t != "object" || Array.isArray(t)) throw TypeError("Config must be an object");
	return or(t), sr(t), cr(t), lr(t), !0;
}, dr = (e) => {
	let t = e?.inConfig ?? e;
	if (!t || typeof t != "object") throw TypeError("Config must be an object");
	let n = t.targetHtmlId;
	if (n === void 0) throw Error("Missing compulsory key: \"targetHtmlId\"");
	if (typeof n != "string") throw TypeError("targetHtmlId must be a string");
	if (n.trim().length === 0) throw Error("targetHtmlId must be a non-empty string");
	return !0;
}, fr = (e) => {
	let t = e?.inConfig ?? e;
	if (!t || typeof t != "object") throw TypeError("Config must be an object");
	let n = t.appendPosition;
	if (n === void 0) throw Error("Missing compulsory key: \"appendPosition\"");
	if (typeof n != "string") throw TypeError("appendPosition must be a string");
	return !0;
}, pr = (e) => {
	let t = e?.inConfig ?? e;
	if (!t || typeof t != "object") throw TypeError("Config must be an object");
	let n = t.classToApply;
	if (n === void 0) throw Error("Missing compulsory key: \"classToApply\"");
	if (typeof n != "string") throw TypeError("classToApply must be a string");
	return !0;
}, mr = (e) => {
	let t = e?.inConfig ?? e;
	if (!t || typeof t != "object" || Array.isArray(t)) throw TypeError("Config must be an object");
	return dr(t), fr(t), pr(t), !0;
}, z = {
	type: "table",
	targetHtmlId: "",
	data: [],
	columns: [],
	classToApply: "",
	appendPosition: "replace",
	showLog: !1
}, hr = (e) => {
	let t = typeof e == "object" && e ? e.inKey ?? e.key : e;
	return t && t in z ? z[t] : { ...z };
};
Object.assign(hr, z);
// node_modules/json-renderers-guard/src/v5/index.js
var B = (e) => {
	let t = e?.inConfig ?? e;
	if (!t || typeof t != "object" || Array.isArray(t)) throw TypeError("Config must be an object");
	return ur(t), mr(t), !0;
};
B.getSpec = hr, B.configSpec = z, B.guardSpec = ur, B.guardMount = mr;
// src/v2/registerGlobal/meta.js
var gr = {
	name: "json-renderers-from-instructions-collection",
	version: "1.2.1",
	description: "Composite multi-renderer orchestrator driven by declarative instructions and collections"
}, _r = (e) => {
	let t = e;
	typeof globalThis < "u" && t && (globalThis.ks ??= {}, globalThis.ks.jsonRenderers ??= {}, globalThis.ks.jsonRenderers.fromInstructionsCollection = {
		meta: gr,
		render: t
	});
}, vr = (e = {}) => {
	let t = e?.showLog;
	B({
		...e,
		type: e.type || "collection"
	}), t && console.log("[from-instructions-collection] input config:", {
		renderers: e.renderers,
		columns: e.columns,
		data: e.data,
		targetHtmlId: e.targetHtmlId
	});
	let n = An({
		renderers: e.renderers || [],
		data: e.data || [],
		columns: e.columns || [],
		layout: e.layout || "vertical",
		showLog: t
	});
	t && console.log("[from-instructions-collection] generated composite spec:", n);
	let r = ar({
		jsonSpec: n,
		targetHtmlId: e.targetHtmlId,
		appendPosition: e.appendPosition || "replace",
		classToApply: e.classToApply || "",
		showLog: t
	});
	return t && console.log("[from-instructions-collection] mounted DOM element:", r), r;
};
_r(vr);
export { kn as buildSingleSpec, An as buildSpec, vr as default, vr as render };
