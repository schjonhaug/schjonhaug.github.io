---
layout: post
title:  "Running Bitcoin Core on a Raspberry Pi over Tor"
date:   2022-08-20 21:48:21 +0200
categories: bitcoin
---

This article will describe how to get [Bitcoin Core](https://bitcoincore.org) full node up and running on a [Raspberry Pi 4 Model B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) over Tor. To store the blockchain (which currently is close to 500 GB), I’m using a 1 TB SSD.

## Raspberry Pi OS

Start by downloading and running the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) on your computer.

![Raspberry Pi Imager on macOS](/assets/raspberry-pi-imager.png)

1. Click CHOOSE OS. I’ll not be using the GUI here, so I selected “Raspberry Pi OS (other)” and then I chose the “Raspberry Pi OS Lite (64-bit)”
1. Insert the MicroSD card into your computer and select it from CHOOSE STORAGE.
1. Click on the gear icon that will appear in the bottom right hand side corner. There, you’ll want to do some changes:
    - Set the hostname `bitcoin.local`.
    - Enable SSH with a username and a password (I chose satoshi as the username).
    - Set the locale with your time zone and keyboard layout.
    - If you need Wifi, you can enable it here as well.

1. Finally, click the WRITE button. When it’s done, remove the MicroSD card from your computer and insert it into the Raspberry Pi.

## SSH and updating the OS

After starting the Raspberry Pi, open a terminal on your computer and connect to the Raspberry Pi via SSH:

```shell
ssh satoshi@bitcoin.local
```

You’ll get a warning saying that “the authenticity of host bitcoin.local” can't be established. Type “yes” and press enter. Then you’ll enter your password that you set up earlier.

Start by updating the Raspberry Pi OS to the latest and greatest:

```shell
sudo apt-get update -y && sudo apt upgrade -y
```

## Installing Tor

Tor, short for The Onion Router is software for enabling anonymous communication. It directs Internet traffic through a free, worldwide, volunteer overlay network, consisting of more than seven thousand relays, to conceal a user’s location and usage from anyone performing network surveillance or traffic analysis.

Tor is a great service to promote privacy and censorship resistance.  These goals align directly with the Bitcoin network.

By running Bitcoin over Tor, you get the following benefits:

- It hides your IP address from the world.
- You don’t need to worry about setting up firewall port forwarding.
- Promotes privacy for others to connect into your node anonymously.

So, the first thing we‘ll do is to install Tor

```shell
sudo apt install tor -y
```

Once this has been installed, you should be able to query the tor service to check its status:

```shell
sudo systemctl status tor
```

You’ll see something like this, verifying that it’s active:

```shell
● tor.service - Anonymizing overlay network for TCP (multi-instance-master)
     Loaded: loaded (/lib/systemd/system/tor.service; enabled; vendor preset: enabled)
     Active: active (exited) since Sat 2022-08-20 18:57:18 CEST; 15s ago
    Process: 8653 ExecStart=/bin/true (code=exited, status=0/SUCCESS)
   Main PID: 8653 (code=exited, status=0/SUCCESS)
        CPU: 3ms
```

Also you should see that port 9050 is listening for incoming connections to proxy for the local loopback address:

```shell
netstat -an | grep 9050
```

You’ll see this:

```shell
tcp        0      0 127.0.0.1:9050          0.0.0.0:*               LISTEN
```

We will be setting up Bitcoin Core to run as a hidden service to allow incoming connections. So, we need to enable the Tor control port in the Tor configuration file.

```shell
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

```shell
ls -al /run/tor/
```

You’ll get:

```shell
total 8
drwxr-sr-x  2 debian-tor debian-tor 120 Aug 16 22:28 .
drwxr-xr-x 25 root       root       740 Aug 16 22:09 ..
srw-rw----  1 debian-tor debian-tor   0 Aug 16 22:28 control
-rw-r-----  1 debian-tor debian-tor  32 Aug 16 22:27 control.authcookie
srw-rw-rw-  1 debian-tor debian-tor   0 Aug 16 22:28 socks
-rw-r--r--  1 debian-tor debian-tor   5 Aug 16 22:27 tor.pid
```

So we need to add the satoshi user to the `debian-tor` group, like so:

```shell
sudo usermod -a -G debian-tor satoshi
```

If you now do `id satoshi`, you should see that it belongs to the debian-tor group:

```shell
uid=1000(satoshi) gid=1000(satoshi) groups=1000(satoshi),4(adm),20(dialout),24(cdrom),27(sudo),29(audio),44(video),46(plugdev),60(games),100(users),104(input),106(render),108(netdev),999(spi),998(i2c),997(gpio),114(debian-tor)
```

## Setting up the external hard drive

The bitcoin block chain will be stored on the external hard drive, so let’s set that up that next.

Given that the hard drive is physically connected to the Raspberry Pi, we can look for it with

```shell
sudo fdisk -l
```

In my case, it’s `/dev/sda`.

First, we need to create a new file system. Since we’re only going to access the data through the Raspberry Pi, we can use [ext4](https://en.wikipedia.org/wiki/Ext4). Do note that any existing data on the drive will be erased.

```shell
sudo mkfs.ext4 /dev/sda
```

Let’s mount it manually:

```shell
sudo mkdir /media/ssd
sudo chown satoshi /media/ssd/bitcoin
sudo mount /dev/sda /media/ssd
```

We’d like the hard drive to automatically be mounted when the Raspberry Pi boots. To fix that, copy the `UUID` from the command `sudo blkid`

Now, let’s add the following line to `sudo nano /etc/fstab`, replacing `<UUID>` below with your value:

```
UUID=<UUID> /media/ssd ext4 defaults,auto,users,rw,nofail 0 0
```

## Bitcoin Core

Finally, we’re ready to install Bitcoin Core. You have two options. Either you can download the binaries, or you can build them yourself from source. This article covers the first option.

### Download

Go to <https://bitcoincore.org/en/download/> and choose the corresponding ARM Linux 64-bit download link. Then, download it with `wget`:

```shell
wget https://bitcoincore.org/bin/bitcoin-core-23.0/bitcoin-23.0-aarch64-linux-gnu.tar.gz
```

### Verify

Start by downloading the SHA256 binary hashes and hash signatures found on the [download page](https://bitcoincore.org/en/download/):

```shell
wget https://bitcoincore.org/bin/bitcoin-core-23.0/SHA256SUMS

wget https://bitcoincore.org/bin/bitcoin-core-23.0/SHA256SUMS.asc
```

1. Verify that the checksum of the release file is listed in the checksums file using the following command:

    ```shell
    sha256sum --ignore-missing --check SHA256SUMS
    ```

    In the output produced by the above command, you can safely ignore any warnings and failures, but you must ensure the output lists “OK” after the name of the release file you downloaded. For example: `bitcoin-23.0-aarch64-linux-gnu.tar.gz: OK`

1. Bitcoin releases are signed by a number of individuals, each with a unique public key. In order to recognise the validity of signatures, you must use GPG to load these public keys locally. You can find many developer keys listed in the bitcoin/bitcoin repository, which you can then load into your GPG key database.

    For example, given the [builders-key/keys.txt](https://github.com/bitcoin/bitcoin/tree/master/contrib/builder-keys/keys.txt) line `E777299FC265DD04793070EB944D35F9AC3DB76A Michael Ford (fanquake)` you could load that key using this command:

    ```shell
    gpg --keyserver hkps://keys.openpgp.org --recv-keys E777299FC265DD04793070EB944D35F9AC3DB76A
    ```

    The output of the command above should say that one key was imported, updated, has new signatures, or remained unchanged.

1. It is recommended that you choose a few individuals from this list who you find trustworthy and import their keys as above, or import all the keys per the instructions in the [contrib/builder-key README](https://github.com/bitcoin/bitcoin/tree/master/contrib/builder-keys). You will later use their keys to check the signature attesting to the validity of the checksums you use to check the binaries.

    Verify that the checksums file is PGP signed by the release signing key:

    ```shell
    gpg --verify SHA256SUMS.asc
    ```

    The command above will output a series of signature checks for each of the public keys that signed the checksums. Each signature will show the following text:

    A line that starts with: `gpg: Good signature`

    A complete line saying: Primary key fingerprint: `E777 299F C265 DD04 7930  70EB 944D 35F9 AC3D B76A`

    The output from the verify command may contain warnings that the “key is not certified with a trusted signature.” This means that to fully verify your download, you need to confirm that the signing key’s fingerprint (e.g. `E777 299F…` .) listed in the second line above matches what you had expected for the signers public key.

### Install

```shell
tar xvf bitcoin-23.0-aarch64-linux-gnu.tar.gz

sudo install -m 0755 -o root -g root -t /usr/local/bin bitcoin-23.0/bin/*
```

### Configure

Let’s create a configuration file to let Bitcoin Core to use Tor:

```shell
sudo mkdir /media/ssd/bitcoin
sudo nano /media/ssd/bitcoin/bitcoin.conf
```

Enter the following text, exit and save the file:

```
proxy=127.0.0.1:9050
listen=1
debug=tor
```

This is what is being configured:

- `proxy`: Sets the proxy server to point localhost on port 9050. This proxy server will be used to try to reach .onion addresses as well.
- `listen`: We want to enable listening for incoming connections, as this is off by default behind a proxy.
- `debug`: We set debug to tor get additional information in the debug log about our Tor configuration.

### Run

If everything is working as expected, you should be able to run

```shell
bitcoind -version

Bitcoin Core version v23.0.0
```

and

```shell
bitcoin-cli -version

Bitcoin Core RPC client version v23.0.0
```

Since we’re using the Raspberry Pi as a dedicated Bitcoin full node, we‘ll want the daemon to start whenever the machine boots.

To do so, edit your crontab by running the following command:

```shell
crontab -e
```

And append the following:

```
@reboot /usr/local/bin/bitcoind -daemon -datadir=/media/ssd/bitcoin
```

Save the file and exit. Now the bitcoin daemon will start whenever your system boots.

## Reboot and check that everything works

Finally, restart the computer with `sudo reboot` and reconnect with SSH after a few seconds.

First, let’s test that Tor is up and running:

```shell
sudo systemctl status tor@default.service
```

And that the hard drive has been mounted correctly:

We can verify that it has been mounted correctly:

```shell
df -h | grep /media/ssd
/dev/sda        916G   24M  870G   1% /media/ssd
```

And Bitcoin Core should now also be running:

```shell
tail -f /media/ssd/bitcoin/debug.log
```

You should see that it’s using Tor, a line like this:

```shell
tor: Got service ID XXXXXXXXXX, advertising service XXXXXXXX.onion:8333
```

This means that the service was able to be configured and is up and running.

## Aliases for using bitcoin-cli

Since we need to specify `-datadir=/media/ssd/bitcoin` every time we want to run commands with `bitcoin-cli`, it makes sense to make a couple of alises in `.bashrc`:

```shell
nano ~/.bashrc
```

and then append these two lines:

```shell
alias bitcoin-cli='bitcoin-cli -datadir=/media/ssd/bitcoin'
```

Save the file, then run:

```shell
source ~/.bashrc
```

## Initial block download

The blockchain will now sync all the way back to the first block in 2009, so this will take some time given that it’s close to 500 GB. Your node will download all blocks and all transactions and verify them.
