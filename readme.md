# Appium Hub

This Project has the goal to make real device testing as easy as possible. 

---> ### TODO: Add here 1 line of Bash to start it

Now just plug in your Devices (add link here for android (usb/wifi) and iOS) and start testing.

## Services

- Adb 
    - installer
    - auto detect new android devices and load specific configuration (see ./config)
- Seleniod Bridge
    - will extend appium with /status api
    - TODO: create new Appium server for specific device when it is plugged in
    - Your devices will be visible in Selenoid UI

### Future: 
Add instruments Daemon for iOS devices
