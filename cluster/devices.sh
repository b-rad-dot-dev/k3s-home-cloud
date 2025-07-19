#!/bin/bash

echo "USB Devices:"
echo "Class  Vendor  Product  Manufacturer        Product Name          Device Path         ID_SERIAL"
echo "----------------------------------------------------------------------------------------------------------"

# Loop through all USB devices that have a 'dev' file
for sysdevpath in $(find /sys/bus/usb/devices/usb*/ -name dev); do
  (
    syspath="${sysdevpath%/dev}"

    # Get the device node (e.g. ttyUSB0, ttyACM0)
    devname="$(udevadm info -q name -p "$syspath")"
    [[ "$devname" == "bus/"* ]] && exit

    # Export udev properties
    eval "$(udevadm info -q property --export -p "$syspath")"

    [[ -z "$ID_VENDOR_ID" || -z "$ID_MODEL_ID" ]] && exit

    # Traverse upward to find the actual USB device with bDeviceClass
    parent="$syspath"
    while [[ "$parent" != "/" && ! -f "$parent/bDeviceClass" ]]; do
      parent=$(dirname "$parent")
    done

    if [[ -f "$parent/bDeviceClass" ]]; then
      class_hex=$(cat "$parent/bDeviceClass")
      # Ensure it's 2-digit hex (NFD uses zero-padded hex)
      class=$(printf "%02x" "0x$class_hex")
    else
      class="??"
    fi

    serial="${ID_SERIAL:-Unknown}"
    manufacturer="${ID_VENDOR:-Unknown}"
    product="${ID_MODEL:-Unknown}"

    printf "%-6s %-7s %-8s %-20s %-22s %-18s %-s\n" \
      "$class" "$ID_VENDOR_ID" "$ID_MODEL_ID" "$manufacturer" "$product" "/dev/$devname" "$serial"
  )
done