---
title: Back up your data
category: Looking after the system
order: 1
summary: Take a safe backup in one click, and keep a copy somewhere other than this computer.
---

Open **Administration → Backup and maintenance**.

![Backup and maintenance](/img/backup.png "Press Backup now. Existing backups are listed with their size and date.")

1. Press **Backup now**.
2. When it finishes, the backup appears in the list with its **File**, **Size** and **Created** time.

A backup is a normal SQL Server backup of the Weighbridge database. It is safe to run any time, even during work, and it doesn't disturb any other backup schedule on the computer.

:::warn
The file is written to SQL Server's own backup folder **on this computer**. If the computer or its disk fails, that copy goes with it. Copy backups to a USB drive or cloud storage regularly, for example weekly and before every update.
:::

## Restoring

A restore is done by Mochan Labs or your IT person with SQL Server tools. Send the backup file to [support](/support/) if you need help.
