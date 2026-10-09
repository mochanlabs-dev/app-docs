---
title: Tally
category: Integrations
order: 1
summary: Post every sale and purchase to Tally automatically, and see exactly why when it can't.
---

Weighbridge posts a voucher to Tally for each completed sale and purchase. If a customer or material is new to Tally, it is created there the first time it's billed. You don't set up the chart of accounts by hand.

## Connect

Open **Administration → Tally setup**. The in-app **Setup guide (PDF)** walks through both sides.

![Tally setup](/img/tally.png "Connection and ledger names.")

1. In Tally, open the company you want and turn on its connection for other software (the HTTP gateway). Note the **port** Tally listens on.
2. In Weighbridge, enter **Host / IP** (`localhost` if Tally is on this computer) and the **Port**. The default is 9000, but a Tally installation may use another number. Use the one Tally shows.
3. Enter the **Company name in Tally** exactly as Tally spells it, then the **GSTIN** and the names of your **Sales**, **Purchase** and **GST** ledgers.
4. Press **Save**, then **Test Connection**. This checks that Weighbridge can reach Tally.
5. Switch on **Posting real vouchers to Tally**.

:::warn
The company name must match Tally **exactly**. Tally refuses a voucher for a company name it doesn't recognise.
:::

## Syncing

- Vouchers are sent in the background automatically.
- **Tally Sync** (top bar) and **Sync Now** (this page) send everything waiting right away, and tell you the result: how many were sent, or why nothing could be, such as *Tally isn't reachable*.
- If Tally was closed, nothing is lost. Entries wait and are retried. See [Sync status](/sync-status/) for the list and reasons.

The quantity and unit sent to Tally follow the unit you chose in [Printer and slip layout](/printer/).
