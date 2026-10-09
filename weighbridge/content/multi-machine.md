---
title: Use more than one computer
category: Looking after the system
order: 4
summary: Let a manager's PC and an operator's PC share the same data — one Server, any number of Clients.
---

If more than one computer needs the same data (for example the weighbridge computer and an office PC), one computer is the **Server** and holds the database. Every other computer is a **Client** that connects to it. A site with one computer needs nothing here: it is already a Server.

Open **Administration → Multi-machine setup**. The in-app **Setup guide (PDF)** shows the same steps.

![Multi-machine setup](/img/deployment.png "On the Server: its database, address and a pairing code for each client.")

## On the Server computer

1. Choose **Server**. It shows **Ready for Client connections** with the **database name**, **IP addresses** and **port** (normally 1433).
2. Press **Generate pairing code**. It is the only thing you have to type on the other computer.

## On each Client computer

1. Install Weighbridge and [activate](/activate/) it.
2. Open **Multi-machine setup**, choose **Client** and enter the pairing code.
3. **Save** and restart the app. It now uses the Server's data.

:::note
Saving takes effect after a restart. This changes which database the whole app uses, so don't do it in the middle of weighing.
:::

:::warn
The Server computer must be on for the Clients to work. Keep its [backups](/backups/) current.
:::
