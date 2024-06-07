---
layout: post
title: ""
description: ""
image: "/assets/bitcoin-is-time.jpg"
date: 2021-11-14 13:37:00 +0200
categories: bitcoin
---

Install [Homebrew](https://brew.sh), and then Bitcoin Core with

```shell
brew install bitcoin
```

echo This is some text > myfile.txt

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

Delete regtest

```shell
open ~/Library/Application\ Support/Bitcoin
```
