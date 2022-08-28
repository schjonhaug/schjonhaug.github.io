---
layout: post
title:  "Electrum Server"
date: 2022-08-23 20:55:21 +0200
categories: bitcoin
---

The first thing we need to do for Fulcrum to work with Bitcoin Core is to enable transcation index in bitcoin.conf.

```bash
nano /media/ssd/bitcoin/bitcoin.conf
```

There, add `txindex=1`, save and exit. Now, you’ll need to restart bitcoind for it to take effect. The syncing will take quite some time to finish, you can check on its status by running:

```bash
tail -n 100 -f /media/ssd/bitcoin/debug.log | grep txindex
```
