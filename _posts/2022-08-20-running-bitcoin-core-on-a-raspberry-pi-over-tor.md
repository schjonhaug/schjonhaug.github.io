---
layout: post
title:  "Running Bitcoin Core on a Raspberry Pi"
date:   2022-08-20 21:48:21 +0200
categories: bitcoin
---
![Raspberry Pi 4 Model 4](/assets/raspberry-pi-4-model-b.jpg)

This article will describe how to get [Bitcoin Core](https://bitcoincore.org) full node up and running on a [Raspberry Pi 4 Model B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/). To store the blockchain (which currently is close to 500 GB), I’m using a 1 TB SSD.

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

```bash
ssh satoshi@bitcoin.local
```

You’ll get a warning saying that “the authenticity of host bitcoin.local” can't be established. Type “yes” and press enter. Then you’ll enter your password that you set up earlier.

Start by updating the Raspberry Pi OS to the latest and greatest:

```bash
sudo apt-get update -y && sudo apt upgrade -y
```

## Setting up the external hard drive

The bitcoin block chain will be stored on the external hard drive, so let’s set that up that next.

Given that the hard drive is physically connected to the Raspberry Pi, we can look for it with

```bash
sudo fdisk -l
```

In my case, it’s `/dev/sda`.

First, we need to create a new file system. Since we’re only going to access the data through the Raspberry Pi, we can use [ext4](https://en.wikipedia.org/wiki/Ext4). Do note that any existing data on the drive will be erased.

```bash
sudo mkfs.ext4 /dev/sda
```

Let’s mount it manually:

```bash
sudo mkdir /media/ssd/bitcoin
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

```bash
wget https://bitcoincore.org/bin/bitcoin-core-23.0/bitcoin-23.0-aarch64-linux-gnu.tar.gz
```

### Verify

Start by downloading the SHA256 binary hashes and hash signatures found on the [download page](https://bitcoincore.org/en/download/):

```bash
wget https://bitcoincore.org/bin/bitcoin-core-23.0/SHA256SUMS

wget https://bitcoincore.org/bin/bitcoin-core-23.0/SHA256SUMS.asc
```

1. Verify that the checksum of the release file is listed in the checksums file using the following command:

    ```bash
    sha256sum --ignore-missing --check SHA256SUMS
    ```

    In the output produced by the above command, you can safely ignore any warnings and failures, but you must ensure the output lists “OK” after the name of the release file you downloaded. For example: `bitcoin-23.0-aarch64-linux-gnu.tar.gz: OK`

1. Bitcoin releases are signed by a number of individuals, each with a unique public key. In order to recognise the validity of signatures, you must use GPG to load these public keys locally. You can find many developer keys listed in the bitcoin/bitcoin repository, which you can then load into your GPG key database.

    For example, given the [builders-key/keys.txt](https://github.com/bitcoin/bitcoin/tree/master/contrib/builder-keys/keys.txt) line `E777299FC265DD04793070EB944D35F9AC3DB76A Michael Ford (fanquake)` you could load that key using this command:

    ```bash
    gpg --keyserver hkps://keys.openpgp.org --recv-keys E777299FC265DD04793070EB944D35F9AC3DB76A
    ```

    The output of the command above should say that one key was imported, updated, has new signatures, or remained unchanged.

1. It is recommended that you choose a few individuals from this list who you find trustworthy and import their keys as above, or import all the keys per the instructions in the [contrib/builder-key README](https://github.com/bitcoin/bitcoin/tree/master/contrib/builder-keys). You will later use their keys to check the signature attesting to the validity of the checksums you use to check the binaries.

    Verify that the checksums file is PGP signed by the release signing key:

    ```bash
    gpg --verify SHA256SUMS.asc
    ```

    The command above will output a series of signature checks for each of the public keys that signed the checksums. Each signature will show the following text:

    A line that starts with: `gpg: Good signature`

    A complete line saying: Primary key fingerprint: `E777 299F C265 DD04 7930  70EB 944D 35F9 AC3D B76A`

    The output from the verify command may contain warnings that the “key is not certified with a trusted signature.” This means that to fully verify your download, you need to confirm that the signing key’s fingerprint (e.g. `E777 299F…` .) listed in the second line above matches what you had expected for the signers public key.

### Install

```bash
tar xvf bitcoin-23.0-aarch64-linux-gnu.tar.gz

sudo install -m 0755 -o root -g root -t /usr/local/bin bitcoin-23.0/bin/*
```

### Configure

Let’s create a configuration file to let Bitcoin Core to use Tor:

```bash
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

```bash
bitcoind -version

Bitcoin Core version v23.0.0
```

and

```bash
bitcoin-cli -version

Bitcoin Core RPC client version v23.0.0
```

Since we’re using the Raspberry Pi as a dedicated Bitcoin full node, we‘ll want the daemon to start whenever the machine boots.

To do so, edit your crontab by running the following command:

```bash
crontab -e
```

And append the following:

```
@reboot /usr/local/bin/bitcoind -daemon -datadir=/media/ssd/bitcoin
```

Save the file and exit. Now the bitcoin daemon will start whenever your system boots.

## Reboot and check that everything works

Finally, restart the computer with `sudo reboot` and reconnect with SSH after a few seconds.

And that the hard drive has been mounted correctly:

We can verify that it has been mounted correctly:

```bash
df -h | grep /media/ssd
/dev/sda        916G   24M  870G   1% /media/ssd
```

And Bitcoin Core should now also be running:

```bash
tail -f /media/ssd/bitcoin/debug.log
```

## Aliases for using bitcoin-cli

Since we need to specify `-datadir=/media/ssd/bitcoin` every time we want to run commands with `bitcoin-cli`, it makes sense to make a couple of alises in `.bash_aliases`:

```bash
nano ~/.bash_aliases
```

and then append this line:

```bash
alias bitcoin-cli='bitcoin-cli -datadir=/media/ssd/bitcoin'
```

Save the file, then run:

```bash
source ~/.bashrc
```

## Bash completion

It quickly gets tedious to write the various bitcoin-cli commands. To help with autocompletion, a bash completion scripts are available for both [bitcoind](https://github.com/bitcoin/bitcoin/blob/master/contrib/bitcoind.bash-completion) and [bitcoin-cli](https://github.com/bitcoin/bitcoin/blob/master/contrib/bitcoin-cli.bash-completion). Let’s download them:

```bash
wget https://raw.githubusercontent.com/bitcoin/bitcoin/master/contrib/bitcoind.bash-completion

wget https://raw.githubusercontent.com/bitcoin/bitcoin/master/contrib/bitcoin-cli.bash-completion
```

To figure out where to put them, we can run:

```bash
pkg-config --variable=completionsdir bash-completion
```

returning, `/usr/share/bash-completion/completions`. So, let’s move them there:

```bash
sudo mv *.bash-completion /usr/share/bash-completion/completions
```

## Initial block download

The blockchain will now sync all the way back to the first block in 2009, so this will take some time given that it’s close to 500 GB. Your node will download all blocks and all transactions and verify them.

To check on the process, run

```bash
bitcoin-cli -getinfo

Chain: main
Blocks: 620898
Headers: 750609
Verification progress: ▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░ 67.4104%
Difficulty: 15486913440292.87

Network: in 0, out 10, total 10
Version: 230000
Time offset (s): -7
Proxies: 127.0.0.1:9050 (ipv4, ipv6, cjdns)
Min tx relay fee rate (BTC/kvB): 0.00001000
```
