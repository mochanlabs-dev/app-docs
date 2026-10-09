---
title: Install Weighbridge
category: Start here
order: 1
summary: Two steps — SQL Server Express, then the Weighbridge installer. Windows 10 or 11.
---

## What you need

- A Windows 10 or 11 computer (64-bit) on the weighbridge.
- Internet **once**, to download SQL Server Express. After that the app works offline (it only needs the internet to check its license and update itself).
- The Weighbridge installer file from Mochan Labs: `Weighbridge-Setup-x.y.z.exe`.
- Administrator rights on the computer.

## Steps

1. **Install SQL Server Express.** Download it from Microsoft, run it and choose **Basic**. Accept the defaults and let it finish completely.
2. **Run the Weighbridge installer.** Accept the one administrator prompt (Windows UAC). It finds SQL Server by itself and sets up the starting database. There is nothing to type.
3. **Open Weighbridge** from the desktop or Start menu. Continue with [Activate your license](/activate/).

:::tip
Already have SQL Server 2016 or newer on this computer for another reason? Skip step 1. The installer detects it.
:::

:::note
If SQL Server isn't found, the installer says so and stops without installing half a system. Install SQL Server, then run the installer again. It is always safe to run it again, and it **never overwrites an existing database**.
:::

## Upgrading

Don't uninstall. Either let the app update itself ([Update the app](/updates/)) or run the newer installer over the old one. Your data stays.

## Installing on more than one computer

Install Weighbridge on each computer, then link them with [Use more than one computer](/multi-machine/).
