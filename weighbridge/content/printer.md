---
title: Printer and slip layout
category: Setup
order: 6
summary: Paper size, copies, the weight unit, and the wording printed on slips and invoices.
---

Open **Administration → Printer and slip layout**.

![Printer and slip layout](/img/printer.png "Paper, copies per sheet and the unit used on slips, invoices and billing.")

## Paper

| Choice | Use it for |
|---|---|
| **Normal sheet (A4 / Letter)** | Any ordinary printer. The **Print** button opens the usual Windows print dialog. |
| **Thermal receipt roll, 80 mm or 58 mm** | A receipt printer. Pick the **Thermal printer** from the list and receipts print straight to it, with no dialog. |

On A4, **Copies per sheet** sets how many copies sit side by side (2 gives two copies on a landscape sheet).

:::note
Thermal printing straight to the printer works in the installed Weighbridge app. In a plain browser tab, the normal print dialog is used.
:::

## Unit for slips, invoices and billing

Choose **Kilograms**, **Quintals (1 Qtl = 100 kg)** or **Tonnes (1 t = 1000 kg)**.

This changes only **how weights are shown and billed**: on slips, on invoices, in the quantity filled in at billing, and in the quantity sent to Tally. The weighbridge always measures and stores kilograms, and the government portal always receives kilograms.

:::warn
Set the unit **before** you start billing and keep it. Rates are per this unit. A rate of 70 per Qtl billed in kg would be wrong by 100 times.
:::

## Wording

| Field | Where it prints |
|---|---|
| **Show the weight unit on printed slips** | Heading of the weight column, for example *Weight (Qtl)*. |
| **Footer note** | Bottom of every slip. |
| **Weight slip terms** | The numbered notes at the foot of the slip. |
| **Invoice tagline** | Under the company address on the tax invoice. |
| **Invoice terms** | The terms at the foot of the tax invoice. |
| **Vehicle photos on slip** | Whether vehicle photos are printed on the slip. |

Press **Save**. See the results in [Print and reprint receipts](/receipts/).
