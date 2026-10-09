---
title: Weighbridge and COM port
category: Setup
order: 2
summary: Connect the weighing indicator so live weight appears on the Token page.
---

The indicator sends the weight to the computer through a serial (COM) port or a USB-to-serial adapter. Open **Administration → Weighbridge and COM port**.

![Weighbridge and COM port](/img/device.png "Choose the port, then check Live status.")

## Steps

1. Connect the indicator to the computer. If you use a USB adapter, plug it in.
2. Open the page and press **Rescan**. Each port is listed with its description (for example *USB Serial Port (COM3)*) so you can tell which one is the indicator.
3. Choose the **COM Port**. Set **Baud rate**, **Data bits**, **Parity**, **Stop bits** and **Flow control** to match the indicator's own settings. The common values are 9600, 8, None, One, None.
4. Set the **Frame delimiter** and **Parser** that match your indicator brand (the manual or Mochan Labs will tell you).
5. Press **Test Connection**, then **Save**. **Live status** should say **Connected**.

The **Recent raw frames** panel shows exactly what the indicator is sending. It is the quickest way to see if the settings are right. If you see garbled text, the baud rate or parity is wrong. If you see nothing, check the cable and the port.

:::note
**Using simulator (no hardware required)** is for training and demos only. Turn it off on a real weighbridge.
:::

:::tip
Don't have the indicator for a while? Users with the *Approve override* permission can enter the weight manually (with a reason). See [Weigh a vehicle](/weigh/).
:::
