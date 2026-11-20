#!/bin/bash
# ==============================================================================
# STARK INDUSTRIES // J.A.R.V.I.S. ANDROID INSTALLER (OPTION 1)
# ==============================================================================
clear
echo -e "\e[36m====================================================\e[0m"
echo -e "\e[1m\e[33m   STARK INDUSTRIES // J.A.R.V.I.S. ANDROID SETUP   \e[0m"
echo -e "\e[36m====================================================\e[0m"

echo -e "\e[34m[*] Step 1/3: Updating Termux packages...\e[0m"
pkg update -y && pkg upgrade -y

echo -e "\e[34m[*] Step 2/3: Installing Node.js and Termux API tools...\e[0m"
pkg install -y nodejs termux-api curl

echo -e "\e[34m[*] Step 3/3: Downloading JARVIS Mobile Client...\e[0m"
curl -sL "https://avengers-doomsday-countdown-pmk3.netlify.app/jarvis-client.js" -o ~/jarvis-client.js
chmod +x ~/jarvis-client.js

echo -e "\n\e[32m[✔] J.A.R.V.I.S. MOBILE NODE INSTALLED SUCCESSFULLY!\e[0m"
echo -e "\e[33mTo run your phone node anytime, simply execute:\e[0m"
echo -e "\e[1m\e[32mnode ~/jarvis-client.js\e[0m\n"

node ~/jarvis-client.js
