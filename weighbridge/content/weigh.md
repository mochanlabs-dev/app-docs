---
title: Weigh a vehicle
category: Daily work
order: 1
summary: Record the first weight when a vehicle arrives and the second when it leaves, on the Token page.
---

Every weighing starts and ends on the **Token** page. The big panel at the top shows the live weight from the scale, and it only lets you save once the weight is **stable**.

## 1. New entry (first weight)

1. Open **Weighment → Token** and choose **New Entry**.
2. Type the **Vehicle number**. If the vehicle has an RFID tag, it fills in by itself when the vehicle reaches the scale.
3. Choose the **Material**. **Party**, **Driver** and **Place** are optional. They can be added at billing.
4. Wait for **Create token at …**, then press it.

![New entry on the Token page](/img/token-entry.png "Enter the vehicle and material, then create the token once the weight is stable.")

:::tip
If a vehicle's empty weight is saved in the [Vehicles](/vehicles/) master, a **Known tare** hint appears. You can use it instead of weighing the empty vehicle. This only appears if the *Known-tare shortcut* is on in [Workflow settings](/workflow/).
:::

## 2. Exit (second weight)

When the vehicle comes back across the scale:

1. Choose **Exit**.
2. Pick the vehicle's token from the list (the entry weight is shown next to it).
3. Press the save button once the weight is stable.

![Exit on the Token page](/img/token-exit.png "Pick the open token, then save the second weight.")

**Weighbridge decides what it was:**

| Exit weight is… | It's a… | Next step |
|---|---|---|
| **Heavier** than entry (loaded on site) | **Sale** | [Bill a sale](/sell/) |
| **Lighter** than entry (unloaded on site) | **Purchase** | [Record a purchase](/purchase/) |

## If the scale is not available

If the scale or indicator is down, users with the **Approve override** permission can tick **Enter weight manually**, type the weight and a **reason**. The reason is saved on the weighment and in the audit log, so use it only when you must.

:::warn
Weights on slips come from the scale. Manual weights are marked and recorded, so use them only when you have no other option.
:::

## Vehicle photos

If cameras are set up ([Cameras and RFID](/cameras-rfid/)), the page asks for the vehicle photos before it lets you save. With no cameras configured, it says **No cameras are configured**, and photos aren't needed.

## A vehicle left without finishing?

Open tokens stay in the **Exit** list and on the dashboard (**Open tokens**) until they are exited. Nothing is lost.
