// ==UserScript==
// @name         Mathex
// @version      2.0.2
// @description  ...
// @author       JuraSciix
// @match        *://*.vk.com/*
// @grant        none
// @homepage     https://github.com/JuraSciix/mathex
// @updateURL    https://raw.githubusercontent.com/JuraSciix/mathex/master/mathex.meta.js
// @downloadURL  https://raw.githubusercontent.com/JuraSciix/mathex/master/mathex.user.js
// ==/UserScript==

class DataSets {
	static SUBSCRIPT = {
		'0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
		'5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
		'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
		'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
		'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
		'v': 'ᵥ', 'x': 'ₓ',
		'(': '₍', ')': '₎', '+': '₊', '-': '₋',
		'=': '₌'
	};

	static SUPERSCRIPT = {
		'0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
		'5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
		'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ',
		'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ',
		'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ',
		'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ',
		'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
		'A': 'ᴬ', 'B': 'ᴮ', 'D': 'ᴰ', 'E': 'ᴱ', 'G': 'ᴳ',
		'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ',
		'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'R': 'ᴿ',
		'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ',
		'(': '⁽', ')': '⁾', '+': '⁺', '-': '⁻', '=': '⁼'
	};

	static TAGS = {
		alpha: 'α',
		beta: 'β',
		gamma: 'γ',
		delta: 'δ',
		Delta: 'Δ',
		epsilon: 'ε',
		eps: 'ε',
		theta: 'θ',
		Theta: 'Θ',
		lambda: 'λ',
		nu: 'ν',
		pi: 'π',
		sigma: 'σ',
		Sigma: 'Σ',
		tau: 'τ',
		phi: 'φ',
		psi: 'ψ',
		Psi: 'Ψ',
		omega: 'ω',
		Omega: 'Ω',

		neq: '  ≠',
		modeq: '≡',
		pm: '±',
		sqrt: '√',
		int: '∫',
		to: '→',
		eq: '⇔',
		wedge: '∧',
		and: '∧',
		vee: '∨',
		or: '∨',
		neg: '¬',
		forall: '∀',
		exists: '∃',
		empty: '∅',
		varnothing: '∅',
		in: '∈',
		notin: '∉',
		subset: '⊂',
		upset: '⊃',
		cup: '⋃',
		cap: '⋂',
		mapsto: '↦',
		N: 'ℕ',
		Z: 'ℤ',
		Q: 'ℚ',
		R: 'ℝ',
		C: 'ℂ',
		le: '≤',
		ge: '≥',
		approx: '≈',
		cbrt: '∛',
		qdrt: '∜',
		der: '∂',

		times: '×',
		dot: '∙',
		comp: '∘',
		circ: '∘',

		sum: 'Σ',
		prod: '∏',
		inf: '∞',

		tao: '𝜏',
		up: '↑'
	};
}

class StringReader {
    constructor(buffer) {
        this.buffer = buffer;
		this.p = 0;
        this.i = 0;
		this.boundary = buffer.length;
    }

	get index() { return this.i; }

    get still() { return this.i < this.boundary; }

	get char() { return this.buffer.charAt(this.i); }

	get codePoint() { return this.buffer.codePointAt(this.i); }

	get interval() {
		return this.buffer.substring(this.p, this.i);
	}

	point(p = null) {
		this.p = p ?? this.i;
	}

	return() {
		this.i = this.p;
	}

	seen(str) {
        return this.buffer.startsWith(str, this.i);
    }

    next(e = 1) {
        this.i += e;
    }

	reset() {
		this.i = 0;
		this.p = 0;
	}
}

class Group {
	get mapped() {
		throw new Error("Group.mapped must be overrided");
	}

	get struct() {
		throw new Error("Group.struct must be overrided");
	}
}

class EmptyGroup extends Group {
	static INSTANCE = new EmptyGroup()

	get mapped() {
		return "";
	}

	get struct() {
		return "empty";
	}
}

class LiteralGroup extends Group {
	constructor(content) {
		super();
		this.content = content;
	}

	get mapped() {
		return this.content;
	}

	get struct() {
		return `literal "${this.content}"`;
	}
}

class WrapperGroup extends Group {
	constructor(subgroup, left, right) {
		super();
		this.subgroup = subgroup;
		this.left = left;
		this.right = right;
	}

	get mapped() {
		// Я предполагаю, что все значения СТРОКОВЫЕ.
		return this.left + this.subgroup.mapped + this.right;
	}

	get struct() {
		return `wrapper${this.left} ${this.subgroup.struct} ${this.right}`;
	}
}

class ListGroup extends Group {
	constructor(groups) {
		super();
		this.groups = groups;
	}

	get mapped() {
		let joined = "";
		for (let group of this.groups) {
			joined += group.mapped;
		}
		return joined;
	}

	get struct() {
		return `list[${this.groups.map(g => g.struct).join(', ')}]`;
	}
}

class IntegralGroup extends Group {
	constructor(id, subgroup) {
		super();
		this.id = id;
		this.subgroup = subgroup;
	}

	// Need to override mapped() and struct()
}

class MapGroup extends IntegralGroup {
	constructor(id, subgroup, map) {
		super(id, subgroup);
		this.map = map;
	}

	get mapped() {
		let input = this.subgroup.mapped;
		let mapped = "";
		let success = true;
		for (let ch of input) {
			let mch = this.map[ch];
			if (mch === undefined) {
				success = false;
				break;
			}
			mapped += mch;
		}
		// Если хотя бы один символ не удалось отобразить, то возвращаем исходное значение
		return success ? mapped : `${this.id}${input}`;
	}

	get struct() {
		return `map(${this.id} : ${this.subgroup.struct})`;
	}
}

class TagGroup extends IntegralGroup {
	constructor(id, subgroup, map) {
		super(id, subgroup);
		this.map = map;
	}

	get mapped() {
		let input = this.subgroup.mapped;
		let mapped = this.map[input];
		return mapped !== undefined ? mapped : `${this.id}${input}`;
	}

	get struct() {
		return `tag(${this.id} : ${this.subgroup.struct})`;
	}
}

class Parser {
	constructor(buffer) {
		this.buffer = new StringReader(buffer);

		// Мы внутри \[*\] ?
		this.inScript = false;
		// Последняя не закрытая скобка (если есть)
		this.unwrapper = null;
		// Мы сканируем степень?
		this.inPow = false;
	}

	get tree() {
		let groups = [];

		while (this.buffer.still) {
			groups.push(this.term1());
		}

		// Сбрасываем каретку буфера для повторного парсинга
		this.buffer.reset();

		let tree = list(groups);
		if (tree === EmptyGroup.INSTANCE) {
			// Если пусто, то возвращаем исходную строку.
			return new LiteralGroup(this.buffer.buffer);
		}

		return tree;
	}

	term1() {
		if (this.inScript) {
			return this.script();
		}

		if (this.buffer.seen('\\[')) {
			let i = this.buffer.index;
			this.buffer.next(2);
			this.inScript = true;

			let groups = [];
			while (this.buffer.still && !this.buffer.seen('\\]')) {
				groups.push(this.script());
			}

			if (!this.buffer.still) {
				// Мы дошли до конца и не нашли \].
				// Возвращаем исходную подстроку.
				this.buffer.point(i);
				return new LiteralGroup(this.buffer.interval);
			}
			// Мы не дошли до конца, а значит встретили \[. Пропускаем
			this.buffer.next(2);

			this.inScript = false;
			return list(groups);
		}

		return this.term3();
	}

	script() {
		switch (this.buffer.char) {
			case '^':
				this.buffer.next();
				return new MapGroup('^', this.pow(), DataSets.SUPERSCRIPT);
			case '_':
				this.buffer.next();
				return new MapGroup('_', this.pow(), DataSets.SUBSCRIPT);
			default:
				return this.term2();
		}
	}

	pow() {
		// Заметка: здесь хвостовая рекурсия. Можно не переживать о возврате значения this.inPow;
		this.inPow = true;
		let der = this.term2();
		this.inPow = false;
		return der;
	}

	term2() {
		// Заметка: если режим скрипта отключён, то парсер пройдёт мимо этого уровня.
		// Проще говоря, скобки не парсятся вне режима скрипта.
		switch (this.buffer.codePoint) {
			case 40: // ord '('	
				return this.wrap(41, '(', ')'); // ord ')'
			case 91: // ord '['
				return this.wrap(93, '[', ']'); // ord ']'
			case 123: // ord '{'
				return this.wrap(125, '{', '}'); // ord '}'
			default:
				return this.term3();
		}
	}

	wrap(unwrapper, left, right) {
		let i = this.buffer.index;
		this.buffer.next();

		let lastUnwrapper = this.unwrapper;
		this.unwrapper = unwrapper;

		// Оптимизация:
		// this.word создает посимвольные группы при this.inPow,
		// Если степень обернуть в скобки, то посимвольная работа не обязательна, 
		// потому что скрипт будет применен по всей подстроке.
		// Внутри скобок можно скрыть факт this.inPow, чтобы this.word не делила группы.
		let wasInPow = this.inPow;
		this.inPow = false;

		let groups = [];
		while (this.buffer.still && this.buffer.codePoint !== unwrapper) {
			groups.push(this.term1());
		}

		this.unwrapper = lastUnwrapper;
		this.inPow = wasInPow;

		if (!this.buffer.still) {
			// Мы дошли до конца и не нашли before.
			// Возвращаем исходную подстроку.
			this.buffer.point(i);
			return new LiteralGroup(this.buffer.interval);
		}
		// Мы не дошли до конца, а значит встретили before. Пропускаем.
		this.buffer.next();

		let group = list(groups);
		if (group === EmptyGroup.INSTANCE) {
			// Если в скобках ничего нет, то возвращаем исходную подстроку.
			this.buffer.point(i);
			return new LiteralGroup(this.buffer.interval);
		}
		return new WrapperGroup(group, left, right);
	}
	
	term3() {
		// Нет смысла проверять \[, эта проверка при надобности уже выполнена выше.
		if (this.buffer.codePoint === 92) { // ord '\\'
			this.buffer.next();
			return new TagGroup('\\', this.word(true, true), DataSets.TAGS);
		}
		
		return this.word(this.inScript, false);
	}

	word(avoidScript, findTag) {
		let run = true;
		let i = this.buffer.index;
		let m = null;
		let powState = 0;
		this.buffer.point();
		while (run && this.buffer.still) {
			let cp = this.buffer.codePoint;
			switch (cp) {
				case 92: // ord '\\'
					run = false;
					break;
				case 40: // ord '('
				case 91: // ord '['
				case 123: // ord '{'
					if (this.inScript) {
						run = false;
					}
					break;
				case 41: // ord ')'
				case 93: // ord ']'
				case 125: // ord '}'
					if (cp === this.unwrapper) {
						run = false;
					}
					break;
				case 94: // ord '^'
				case 95: // ord '_'
					if (avoidScript) {
						run = false;
					}
					break;
				default:
					if (!findTag && this.inPow) {
						// [+-]?\d*.?						
						let unary = (cp === 43 || cp === 45); // ord '+', ord '-'
						let digit = (48 <= cp && cp <= 57); // '0'...'9' includes the cp?
						if (powState === 0 && unary) {
							powState = 1;
						} else if (powState <= 2 && digit) { 
							powState = 2;
						} else if (powState < 3 && !unary && !digit) {
							powState = 3;
						} else {
							run = false;
						}
					}
			}

			if (run) {
				this.buffer.next();
				if (findTag && DataSets.TAGS[this.buffer.interval] !== undefined) {
					m = this.buffer.index;
				}
			}
		}
		if (findTag && m) {
			// Если мы ищем тег и находили совпадения,
			// то возвращаем последнюю совпавшую строку, отменяя всё остальное.
			this.buffer.point(m);
			this.buffer.return();
		}
		this.buffer.point(i);
		return new LiteralGroup(this.buffer.interval);
	}
}

function list(groups) {
	switch (groups.length) {
		case 0:
			return EmptyGroup.INSTANCE;
		case 1:
			return groups[0];
		default:
			return new ListGroup(groups);
	}
}

function format(text) {
    if (text.startsWith(":mathex-disable:")) {
        return text.substring(":mathex-disable:".length);
    }
    let debug = false;
    if (text.startsWith(":mathex:")) {
        text = text.substring(":mathex:".length);
        debug = true;
    }
    let tree = new Parser(text).tree;
    return debug ? tree.struct : tree.mapped;
}

const prevopen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, async = true, user = null, password = null) {
    if (url === '/al_im.php?act=a_send' || url === '/al_im.php?act=a_edit_message') {
        const prevsend = this.send;
        this.send = (data) => {
            const query = new URLSearchParams(data);
            const msg = query.get('msg');
            const formattedMsg = format(msg);
            query.set('msg', formattedMsg);
            data = query.toString();
            prevsend?.call(this, data);
        };
    };
    prevopen?.call(this, method, url, async, user, password);
};