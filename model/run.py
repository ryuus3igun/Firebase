import time
import serial
from ultralytics import YOLO
import cv2
import math 
# start webcam
cap = cv2.VideoCapture(0)
cap.set(3, 640)
cap.set(4, 480)

# model
model = YOLO("best.pt")

# Kết nối với Arduino qua cổng Serial
arduino = serial.Serial(port='COM5', baudrate=11500, timeout=2)
time.sleep(2)  

# object classes
classNames = ["none", "fire", "smoke"]


while True:
    success, img = cap.read()
    results = model(img, stream=True)

    # coordinates
    for r in results:
        boxes = r.boxes

        for box in boxes:
            # bounding box
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2) # convert to int values

            # put box in cam
            cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 3)

            # confidence
            confidence = math.ceil((box.conf[0]*100))/100
            print("Confidence --->",confidence)

            num = 0
            # class name
            cls = int(box.cls[0])
            print("Class name -->", cls)
            if cls == 1 or cls == 2:
                arduino.write((str(cls)+ '\n').encode())
                break
            else: 
                arduino.write((str(0)+ '\n').encode())
                break
            # if cls == 1:
            #     num = 1
            #     break
            # time.sleep(0.1)

            # object details
            org = [x1, y1]
            font = cv2.FONT_HERSHEY_SIMPLEX
            fontScale = 1
            color = (255, 0, 0)
            thickness = 2

            cv2.putText(img, classNames[cls], org, font, fontScale, color, thickness)

    cv2.imshow('Webcam', img)
    cv2.waitKey(220)
    # if cv2.waitKey(1) == ord('q'):
    #     break

cap.release()
cv2.destroyAllWindows()