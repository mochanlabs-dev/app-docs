---
title: Workflow settings
category: Setup
order: 8
summary: Turn optional features on or off, set default rates, and choose how sale bills are numbered.
---

Open **Administration → Workflow configuration**. Everything is optional. Turning a switch off never deletes anything already entered or billed. It changes what happens from then on.

![Workflow configuration](/img/workflow.png "Switches for optional features, then default rates below.")

## Weighing and masters

| Switch | What it does |
|---|---|
| **Dual-location weighing (River + Factory)** | Adds a second weight field on Purchase, for material that arrives with a weight from the point of extraction. |
| **Known-tare shortcut on Token entry** | Suggests a vehicle's saved empty weight. |
| **Owner + PAN on vehicles** | Shows owner and PAN on the vehicle master and fills them in for known vehicles. |
| **Production / conversion tracking** | Adds a **Production** screen for sites that convert raw material (for example boulders into graded stone). Leave off if you don't need it. |

## Default rates for billing

Further down the page, set the figures that Purchase and Sale billing fill in for you: **GST**, **Income Tax**, **Transit fee**, **GST on transit**, **Permit fee**, and **Royalty** GST % and rate; and, for sales, default **Freight**, **Tax % (fallback)**, **Kaanta**, **Daala**, **Incentive** and **Round Off**. Your accountant can tell you the right values.

## Sale bill numbers

By default a sale's bill number is its token number. To use invoice-style numbers instead:

1. Turn on **Use a bill-number series for sales**.
2. Set an optional **Prefix** (for example `INV/`) and **Digits** (zero-padding, so 12 becomes `0012`).
3. Use **Start / change next number to** to set where numbering continues. Leave it blank to carry on.
4. Optional: **Only number sales that charge GST** keeps the series free of non-GST sales.
5. Save.

:::note
The number is given when the sale is completed, one after another, so two sales billed at the same moment never get the same number.
:::
