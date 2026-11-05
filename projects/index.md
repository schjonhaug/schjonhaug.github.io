---
layout: page
title: Projects
description: "Open-source projects by Andreas Schjønhaug."
permalink: /projects/
---

<p class="page-intro">Open-source software I build and maintain. Canary, the Bare Bitcoin plugin for BTCPay Server and the dice seed generator are active, the Nostr passkey project is a proof of concept, and Tapcards is archived. The source for all of them is on GitHub.</p>

<article class="project-card project-card-full">
  <p class="section-eyebrow">Nostr identity</p>
  <h2>Nostr Passkey Proof of Concept</h2>
  <p>An iOS proof of concept for deriving deterministic Nostr identity secrets from synced passkey PRF output, with Nostr used as a public salt registry for recovery.</p>
  <div class="project-links">
    <a class="button-link" href="https://github.com/schjonhaug/nostr-passkey-poc">View source on GitHub</a>
  </div>
</article>

<article class="project-card project-card-full">
  <p class="section-eyebrow">Bitcoin payments</p>
  <h2>Bare Bitcoin Plugin for BTCPay Server</h2>
  <p>A BTCPay Server plugin that accepts Lightning payments directly to a Bare Bitcoin account and shows its balance in BTCPay Server.</p>
  <div class="project-links">
    <a class="button-link" href="https://github.com/schjonhaug/btcpayserver-plugin-barebitcoin">View source on GitHub</a>
  </div>
</article>

<article class="project-card project-card-full">
  <p class="section-eyebrow">Bitcoin seed generation</p>
  <h2>LilyGO T-Display Bitcoin Dice Seed Generator</h2>
  <p>An offline, dice-only BIP39 seed generator for the LilyGO TTGO T-Display. It records private rolls, generates a mnemonic, verifies the backup, and clears sensitive material.</p>
  <div class="project-links">
    <a class="button-link" href="https://github.com/schjonhaug/lilygo-tdisplay-bitcoin-dice-seed-generator">View source on GitHub</a>
  </div>
</article>

<article class="project-card project-card-full">
  <p class="section-eyebrow">Bitcoin monitoring</p>
  <h2>Canary</h2>
  <p>Self-hosted Bitcoin monitoring with transaction alerts, intelligent balance notifications, and watch-only security.</p>
  <div class="project-links">
    <a class="button-link" href="https://canarybitcoin.com">Visit Canary</a>
    <a class="text-link" href="https://github.com/schjonhaug/canary">View source on GitHub</a>
  </div>
</article>

<article class="project-card project-card-full">
  <p class="section-eyebrow">Bitcoin NFC · Archived</p>
  <h2>Tapcards</h2>
  <p>A Go implementation of the Coinkite Tap Cards NFC protocol, focused on Satscard functionality and APDU and CBOR data exchange. The project is archived: the repository on GitHub is read-only and no longer updated.</p>
  <div class="project-links">
    <a class="button-link" href="https://github.com/schjonhaug/tapcards">View source on GitHub</a>
  </div>
</article>
