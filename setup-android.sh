#!/bin/bash
# ==============================================================================
# STARK INDUSTRIES // ON-DEVICE J.A.R.V.I.S. INSTALLER (ANDROID TERMUX)
# ==============================================================================
clear
echo -e "\e[36m====================================================\e[0m"
echo -e "\e[1m\e[33m   STARK INDUSTRIES // J.A.R.V.I.S. ANDROID SETUP   \e[0m"
echo -e "\e[36m====================================================\e[0m"

echo -e "\e[34m[*] Step 1/4: Installing Node.js & Termux API tools...\e[0m"
pkg install -y nodejs termux-api curl

echo -e "\e[34m[*] Step 2/4: Configuring Termux for WhatsApp media sharing...\e[0m"
mkdir -p ~/.termux
if ! grep -q "allow-external-apps = true" ~/.termux/termux.properties 2>/dev/null; then
  echo "allow-external-apps = true" >> ~/.termux/termux.properties
fi
termux-reload-settings 2>/dev/null || true

echo -e "\e[34m[*] Step 3/4: Requesting storage permissions...\e[0m"
termux-setup-storage

echo -e "\e[34m[*] Step 4/4: Downloading On-Device JARVIS Voice Engine...\e[0m"
curl -sL "https://raw.githubusercontent.com/sachin-lolariya/template-to-sell/main/voice-jarvis.js" -o ~/voice-jarvis.js
chmod +x ~/voice-jarvis.js

echo -e "\n\e[32m[✔] J.A.R.V.I.S. VOICE ASSISTANT INSTALLED!\e[0m"
echo -e "\e[33mStarting JARVIS live on your phone right now...\e[0m\n"

node ~/voice-jarvis.js
