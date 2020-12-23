#gnome-terminal -e ""

gnome-terminal -e "roscore"
sleep 3

gnome-terminal -e "roslaunch rosbridge_server rosbridge_websocket.launch"
sleep 5

gnome-terminal -e "roslaunch turtlebot3_bringup turtlebot3_robot.launch"
sleep 11

gnome-terminal -e "roslaunch usb_cam usb_cam-test.launch"
sleep 5

gnome-terminal -e "roslaunch face_recognition face_recognition.launch"
sleep 5

gnome-terminal -e "rosrun web_video_server web_video_server"
sleep 3

#gnome-terminal -e "roslaunch realsense2_camera rs_rgbd.launch"
#sleep 5

#gnome-terminal -e "roslaunch depthimage_to_laserscan test.launch"
#sleep 5

gnome-terminal -e "roslaunch turtlebot3_navigation turtlebot3_navigation.launch map_file:=$HOME/goodruby.yaml"
sleep 3
