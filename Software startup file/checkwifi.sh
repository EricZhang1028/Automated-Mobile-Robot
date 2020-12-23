!/bin/bash
echo "checkwifi.sh started, it will check the wifi always"

while true
do
if `/usr/bin/nmcli device show wlan0 | /bin/grep disconnected -q` ; then
    echo "The wlan0 seems to be disconnected, reconnecting..."
    /usr/bin/nmcli device connect wlan0
fi

#/bin/sleep 10
done
