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

Open Sparrow in regtest:

```shell
open /Applications/Sparrow.app --args -n regtest
```

Send coins:

```shell
bitcoin-cli -regtest sendtoaddress "bcrt1qv0a20kkj63gek9mldffmgvqxjpjz6m72jrquqa" 5
```

Delete regtest

```shell
open ~/Library/Application\ Support/Bitcoin
```
