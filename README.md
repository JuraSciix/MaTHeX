### Keywords

Right now available the following keywords:
* `\alpha`, `α`
* `\beta`, `β`
* `\gamma`, `γ`
* `\pi`, `π`
* `\empty`, `∅`
* `\le`, `≤`
* `\ge`, `≥`
* `\neq`, `≠`

And more...

### Script Mode

Script Mode can be enabled by wrapping text with __\[__ and __\]__.
Inside math mode you can use **^** and **_**:
* **^** makes next group as superscript, if might.
* **_** makes next group as subscript, if might.

For example:
`\[\alpha^2x\]` is `α²ˣ`.
`\[\alpha^xy\]` is `αˣy`.
`\[\alpha^{2n}\]` is `α²ⁿ`

### Parenthesises

Parenthesises useful when you want:
* compound a lot of groups to one.
* split contents to different groups.

You can use different types of parenthesises:
* `()`
* `[]`
* `{}`

For example:
`\[\alpha^(x+2)\]` is `α⁽ˣ⁺²⁾`, but `α^[x+2]` is `α^[x+2]` because of we can't make the `[]` as superscript.
`\[(\alpha^2)x\]` is `(α²)x`