---
title: Bill a sale
category: Daily work
order: 2
summary: Complete billing for vehicles that have been weighed out — rates, GST, charges and round-off.
---

After a loaded vehicle is exited on the Token page it appears on **Weighment → Sale (Outward)** under **Ready for billing**.

![Sale page with a vehicle ready for billing](/img/sale.png "Vehicles ready for billing on top, previous receipts below.")

## Steps

1. Find the vehicle and press **Complete billing**.
2. Pick the **Sale Type** (Cash or Credit) and the **Party**. A party you pick here is used for the bill and the receipts.
3. Check the **line items**. The material, its rate and the quantity come in by themselves. Add more lines if the vehicle carried more than one item.
4. Check the charges (Freight, Kaanta, Daala, Incentive). **Tax** and **Round Off** are calculated for you.
5. Press **Complete sale**. The receipts are ready to print straight away.

![The Complete Sale dialog](/img/sale-billing.png "Net weight 31,400 kg becomes 314 Qtl; rate × quantity gives the amount, and GST is added automatically.")

## How the amounts work

- **Quantity** is the net weight in your billing unit (see [Printer and slip layout](/printer/)). The scale always measures in kg. If your unit is Qtl, 31,400 kg is billed as 314 Qtl.
- **Rate** is the party's own rate if one is set in [Parties and party rates](/parties/); otherwise the material's standard rate.
- **Disc / Qtl** is a deduction per quintal that comes off the rate.
- **Tax** is each line's taxable amount × that material's GST % ([Materials](/materials/)). You can overwrite the figure if you must.
- **Round Off** brings the total to a whole rupee. It is shown on the invoice.

:::tip
Set a party's rates once in **Party Rates** and every future sale to that party fills in correctly with no typing.
:::

## Bill numbers

By default the bill number is the token number. If you want invoice-style numbers (for example `INV/0001`), turn on a bill-number series in [Workflow settings](/workflow/#sale-bill-numbers).

## Find an earlier sale

**Previous receipts** at the bottom lists the last 15 sales. Search by sale number or vehicle number, and press **Weight slip** or **Tax invoice** to print again. See [Print and reprint receipts](/receipts/).
