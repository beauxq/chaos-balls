# chaos balls
-------------

see this app at: https://beauxq.github.io/chaos-balls/

I found this to be an interesting experiment relating chaos theory with floating point arithmetic (FPA) errors.

---

To be more precise, this might be more about floating point trigonometry, rather than floating point arithmetic.

Many people might only use "FPA errors" to refer to the situations resulting from numbers that can be represented precisely in base 10, but cannot be represented precisely in IEEE 754 floats, for example: 1.1

But I'm referring to situations resulting from any number that cannot be represented precisely in IEEE 754 floats, for example: pi

And the problem isn't that we don't get a precise pi as a return value. That's not expected.

What is expected: `Math.cos(Math.atan2(y, 0))` should return precisely `0` for any non-zero `y`, but it doesn't.

---

FPA errors are deterministic. So 2 balls with the same initial conditions would always behave the same way.

If there were no FPA errors:
 - The starting middle ball would bounce exactly straight up and down forever, with never any horizontal movement.

These FPA errors are not symmetrical for negative and positive numbers.
If they were symmetrical:
 - The 2 starting side balls would behave exactly symmetrical to each other forever.

Tiny losses of precision from FPA demonstrate the fundamentals of chaos theory.


inspired by:
    https://www.youtube.com/watch?v=6z4qRhpBIyA
