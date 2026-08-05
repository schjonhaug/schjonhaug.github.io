---
layout: post
title: "Don’t Trust, Verify: 99 Dice Rolls on SeedSigner and Coldcard"
description: "I verify that SeedSigner 0.8.7, Coldcard, and Ian Coleman's BIP39 tool convert the same 99 dice rolls into the same 24-word mnemonic."
date: 2026-08-05 12:32:39 +0200
categories: bitcoin
---

Hardware wallets let us generate a Bitcoin seed by rolling a six-sided die. That removes the wallet's random number generator from the seed-generation process, but it introduces a question: how do we know the device converts our rolls correctly?

I tested one sequence of 99 dice rolls with three independent implementations:

- [SeedSigner 0.8.7](https://github.com/SeedSigner/seedsigner/tree/e0a80d4)
- [Coldcard](https://github.com/Coldcard/firmware/tree/c849c4e04a978335937a0fd0c96e76f5bd70bbb6)
- [Ian Coleman's BIP39 tool](https://iancoleman.io/bip39/)

All three produced the same SHA-256 digest and the same 24-word BIP39 mnemonic.

> **This is a public test seed. Never send bitcoin to it.** The dice rolls and mnemonic are published below and must be considered compromised. Never enter real wallet entropy or seed words into an internet-connected computer.

## The test vector

These are the 99 rolls, recorded in order with no spaces:

```text
133363436436436415622614221225242212144161454643266122155666664444633643543353132626522332412313253
```

A D6 roll contributes approximately 2.585 bits of entropy. Ninety-nine independent rolls therefore provide approximately 255.9 bits, which is the standard roll count used to create a 24-word seed.

The conversion is straightforward:

```text
99 rolls as an ASCII string
        ↓ SHA-256
256 bits of entropy
        ↓ BIP39 checksum and word mapping
24 words
```

SHA-256 of the roll string is:

```text
fe7c565c2aafcff51de0b70fc6577835793ffd57021d2873889af5fb3bb3109f
```

The resulting mnemonic is:

```text
wrist tired novel fetch woman whisper
jealous black average crawl task helmet
negative wrong foster dry chronic ordinary
chase typical recipe sunset draw victory
```

## SeedSigner 0.8.7

SeedSigner's [`generate_mnemonic_from_dice`](https://github.com/SeedSigner/seedsigner/blob/e0a80d4/src/seedsigner/helpers/mnemonic_generation.py) function hashes the roll string with SHA-256 and passes the 32-byte result to its BIP39 implementation.

I checked out the same `0.8.7` release that I run on my device and used SeedSigner's command-line verification tool:

```shell
git switch 0.8.7
.venv/bin/python tools/mnemonic.py dice 133363436436436415622614221225242212144161454643266122155666664444633643543353132626522332412313253
```

It returned:

```text
wrist tired novel fetch woman whisper jealous black average crawl task helmet negative wrong foster dry chronic ordinary chase typical recipe sunset draw victory
```

The project includes tests for its dice conversion, and all eight mnemonic-generation tests passed locally:

```shell
.venv/bin/python -m pytest tests/test_mnemonic_generation.py -q
```

```text
........                                                                 [100%]
8 passed
```

On a SeedSigner, the equivalent device flow is **Tools → New Seed → 24 words (99 rolls)**. SeedSigner also publishes a detailed [dice-seed verification guide](https://github.com/SeedSigner/seedsigner/blob/e0a80d4/docs/dice_verification.md).

## Coldcard

Coldcard uses the same construction in its [firmware](https://github.com/Coldcard/firmware/blob/c849c4e04a978335937a0fd0c96e76f5bd70bbb6/shared/seed.py): it starts a SHA-256 hash and updates it with each button press from `1` through `6`. After 99 rolls, the digest becomes the BIP39 entropy.

Coldcard provides a standalone [`rolls.py`](https://github.com/Coldcard/firmware/blob/c849c4e04a978335937a0fd0c96e76f5bd70bbb6/docs/rolls.py) script so the calculation can be verified independently of the device:

```shell
printf '%s\n' '133363436436436415622614221225242212144161454643266122155666664444633643543353132626522332412313253' | python3 docs/rolls.py
```

The script returned the same digest and the same mnemonic:

```text
fe7c565c2aafcff51de0b70fc6577835793ffd57021d2873889af5fb3bb3109f

   1: wrist
   2: tired
   3: novel
   4: fetch
   5: woman
   6: whisper
   7: jealous
   8: black
   9: average
  10: crawl
  11: task
  12: helmet
  13: negative
  14: wrong
  15: foster
  16: dry
  17: chronic
  18: ordinary
  19: chase
  20: typical
  21: recipe
  22: sunset
  23: draw
  24: victory
```

On a Coldcard, the equivalent device flow is **New Seed Words → Advanced → 24 Word Dice Roll**. Coldcard documents both the algorithm and an offline verification process in [Verifying Dice Roll Math](https://coldcard.com/docs/verifying-dice-roll-math/).

## Ian Coleman's BIP39 tool

Ian Coleman's tool provides a third implementation in JavaScript. Because this test vector is already public, it is safe to enter it into the live website. For real wallet entropy, download the [standalone HTML release](https://github.com/iancoleman/bip39/releases), verify it, and use it on an air-gapped, ephemeral system instead.

To reproduce the result:

1. Open [iancoleman.io/bip39](https://iancoleman.io/bip39/).
2. Select **Show entropy details**.
3. Paste the 99 rolls into the entropy field.
4. Explicitly select **Hex [0-9A-F]** or **Base 10 [0-9]**.
5. Select **24 Words** as the mnemonic length.

The tool returns the same mnemonic beginning with `wrist tired novel` and ending with `sunset draw victory`.

The entropy type is the easy detail to get wrong. **Do not select Dice [1-6] for this comparison.** Ian Coleman's Dice mode converts every `6` to `0` as part of its base-six processing, so it does not hash the same ASCII string that SeedSigner and Coldcard hash. SeedSigner's own verification guide calls out this exact difference.

The relevant Ian Coleman [conversion code](https://github.com/iancoleman/bip39/blob/de71c22328b24e0848bbe1bd12ac8974ca83b5b8/src/js/index.js#L1874-L1932) cleans the selected entropy input, hashes that string with SHA-256 when a mnemonic length is selected, and sends the resulting bytes through BIP39.

## Results

| Implementation | Input conversion | SHA-256 | Mnemonic |
| --- | --- | --- | --- |
| SeedSigner 0.8.7 | SHA-256 of ASCII rolls | `fe7c565c…bb3109f` | `wrist tired … draw victory` |
| Coldcard | SHA-256 of ASCII rolls | `fe7c565c…bb3109f` | `wrist tired … draw victory` |
| Ian Coleman, Hex/Base 10, 24 Words | SHA-256 of cleaned input | `fe7c565c…bb3109f` | `wrist tired … draw victory` |

The agreement is not accidental. Each implementation receives the same ordered string of 99 characters, hashes the same bytes, and applies the same BIP39 checksum and English word list.

## What this verifies—and what it does not

This test verifies a narrow but important property: for this test vector, three separate codebases agree on the deterministic conversion from dice rolls to a BIP39 mnemonic. It is a practical way to catch transcription errors, unexpected firmware behaviour, or a misunderstanding of the entropy format.

It does not prove that a die is fair, that a particular hardware unit is uncompromised, or that every part of a wallet's firmware is correct. It also does not make it safe to type a real seed into a connected computer.

For a real wallet, generate fresh rolls offline, verify them only in an air-gapped environment, and keep the rolls, hash, mnemonic, terminal history, photographs, and backups secret. For a public experiment like this one, a published test vector is exactly what we want: anyone can repeat the calculation and confirm the result.
