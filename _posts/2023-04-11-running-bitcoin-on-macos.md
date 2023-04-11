---
layout: post
title: "Running Bitcoin on macOS"
description: "TODO"
image: "/assets/bitcoin-is-time.jpeg"
date: 2023-04-11 21:46:00 +0200
categories: bitcoin
---


For å unngå at maskina går i dvale

```shell
pmset -g
```

```shell
sudo pmset -a sleep 0; sudo pmset -a hibernatemode 0; sudo pmset -a disablesleep 1;
```

Do `pmset -g` again, and you should now see that sleep and hibernate has been disabled.

```
System-wide power settings:
 SleepDisabled  1
Currently in use:
 standby              1
 Sleep On Power Button 1
 womp                 1
 autorestart          0
 hibernatefile        /var/vm/sleepimage
 powernap             1
 gpuswitch            2
 networkoversleep     0
 disksleep            10
 standbydelayhigh     86400
 sleep                0 (sleep prevented by screensharingd)
 autopoweroffdelay    259200
 hibernatemode        0
 autopoweroff         1
 ttyskeepawake        1
 displaysleep         10
 tcpkeepalive         1
 highstandbythreshold 50
 standbydelaylow      86400
 ```

## Tor

```shell
brew install tor
```

Copy the Tor sample file

```shell
cp /usr/local/etc/tor/torrc.sample /usr/local/etc/tor/torrc
```

Open the newly copied `torrc` file and remove comments on the following lines:

```shell
ControlPort 9051
CookieAuthentication 1
```

Finally, start Tor as a service

```shell
brew services start tor
```

## i2p

```shell
brew install i2pd
```

## Bitcoin Core

```shell
brew install bitcoin
```
