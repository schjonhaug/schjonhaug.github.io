---
layout: post
title: ""
description: ""
image: "/assets/multisig.webp"
date: 2021-11-14 13:37:00 +0200
categories: bitcoin
---

![Bitcoin](/assets/multisig.webp)

Venturing into the world of Bitcoin [multi-sig](https://en.bitcoin.it/wiki/Multi-signature) can be daunting at first, but as with a lot of things in life‚ practice makes perfect. A common recommendation is to learn on testnet instead of mainnet, as it’s both cheaper and safer to do so. However, receiving coins for testing on testnet 3 and 4 can sometimes be cumbersome, as you’re basically dependent on faucets sending you test coins to use. Enter regtest.

## Regtest

The Regression Test Network (or regtest for short) is a private bitcoin blockchain running on your own computer, normally used for development. However, it’s great to use for setting up and learning about multi sig since it’s very easy to mine your own coins, which then in turn can be receiving and sent to your multi sig wallet testing. And, if you mess up for some reason, you can easily start over!

## Bitcoin Core

Install [Homebrew](https://brew.sh), and then [Bitcoin Core](https://bitcoincore.org) with

```shell
brew install bitcoin
```

Before starting up the Bitcoin Core daemon, we need a config file telling it to accept RPC commands later on from Sparrow:

```shell
mkdir ~/Library/Application\ Support/Bitcoin/regtest
echo 'server=1' > ~/Library/Application\ Support/Bitcoin/regtest/bitcoin.conf
```

Start the daemon in regtest mode:

```shell
bitcoind -regtest -daemon
```

Create a new wallet for the mined coins:

```shell
bitcoin-cli -regtest createwallet ""
```

Mine some coins to the wallet:

```shell
bitcoin-cli -regtest generatetoaddress 101 $(bitcoin-cli -regtest getnewaddress)
```

We now should have 50 coins available to us:

```shell
bitcoin-cli -regtest getbalance
```

## Sparrow Wallet

[Sparrow Wallet](https://sparrowwallet.com) is an awesome desktop wallet for macOS, Windows and Linux by Craig Raw. Download and install it, and then open it in regtest mode:

```shell
open /Applications/Sparrow.app --args -n regtest
```

The first thing we need to do is to connect to our Bitcoin Core node running in regtest. Open Sparrow → Preferences… → Server. There, leave the default values but change the Data Folder by appending `regtest`. Click on "Test Connection" to make sure it connects. Upon closing Preferences, the toggle in the lower right hand corner should turn green and you should see "Connected to <http://127.0.0.1:18433> at height 101" in the status bar.

## Multisig

Send coins:

```shell
bitcoin-cli -regtest sendtoaddress "bcrt1qv0a20kkj63gek9mldffmgvqxjpjz6m72jrquqa" 5
```

Delete regtest

```shell
open ~/Library/Application\ Support/Bitcoin
```
