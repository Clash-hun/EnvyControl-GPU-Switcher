# 🎛️ EnvyControl Cinnamon Applet

⚠️ **Requirement:** This applet depends on [EnvyControl](https://github.com/bayasdev/envycontrol).  
Please make sure you have EnvyControl installed and working on your system before using this applet.

---

## 📌 About

The **EnvyControl Cinnamon Applet** provides a simple graphical interface in your Cinnamon panel to switch between GPU modes on Nvidia Optimus laptops.  
Instead of typing commands in the terminal, you can change modes with just a couple of clicks.

This applet queries the current GPU mode via EnvyControl and updates its tray icon accordingly.  
You can then switch between **Integrated**, **Hybrid**, and **Nvidia** modes directly from the panel menu.

<div>
  <img src="nvidia-and-gm-partnership-lockup-v-on-dark-ari.png" alt="nvidia-intel" />
</div>


---

## 🖼️ Features

- 🖥️ **Dynamic tray icon** that reflects the current GPU mode  
- 📋 **Right-click menu** to select between modes  
- 🔄 **Automatic refresh** of the icon after switching  
- 🔐 Uses `pkexec` to request privileges when switching modes  

---

## 🎨 GPU Modes Explained

### 🔵 Integrated Mode (Intel/AMD iGPU)
- Uses only the integrated GPU (Intel or AMD).  
- ✅ Lowest power consumption, best for battery life.  
- ❌ External monitors connected to the Nvidia GPU ports will not work.  
- Icon: ![Integrated](icons/intel.png)

---

### 🟣 Hybrid Mode (PRIME Offloading)
- Enables **PRIME render offloading**.  
- ✅ Balanced: iGPU handles most tasks, dGPU powers up only when needed.  
- ✅ Supports RTD3 power management (turns off Nvidia GPU dynamically).  
- ⚠️ Slightly higher power usage than Integrated.  
- Icon: ![Hybrid](icons/hybrid.png)

---

### 🟢 Nvidia Mode (dGPU Only)
- Uses the dedicated Nvidia GPU exclusively.  
- ✅ Maximum performance for gaming, 3D, and CUDA workloads.  
- ✅ Recommended when using external monitors connected to Nvidia ports.  
- ❌ Higher power consumption.  
- Icon: ![Nvidia](icons/nvidia.png)

---

## 🚀 Installation

1. Install **EnvyControl** on your system by following the instructions here:  
   👉 [EnvyControl Official Repository](https://github.com/bayasdev/envycontrol)

2. Clone this repository into your Cinnamon applets directory:
   ```bash
   git clone https://github.com/yourusername/envycontrol@clash.git ~/.local/share/cinnamon/applets/envycontrol@clash

---

## ☕ Support Me

If you find these scripts helpful, consider buying me a coffee! ☕

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-%23FFDD00.svg?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://paypal.me/clash2un?country.x=HU&locale.x=hu_HU)

---
