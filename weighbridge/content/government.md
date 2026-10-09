---
title: Government portal (MDTSS)
category: Integrations
order: 2
summary: Send each weighment to the Uttarakhand MDTSS portal, with test mode and automatic retries.
---

If your weighbridge must report to the Uttarakhand **MDTSS** portal, Weighbridge sends each weighment for you, always with the weight in **kilograms**.

## Set up

The department issues credentials for each weighbridge: an **API key**, a **weighbridge number (WBNo)**, a **Lessee ID** and a **refresh token**. Open **Administration → MDTSS govt portal**.

![MDTSS settings](/img/mdtss.png "Credentials issued by the department. The switch at the top controls whether anything is really sent.")

1. Enter the **API key**, **Weighbridge Number (WBNo)**, **Lessee ID** and **Refresh token**. Leave the **Base URL** and **Refresh token path** as they are unless the department tells you otherwise.
2. Press **Save**.
3. Scroll to **Send Test Submission**, fill in a test vehicle and weights and press the button. It sends a made-up ticket, not tied to any real weighment. You can repeat it safely while you sort out credentials.
4. When the test is accepted, switch on submission at the top (the label changes from *Not submitting to MDTSS (logged only)*).

:::note
While submission is off, weighments are only **logged**. Nothing reaches the portal. Turn it on only once the test works.
:::

## Day to day

- Sending happens in the background after each weighment.
- **Govt Sync** (top bar) sends anything waiting right now.
- If the portal or internet is down, weighments wait and retry. See [Sync status](/sync-status/) to review them.
