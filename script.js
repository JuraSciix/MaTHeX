// ==UserScript==
// @name         Mathex
// @version      1.0.1
// @description  ...
// @author       JuraSciix
// @match        *://*.vk.com/*
// @grant        none
// ==/UserScript==

class Reader {

    constructor(text) {
        this.text = text
        this.pos = 0
        this.markPos = 0
    }

    still() {
        return this.pos < this.text.length
    }

    next(count = 1) {
        this.pos += count
    }

    mark() {
        this.markPos = this.pos
    }

    cut() {
        return this.text.substring(this.markPos, this.pos)
    }

    rewind() {
        this.pos = this.markPos
    }

    char() {
        return this.text.charAt(this.pos)
    }

    codePoint() {
        return this.text.codePointAt(this.pos)
    }

    seen(str) {
        return this.text.startsWith(str, this.pos)
    }

    seenCodePoint(cp) {
        return this.still() && this.codePoint() === cp
    }

    seenIdent() {
        if (!this.still()) return false
        let cp = this.codePoint()
        return (97 <= cp && cp <= 122)  // Is lower case Latin letter?
            || (65 <= cp && cp <= 90)   // Is upper case Latin letter?
            || (48 <= cp && cp <= 57)   // Is digit?
            || (cp === 36 || cp === 95) // Is special ident character?
    }

    skipSpaces() {
        while (this.seenCodePoint(32)) { // Оптимиация: сравнение по коду символа, ord(' ')
            this.next()
        }
    }
}

const subscript = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ',
    '(': '₍', ')': '₎', '+': '₊', '-': '₋',
    '=': '₌'
}

const superscript = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'o': 'ᵒ', 'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
    'A': 'ᴬ', 'B': 'ᴮ', 'D': 'ᴰ', 'E': 'ᴱ', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'R': 'ᴿ', 'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ',
    '(': '⁽', ')': '⁾', '+': '⁺', '-': '⁻',
    'n': 'ⁿ',
    '=': '⁼'
}

const keywords = {
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
}

function formatEscape(r) {
    r.mark()
    let buffer = ""
    let match = null

    do {
        buffer += r.char()
        r.next()
        if (keywords[buffer]) {
            match = keywords[buffer]
            r.mark()
        }
    } while (r.seenIdent())

    r.rewind()
    return match || '\\'
}

function formatGroup(r) {
    r.mark()
    while (!r.seenCodePoint(125)) { // Оптимиация: сравнение по коду символа, ord('}')
        if (!r.still()) {
            // Некорректный синтаксис. Не обрабатываем
            r.rewind()
            return ""
        }
        r.next()
    }
    let buffer = r.cut()
    r.next() // Пропускаем '}'
    return buffer
}

function formatMember(r, map) {
    let buffer;
    if (r.seenCodePoint(123)) { // Оптимиация: сравнение по коду символа, ord('{')
        r.next()
        buffer = formatGroup(r)
    } else {
        buffer = r.char()
        r.next()
    }

    let replace = ""
    for (let c of buffer) {
        if (map[c] === undefined) {
            // Не вышло отмаппить всю группу. Значит, чтобы не выглядело ущербно, не маппим её совсем.
            return '^{' + buffer + '}'
        }
        replace += map[c]
    }
    return replace
}

function formatMath(r) {
    r.mark()
    let buffer = "";
    while (!r.seen("\\]")) {
        if (!r.still()) {
            // Некорректный синтаксис. Не обрабатываем
            r.rewind()
            return ""
        }
        if (r.seenCodePoint(92)) { // Оптимиация: сравнение по коду символа, ord('\\')
            r.next()
            buffer += formatEscape(r)
        } else if (r.seenCodePoint(94)) { // Оптимиация: сравнение по коду символа, ord('^')
            r.next()
            buffer += formatMember(r, superscript)
        } else if (r.seenCodePoint(95)) { // Оптимиация: сравнение по коду символа, ord('_')
            r.next()
            buffer += formatMember(r, subscript)
        } else {
            buffer += r.char()
            r.next()
        }
    }
    r.next(2) // Пропускаем '\]'
    return buffer
}

function format(text) {
    let r = new Reader(text)
    let buffer = "";
    while (r.still()) {
        if (r.seen("\\[")) {
            r.next(2)
            buffer += formatMath(r)
        } else if (r.seenCodePoint(92)) { // Оптимиация: сравнение по коду символа, ord('\\')
            r.next()
            buffer += formatEscape(r)
        } else {
            buffer += r.char()
            r.next()
        }
    }
    return buffer;
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