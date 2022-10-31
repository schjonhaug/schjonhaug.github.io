---
layout: post
title: "Promoting privacy and censorship resistance in Bitcoin Core"
description: "How to run nodes as a dual hidden services on Tor and I2P"
image: "/assets/promoting-privacy-and-censorship-resistance-in-bitcoin-core.png"
date: 2022-08-23 20:55:21 +0200
categories: bitcoin
---

⚠️ This post contains outdated information, and I instead recommend following the excellent tutorials over at [Raspibolt](https://raspibolt.org). ⚠️

You can now run nodes as a dual hidden services on Tor and I2P (Invisible Internet Project). If Tor is having issues, your I2P service can continue to communicate.

## SSH and updating the OS

Start by updating the Raspberry Pi OS to the latest and greatest if you haven‘t done this in a while:

```bash
sudo apt-get update -y && sudo apt upgrade -y
```

## Tor

![The Onion Router logo](/assets/tor-logo.svg)

Tor, short for [The Onion Router](https://en.wikipedia.org/wiki/Tor_(network)) enables anonymous communication. It directs Internet traffic through a free, worldwide, volunteer overlay network, consisting of more than seven thousand relays, to conceal a user’s location and usage from anyone performing network surveillance or traffic analysis.

Tor is a great service to promote privacy and censorship resistance.  These goals align directly with the Bitcoin network.

By running Bitcoin over Tor, you get the following benefits:

- It hides your IP address from the world.
- You don’t need to worry about setting up firewall port forwarding.
- Promotes privacy for others to connect into your node anonymously.

See additional [documentation](https://github.com/bitcoin/bitcoin/blob/master/doc/tor.md) in the Bitcoin Core repo.

### Installation and setup

So, the first thing we‘ll do is to install Tor

```bash
sudo apt install tor -y
```

Once this has been installed, you should be able to query the tor service to check its status:

```bash
sudo systemctl status tor
```

You’ll see something like this, verifying that it’s active:

```bash
● tor.service - Anonymizing overlay network for TCP (multi-instance-master)
     Loaded: loaded (/lib/systemd/system/tor.service; enabled; vendor preset: enabled)
     Active: active (exited) since Sat 2022-08-20 18:57:18 CEST; 15s ago
    Process: 8653 ExecStart=/bin/true (code=exited, status=0/SUCCESS)
   Main PID: 8653 (code=exited, status=0/SUCCESS)
        CPU: 3ms
```

Also you should see that port 9050 is listening for incoming connections to proxy for the local loopback address:

```bash
netstat -an | grep 9050
```

You’ll see this:

```bash
tcp        0      0 127.0.0.1:9050          0.0.0.0:*               LISTEN
```

We will be setting up Bitcoin Core to run as a hidden service to allow incoming connections. So, we need to enable the Tor control port in the Tor configuration file.

```bash
sudo nano /etc/tor/torrc
```

Here we need to uncomment the `ControlPort 9051` and `CookieAuthentication 1`:

```
## The port on which Tor will listen for local connections from Tor
## controller applications, as documented in control-spec.txt.

ControlPort 9051

## If you enable the controlport, be sure to enable one of these
## authentication methods, to prevent attackers from accessing it.
#HashedControlPassword 16:872860B76453A77D60CA2BB8C1A7042072093276A3D701AD684053EC4C

CookieAuthentication 1
```

The last thing we need for Bitcoin Core and the satoshi user to be able to access the cookie file.

The `control.authcookie` can be seen here, by running:

```bash
ls -al /run/tor/
```

You’ll get:

```bash
total 8
drwxr-sr-x  2 debian-tor debian-tor 120 Aug 16 22:28 .
drwxr-xr-x 25 root       root       740 Aug 16 22:09 ..
srw-rw----  1 debian-tor debian-tor   0 Aug 16 22:28 control
-rw-r-----  1 debian-tor debian-tor  32 Aug 16 22:27 control.authcookie
srw-rw-rw-  1 debian-tor debian-tor   0 Aug 16 22:28 socks
-rw-r--r--  1 debian-tor debian-tor   5 Aug 16 22:27 tor.pid
```

So we need to add the satoshi user to the `debian-tor` group, like so:

```bash
sudo usermod -a -G debian-tor satoshi
```

If you now do `id satoshi`, you should see that it belongs to the debian-tor group:

```bash
uid=1000(satoshi) gid=1000(satoshi) groups=1000(satoshi),4(adm),20(dialout),24(cdrom),27(sudo),29(audio),44(video),46(plugdev),60(games),100(users),104(input),106(render),108(netdev),999(spi),998(i2c),997(gpio),114(debian-tor)
```

### Configure Bitcoin Core

Let’s create a configuration file to let Bitcoin Core use Tor:

```bash
sudo touch /media/ssd/bitcoin/bitcoin.conf 
sudo chown satoshi /media/ssd/bitcoin
nano /media/ssd/bitcoin/bitcoin.conf
```

Enter the following text, exit and save the file:

```
proxy=127.0.0.1:9050
listen=1
debug=tor
```

This is what is being configured:

- `proxy=127.0.0.1:9050`: Sets the proxy server to point localhost on port 9050. This proxy server will be used to try to reach .onion addresses as well.
- `listen=1`: We want to enable listening for incoming connections, as this is off by default behind a proxy.
- `debug=tor`: We set debug to tor get additional information in the debug log about our Tor configuration.

## I2P

![I2P logo](/assets/i2pd-logo.png)

[The Invisible Internet Project](https://en.wikipedia.org/wiki/I2P) (I2P) is an anonymous network layer (implemented as a mix network) that allows for censorship-resistant, peer-to-peer communication. Anonymous connections are achieved by encrypting the user’s traffic (by using end-to-end encryption), and sending it through a volunteer-run network of roughly 55,000 computers distributed around the world.

See additional [documentation](https://github.com/bitcoin/bitcoin/blob/master/doc/i2p.md) in the Bitcoin Core repo.

### Installation and setup

```bash
sudo apt install i2pd -y
```

After it’s been installed, start it with:

```bash
sudo systemctl start i2pd.service
```

To start it automatically on boot:

```bash
sudo systemctl enable i2pd.service
```

---

The current stable version in apt is [2.36.0](https://packages.debian.org/buster/i2pd), and that crashed after a few minutes on my system. The newest version released on Github is [2.43.0](https://github.com/PurpleI2P/i2pd), and that has so far worked better. However, this requires a slightly different installation process, see the details in [readme.html](https://repo.i2pd.xyz/.help/readme.html)

---

### Configure Bitcoin Core

Let’s get back to editing the bitcoin.conf file:

```bash
nano /media/ssd/bitcoin/bitcoin.conf
```

Add the following lines:

```
debug=i2p
i2psam=127.0.0.1:7656
```

This is what is being configured:

- `debug=i2p`: Like we did for Tor, we set debug to I2P get additional information in the debug log about our I2P configuration.
- `i2psam=127.0.0.1:7656`: I2P SAM proxy to reach I2P peers and accept I2P connections

## All done, time to test

Finally, restart the computer with `sudo reboot` and reconnect with SSH after a few seconds.

First, let’s test that Tor is up and running:

```bash
sudo systemctl status tor@default.service
```

And, similarly for I2P:

```bash
sudo systemctl status i2pd
```

In both cases, you should see them being active.

To see what kind of peers your node sees, you can do:

```bash
bitcoin-cli -addrinfo
```

You can also check which kind of nodes you’re currently connect to:

```bash
bitcoin-cli -netinfo 4
```

You might see that some of them are connected with onion (Tor) and i2p. You’ll also see your `.onion` and `.i2p` address.

Finally, you can check the debug log for lines starting with `tor` and `i2p` to check that everything is OK:

```bash
tail -f /media/ssd/bitcoin/debug.log
```
