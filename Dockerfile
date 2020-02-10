## Custom Dockerfile
FROM consol/ubuntu-xfce-vnc
ENV REFRESHED_AT 2018-03-18

# Switch to root user to install additional software
USER 0

## Install a downloader
RUN  apt-get update
RUN apt-get install xautomation
RUN yes | apt-get install curl 
RUN curl -LJO https://github.com/appium/appium-desktop/releases/download/v1.15.1/Appium-linux-1.15.1.AppImage --output appium.AppImage
RUN ls
RUN chmod a+x Appium-linux-1.15.1.AppImage
RUN ./Appium-linux-1.15.1.AppImage --appimage-extract && ls
RUN nohup  /headless/squashfs-root/AppRun &>/dev/null &

## switch back to default user
USER 1000