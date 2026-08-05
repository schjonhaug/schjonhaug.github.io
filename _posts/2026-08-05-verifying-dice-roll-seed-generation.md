---
layout: post
title: "Don’t Trust, Verify: Dice Seeds Across Hardware Wallets"
description: "I compare how SeedSigner, Coldcard, Krux, Keystone, BitBox02, Jade, and Passport turn dice or 23 seed words into a 24-word BIP39 mnemonic."
date: 2026-08-05 12:32:39 +0200
categories: bitcoin
---

<style>
.post-content table {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>

Hardware wallets can generate a Bitcoin seed from dice rolls. That lets you replace—or avoid trusting—the device’s random-number generator. But it creates a new question: how do you know the wallet converted your rolls correctly?

I cloned the source code for several open-source hardware wallets and tested the deterministic parts locally. The wallets fall into two groups:

- **Direct dice entry:** SeedSigner, Coldcard, Krux, and Keystone 3.
- **Enter 23 words and complete the last word:** SeedSigner, Coldcard, BitBox02, Jade, and Passport.

The first group does not all use the same dice convention. SeedSigner, Coldcard, and Krux hash the characters you enter. Keystone converts every `6` to `0` before hashing. Both are deterministic, but the same physical rolls do not produce the same seed unless the verifier uses the same convention.

The second group exposed another important detail: **23 words do not determine one unique 24th word**. There are eight valid final words. The wallets differ in who chooses the three remaining entropy bits.

> **Every roll and seed word in this article is public test data. Never send bitcoin to these seeds.** Never enter real wallet entropy or seed words into an internet-connected computer. For real funds, perform verification on an air-gapped, ephemeral system and keep the rolls, words, hashes, photos, and terminal history secret.

## What I tested

I pinned released source where possible so these results remain reproducible:

| Project | Source tested | Local verification |
| --- | --- | --- |
| SeedSigner | [`0.8.7` (`e0a80d4`)](https://github.com/SeedSigner/seedsigner/tree/e0a80d4b33b8eb7fb1e9fd14a27b7cd11c7d2cd6) | Project CLI and 8 mnemonic tests |
| Coldcard | [`c849c4e`](https://github.com/Coldcard/firmware/tree/c849c4e04a978335937a0fd0c96e76f5bd70bbb6) source snapshot | Official `docs/rolls.py` verifier |
| Ian Coleman BIP39 | [`0.5.6` (`de71c22`)](https://github.com/iancoleman/bip39/tree/de71c22328b24e0848bbe1bd12ac8974ca83b5b8) | Pinned web UI in local Chrome |
| Krux | [`v26.08.0` (`ec058d86`)](https://github.com/selfcustody/krux/tree/ec058d862b00a62bd06ec7932b31f007fc2b77e3) | 13 dedicated dice tests and source path |
| Keystone 3 | [`3.0.2` (`c224a7f`)](https://github.com/KeystoneHQ/keystone3-firmware/tree/c224a7f5164cce07bf13885d7664afd99bed11a0) | Source path and independent host calculation |
| BitBox02 | [`firmware/v9.26.4` (`6c18aa9`)](https://github.com/BitBoxSwiss/bitbox02-firmware/tree/6c18aa9cebcc457c3c5cd2c36ce58268a16bede5) | Source path and independent final-word enumeration |
| Jade | [`1.0.40` (`6f858f3`)](https://github.com/Blockstream/Jade/tree/6f858f39a19f89ff7fd4580c5b2db72cfe1dc0af) | Source path and independent final-word enumeration |
| Passport | [`v2.3.11` (`2ac5658`)](https://github.com/Foundation-Devices/passport2/tree/2ac5658394b9a924dfb5201b0e5bae36acedccf9) | Source path and independent final-word enumeration |

“Source path” is deliberate wording. I ran project-provided host code for SeedSigner, Coldcard, Krux, and Ian Coleman. Keystone, Jade, and Passport implement these flows inside embedded UI code, so I inspected the pinned implementation and reproduced its small deterministic algorithm on the host. I did not claim to simulate the whole device.

## Test one: the same 99 dice rolls

These are the 99 D6 rolls, recorded in order with no spaces:

```text
133363436436436415622614221225242212144161454643266122155666664444633643543353132626522332412313253
```

A fair D6 roll contributes approximately 2.585 bits of entropy. Ninety-nine independent rolls provide approximately 255.9 bits, which is the commonly used roll count for a 24-word seed.

SeedSigner, Coldcard, and Krux use this construction:

```text
99 rolls as an ASCII string
        ↓ SHA-256
256-bit digest
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

### SeedSigner 0.8.7

SeedSigner’s [`generate_mnemonic_from_dice`](https://github.com/SeedSigner/seedsigner/blob/e0a80d4b33b8eb7fb1e9fd14a27b7cd11c7d2cd6/src/seedsigner/helpers/mnemonic_generation.py) hashes the roll string with SHA-256 and sends the 32-byte digest through BIP39.

I checked out the same release that I run on my device:

```shell
git switch 0.8.7
.venv/bin/python tools/mnemonic.py dice 133363436436436415622614221225242212144161454643266122155666664444633643543353132626522332412313253
```

It returned the public test mnemonic beginning with `wrist tired novel` and ending with `sunset draw victory`. Its mnemonic-generation tests also passed:

```shell
.venv/bin/python -m pytest tests/test_mnemonic_generation.py -q
```

```text
........                                                                 [100%]
8 passed
```

The equivalent device flow is **Tools → New Seed → 24 words (99 rolls)**. SeedSigner also publishes a [dice-seed verification guide](https://github.com/SeedSigner/seedsigner/blob/e0a80d4b33b8eb7fb1e9fd14a27b7cd11c7d2cd6/docs/dice_verification.md).

### Coldcard

Coldcard’s [`add_dice_rolls`](https://github.com/Coldcard/firmware/blob/c849c4e04a978335937a0fd0c96e76f5bd70bbb6/shared/seed.py) starts a SHA-256 hash and updates it with each entered character from `1` through `6`. For a new 24-word seed, it enforces a 99-roll threshold.

Coldcard includes a standalone verifier:

```shell
printf '%s\n' '133363436436436415622614221225242212144161454643266122155666664444633643543353132626522332412313253' | python3 docs/rolls.py
```

The official script returned the same full digest and all 24 words. Coldcard documents the process in [Verifying Dice Roll Math](https://coldcard.com/docs/verifying-dice-roll-math/).

### Krux

Krux supports both D6 and D20 input. Its pinned source requires 99 D6 rolls or 60 D20 rolls for a 24-word mnemonic. The [`DiceEntropy`](https://github.com/selfcustody/krux/blob/ec058d862b00a62bd06ec7932b31f007fc2b77e3/src/krux/pages/new_mnemonic/dice_rolls.py) flow joins the D6 characters, displays their SHA-256 digest, and returns that digest as BIP39 entropy.

The dedicated dice suite passed locally:

```shell
.venv/bin/pytest tests/pages/new_mnemonic/test_dice_rolls.py -q
```

```text
.............                                                            [100%]
13 passed
```

Because the pinned code hashes the same ASCII bytes, the public 99-roll vector produces the same digest and mnemonic as SeedSigner and Coldcard.

### Ian Coleman’s BIP39 tool

I cloned and served the pinned `0.5.6` source used by [iancoleman.io/bip39](https://iancoleman.io/bip39/) locally, then entered the public vector in Chrome:

1. Select **Show entropy details**.
2. Paste the 99 rolls into **Entropy**.
3. Explicitly select **Base 10 [0-9]** or **Hex [0-9A-F]**.
4. Select **24 Words** as the mnemonic length.

The UI reported 99 events and produced the same `wrist tired … draw victory` mnemonic. Its [`setMnemonicFromEntropy`](https://github.com/iancoleman/bip39/blob/de71c22328b24e0848bbe1bd12ac8974ca83b5b8/src/js/index.js) function hashes the cleaned string when a mnemonic length is selected.

The input type is the easy detail to get wrong. **Do not select Dice [1-6] for this three-wallet comparison.** Dice mode changes every `6` to `0`, so it hashes different bytes. That convention is useful for the next wallet.

## Keystone uses a different dice convention

Keystone 3 has direct D6 entry, but current firmware does not match the preceding 99-roll workflow. Its [`gui_dice_rolls_widgets.c`](https://github.com/KeystoneHQ/keystone3-firmware/blob/c224a7f5164cce07bf13885d7664afd99bed11a0/src/ui/gui_widgets/gui_dice_rolls_widgets.c) defines 50 rolls for 128-bit entropy and **100 rolls for 256-bit entropy**. Before SHA-256, it replaces each `6` with `0`.

That is the same normalization used by Ian Coleman’s **Dice [1-6]** mode. To make the test reproducible, I appended one documented roll—`1`—to the original vector:

```text
1333634364364364156226142212252422121441614546432661221556666644446336435433531326265223324123132531
```

After changing `6` to `0`, SHA-256 is:

```text
00fc8bce4a92496a21697f412d1086bea968d11af95c6b02486953c03fb0c1b1
```

The resulting mnemonic is:

```text
abstract tone vicious news cause relax
mad copper donkey hammer canvas later
notable hammer hip clog help banner
bottom pole advance such almost canal
```

I reproduced this with a small host calculation based directly on the pinned C code, then entered the 100 rolls into the pinned Ian Coleman UI using **Dice [1-6]** mode. Both returned the same mnemonic.

This does not make either convention wrong. It means a verification procedure must specify all three parts: the roll count, character normalization, and hash input. “SHA-256 the dice rolls” is not precise enough.

## Test two: what does “calculate the 24th word” mean?

A 24-word BIP39 mnemonic represents 256 entropy bits plus an 8-bit checksum. The words encode 264 bits in total.

The first 23 words contain 253 bits. The last word must therefore supply:

- 3 remaining entropy bits; and
- 8 checksum bits.

Three free bits have `2³ = 8` possible values. Therefore, after entering 23 valid BIP39 words, there are exactly **eight** checksum-valid final words—not one.

I used the first 23 words from the public test mnemonic:

```text
wrist tired novel fetch woman whisper jealous black average crawl task helmet negative wrong foster dry chronic ordinary chase typical recipe sunset draw
```

Independent BIP39 enumeration produced these eight valid endings:

| Remaining bits | Valid word |
| --- | --- |
| `000` | `blade` |
| `001` | `child` |
| `010` | `enhance` |
| `011` | `have` |
| `100` | `mention` |
| `101` | `regret` |
| `110` | `shallow` |
| `111` | `victory` |

The original dice seed ends in `victory`, corresponding to `111`.

### How the wallets handle those three bits

| Wallet | Behaviour after 23 words | Who controls the remaining entropy? |
| --- | --- | --- |
| SeedSigner | Accepts 3 coin flips, a BIP39 word as an entropy choice, or all zeros; then calculates the checksum | User |
| Coldcard | Displays the 8 valid final words | User |
| BitBox02 | Displays the 8 valid final words and asks the user to choose | User |
| Jade | Filters to the 8 valid words and randomizes the initially highlighted choice | User chooses; device RNG only moves the initial selection |
| Passport | Uses device noise to choose a provisional final word, then recalculates its checksum | Device RNG |

SeedSigner’s [`Final Word Calc`](https://github.com/SeedSigner/seedsigner/blob/e0a80d4b33b8eb7fb1e9fd14a27b7cd11c7d2cd6/src/seedsigner/views/tools_views.py) is the most explicit about the entropy boundary. For 24 words it asks for three coin flips, a word selection, or “Finalize with zeros.” I ran all eight flip patterns through its checksum helper and got the eight words in the table above.

Coldcard’s [`WordNestMenu`](https://github.com/Coldcard/firmware/blob/c849c4e04a978335937a0fd0c96e76f5bd70bbb6/shared/seed.py) calls `a2b_words_guess` after word 23 and constructs a menu from the eight results. Its [Seed XOR documentation](https://github.com/Coldcard/firmware/blob/c849c4e04a978335937a0fd0c96e76f5bd70bbb6/docs/seed-xor.md) also states that Coldcard shows eight possible words.

BitBox02’s Rust [`lastword_choices`](https://github.com/BitBoxSwiss/bitbox02-firmware/blob/6c18aa9cebcc457c3c5cd2c36ce58268a16bede5/src/rust/bitbox02-rust/src/workflow/mnemonic.rs) calculates all eight candidates from the three possible entropy bits and displays them as a menu. The file includes its own brute-force comparison test. I independently enumerated the candidates for this article’s 23 words and matched the expected eight-word set.

Jade’s [`valid_final_words`](https://github.com/Blockstream/Jade/blob/6f858f39a19f89ff7fd4580c5b2db72cfe1dc0af/main/process/mnemonic.c) tries the 2,048-word BIP39 list and keeps the eight valid completions. In advanced recovery mode, **Calculate** restricts the picker to that set and randomizes which candidate is highlighted first. The user can still move to another valid word.

Passport takes a different approach. Its [`get_last_word`](https://github.com/Foundation-Devices/passport2/blob/2ac5658394b9a924dfb5201b0e5bae36acedccf9/ports/stm32/boards/Passport/modules/predictive_utils.py) draws four bytes from the device’s combined noise source, selects a provisional BIP39 word, strips the invalid checksum bits, and regenerates the proper final word. Simulating every possible provisional word produced the same eight valid outcomes, but a real Passport chooses one using device randomness.

This is why “the device calculates the 24th word” can be misleading. Every device calculates checksum bits. The security-relevant question is who supplies the three entropy bits that come before the checksum.

## Dice support at a glance

| Wallet | Direct dice-roll entry | 23-word completion | Included here? |
| --- | --- | --- | --- |
| SeedSigner | Yes, 99 D6 rolls for 24 words | Yes, user-controlled entropy | Yes |
| Coldcard | Yes, 99 D6 rolls for 24 words | Yes, choose from eight | Yes |
| Krux | Yes, 99 D6 or 60 D20 rolls | No equivalent tool found in this review | Yes |
| Keystone 3 | Yes, 100 D6 rolls for 24 words | No equivalent tool found in this review | Yes |
| BitBox02 | No direct roll-entry screen found | Yes, choose from eight | Yes |
| Jade | No direct roll-entry screen found | Yes, choose from eight | Yes |
| Passport | No direct roll-entry screen found | Yes, device RNG chooses | Yes |
| Trezor / OneKey | No direct roll-entry workflow found | No equivalent tool found in this review | No |

BitBox02, Jade, and Passport can complete a seed whose first 23 words were prepared externally, but that is not the same as accepting raw dice rolls. Converting dice directly into 23 BIP39 words requires its own precise, independently verified method.

I did not add Ledger, Tangem, NGRAVE, Ellipal, or SafePal to the code experiment because I could not clone a complete, auditable implementation of these seed workflows. Claims about certifications or entropy architecture would be a different article from this deterministic dice test.

## Results

| Comparison | Matching implementations | Result |
| --- | --- | --- |
| ASCII SHA-256 of the 99-roll string | SeedSigner, Coldcard, Krux, Ian Coleman Base 10/Hex | `wrist tired … draw victory` |
| `6 → 0`, then SHA-256 of the 100-roll string | Keystone 3 algorithm, Ian Coleman Dice mode | `abstract tone … almost canal` |
| Valid completions of the public first 23 words | SeedSigner helper and independent BIP39 enumeration; consistent with the Coldcard, BitBox02, Jade, and Passport source algorithms | `blade`, `child`, `enhance`, `have`, `mention`, `regret`, `shallow`, `victory` |

## What this verifies—and what it does not

This experiment verifies a narrow but important property: independent codebases agree when they receive the same bytes and apply the same BIP39 rules. It also catches the exact kind of mistake a casual verification can miss: selecting the wrong entropy mode while assuming all “dice” inputs mean the same thing.

It does not prove that a die is fair, that a physical device ran the inspected source, that its build is reproducible, or that every component of the wallet is correct. The embedded-only source checks are not substitutes for hardware testing.

The practical lesson is simple: user-supplied entropy is most valuable when the full conversion is documented and independently repeatable. Record the convention as carefully as the rolls—but keep both completely secret for any real wallet.
