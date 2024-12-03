# What is it?

This is a [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
extension
that adds some TeX-like functionality in [vk.com messenger](https://vk.com/im).

## Installing

Open [user script](mathex.user.js), press "Raw" and follow the instructions.

## Features

### Tags

Right now available the following tags:

| Tag         | Replacement |
|-------------|-------------|
| \alpha      | α           |
| \beta       | β           |
| \gamma      | γ           |
| \delta      | δ           |
| \Delta      | Δ           |
| \epsilon    | ε           |
| \eps        | ε           |
| \theta      | θ           |
| \Theta      | Θ           |
| \lambda     | λ           |
| \nu         | ν           |
| \pi         | π           |
| \sigma      | σ           |
| \Sigma      | Σ           |
| \tau        | τ           |
| \phi        | φ           |
| \psi        | ψ           |
| \Psi        | Ψ           |
| \omega      | ω           |
| \Omega      | Ω           |
| \neq        | ≠           |
| \modeq      | ≡           |
| \pm         | ±           |
| \sqrt       | √           |
| \int        | ∫           |
| \to         | →           |
| \eq         | ⇔           |
| \wedge      | ∧           |
| \and        | ∧           |
| \vee        | ∨           |
| \or         | ∨           |
| \neg        | ¬           |
| \forall     | ∀           |
| \exists     | ∃           |
| \empty      | ∅           |
| \varnothing | ∅           |
| \in         | ∈           |
| \notin      | ∉           |
| \subset     | ⊂           |
| \upset      | ⊃           |
| \cup        | ⋃           |
| \cap        | ⋂           |
| \mapsto     | ↦           |
| \N          | ℕ           |
| \Z          | ℤ           |
| \Q          | ℚ           |
| \R          | ℝ           |
| \C          | ℂ           |
| \le         | ≤           |
| \ge         | ≥           |
| \approx     | ≈           |
| \cbrt       | ∛           |
| \qdrt       | ∜           |
| \der        | ∂           |
| \times      | ×           |
| \dot        | ∙           |
| \comp       | ∘           |
| \circ       | ∘           |
| \sum        | Σ           |
| \prod       | ∏           |
| \inf        | ∞           |

And more...

### Script Mode

Script Mode can be enabled by wrapping text with __\[__ and __\]__.
Inside the __Script Mode__ you can use **^**, **_** and parentheses:

* **^** makes next group as superscript, if might.
* **_** makes next group as subscript, if might.
* Brackets **()**, **[]**, **{}** separates text to different groups.

__Note: if it is not possible to apply the script to at least one character in the bracket, 
then the script is NOT APPLIED to the entire bracket__

For example:

| Input               | Output   |
|---------------------|----------|
| \\\[\alpha^2x\\]    | α²ˣ      |
| \\\[\alpha^x+2\\]   | αˣ+2     |
| \\\[\alpha^(x+2)\\] | α⁽ˣ⁺²⁾   |
| \\\[\alpha^xy\\]    | αˣy      |
| \\\[\alpha^(xy)\\]  | α⁽ˣʸ⁾    |
| \\\[α^\[x+2]\\]     | a^\[x+2] |

> `\[α^[x+2]\]` is `α^[x+2]` because we can't make the `[]` as superscript.

## Wishes

I wish you would give a star to the repository.
And leave your suggestions (or critique) in __Issues__/__Pull Requests__.