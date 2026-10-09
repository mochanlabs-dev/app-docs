---
title: Sync status
category: Reports & records
order: 2
summary: See what has gone to Tally and the government portal, what is waiting, and what failed and why.
---

Open **Reports → MDTSS Sync Status**. It covers both Tally and the government portal.

![Sync status](/img/sync-status.png "Totals on top; anything that failed is listed with the reason and a Retry button.")

## The totals

One row per kind of message (**Tally.PostVoucher**, **Government.SubmitWeighment**) and status:

| Status | Meaning |
|---|---|
| **Pending** | Waiting its turn. It will be sent automatically. |
| **Sent** | Delivered. |
| **Failed** | It didn't work this time (for example Tally was closed). **It retries on its own.** |
| **Dead-lettered** | It kept failing and stopped retrying. Fix the cause, then press **Retry**. |

## Needs attention

Each problem entry shows **What** (for example *Tally.PostVoucher — Sale 6*), **Status**, **Tries**, **Next try** and the **Reason** in plain words. The reason tells you what to fix, such as *No connection could be made to localhost:9000* (Tally isn't open or the port is wrong).

1. Fix the cause (open Tally, correct the port, restore internet).
2. Press **Retry** on one entry, or **Retry all**.

Nothing is lost while something is down. Entries wait until they can be sent.

:::tip
The **Tally Sync** and **Govt Sync** buttons in the top bar also tell you the result as soon as you press them.
:::
